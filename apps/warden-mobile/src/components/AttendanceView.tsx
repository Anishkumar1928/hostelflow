import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Image, Alert, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { CheckCircle, XCircle, Calendar, Search, Check, CalendarRange, ListTodo, Server } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Student, AttendanceRecord, AttendanceStatus } from '../types';
import { INITIAL_ATTENDANCE_HISTORY } from '../data';
import { colors } from '../theme';

interface AttendanceViewProps {
  students: Student[];
  onUpdateAttendance: (id: string, status: AttendanceStatus) => void;
  onSubmitAllAttendance: (stats: { present: number; absent: number; leave: number }) => void;
}

const WARDEN_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuBDEdu7lEzmYHPpgTbjCtiHm-2o-_6nQScBNjiCU7UgNjePWPBd1dUAOFCZtq8mkqBwIHvpBhanpTfidPwhfw3OIE4ER0hNrT6JUnmP3X3qY0g8Iczg-gh6_nLvM0kpTQF5CFmdpRyAE4Wc1yMG6i1lNFKWKVwO-AnE1rGjUXwEMkt1QFckRjeEBSjScPyVKJPB1Wln7F3bZP8Ae8i8nY-fO3b4lV_opft-OewcP_GomKamepnzLHAO";

export default function AttendanceView({ students, onUpdateAttendance, onSubmitAllAttendance }: AttendanceViewProps) {
  const [activeTab, setActiveTab] = useState<'mark' | 'history'>('mark');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [history, setHistory] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE_HISTORY);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const saved = await AsyncStorage.getItem('hf_attendance_history');
        if (saved) setHistory(JSON.parse(saved));
      } catch (e) { console.error(e); }
    };
    loadHistory();
  }, []);

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    onUpdateAttendance(studentId, status);
  };

  const handleAttendanceSubmit = () => {
    const unassignedCount = students.filter(s => s.attendanceStatus === undefined).length;
    if (unassignedCount > 0) {
      Alert.alert("Unmarked Students", `There are ${unassignedCount} students without any attendance marked. Submit anyway?`, [
        { text: "Cancel", style: "cancel" },
        { text: "Submit", onPress: executeSubmit }
      ]);
    } else {
      executeSubmit();
    }
  };

  const executeSubmit = () => {
    setIsSubmitting(true);
    let present = 0, absent = 0, leave = 0;
    students.forEach(s => {
      if (s.attendanceStatus === 'present') present++;
      else if (s.attendanceStatus === 'absent') absent++;
      else if (s.attendanceStatus === 'leave') leave++;
      else present++;
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      const today = new Date();
      const formattedDate = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      const newRecord: AttendanceRecord = { date: formattedDate, present: 1248 - absent - leave, absent, leave };
      const updatedHistory = [newRecord, ...history];
      setHistory(updatedHistory);
      AsyncStorage.setItem('hf_attendance_history', JSON.stringify(updatedHistory)).catch(console.error);
      onSubmitAllAttendance({ present, absent, leave });
      setTimeout(() => setSubmitSuccess(false), 2000);
    }, 1500);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarContainer}>
            <Image style={styles.avatar} source={{ uri: WARDEN_AVATAR }} />
          </View>
          <Text style={styles.headerTitle}>Attendance</Text>
        </View>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => Alert.alert("Status", "Daily Attendance Service Status: ONLINE. Ready to submit.")}
        >
          <Server size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <View style={styles.tabBar}>
            <View style={styles.tabInner}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setActiveTab('mark')}
                style={[styles.tab, activeTab === 'mark' && styles.tabActive]}
              >
                <Text style={[styles.tabText, activeTab === 'mark' && styles.tabTextActive]}>Mark Attendance</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setActiveTab('history')}
                style={[styles.tab, activeTab === 'history' && styles.tabActive]}
              >
                <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>History</Text>
              </TouchableOpacity>
            </View>
          </View>

          {activeTab === 'mark' && (
            <View style={styles.searchBar}>
              <Search size={20} color={colors.outline} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search by student name or room number..."
                style={styles.searchInput}
              />
            </View>
          )}

          {activeTab === 'mark' ? (
            <View>
              <View style={styles.listHeader}>
                <Text style={styles.listHeaderText}>Student Identity & Room</Text>
                <Text style={styles.listHeaderText}>Roster Mark</Text>
              </View>
              <View style={styles.studentList}>
                {filteredStudents.map((student) => {
                  const isPresent = student.attendanceStatus === 'present';
                  const isAbsent = student.attendanceStatus === 'absent';
                  const isLeave = student.attendanceStatus === 'leave';
                  return (
                    <View key={student.id} style={styles.studentCard}>
                      <View style={styles.studentCardHeader}>
                        <View style={styles.studentInfo}>
                          <View style={styles.studentAvatar}>
                            <Image style={styles.studentAvatarImg} source={{ uri: student.avatar }} />
                          </View>
                          <View>
                            <Text style={styles.studentName}>{student.name}</Text>
                            <Text style={styles.studentId}>{student.id}</Text>
                          </View>
                        </View>
                        <View style={styles.roomBadge}>
                          <Text style={styles.roomBadgeText}>{student.room}</Text>
                        </View>
                      </View>
                      <View style={styles.statusRow}>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => handleStatusChange(student.id, 'present')}
                          style={[styles.statusBtn, isPresent && styles.statusPresentActive]}
                        >
                          <CheckCircle size={16} color={isPresent ? '#15803d' : colors.outline} />
                          <Text style={[styles.statusBtnText, isPresent && styles.statusPresentText]}>Present</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => handleStatusChange(student.id, 'absent')}
                          style={[styles.statusBtn, isAbsent && styles.statusAbsentActive]}
                        >
                          <XCircle size={16} color={isAbsent ? '#b91c1c' : colors.outline} />
                          <Text style={[styles.statusBtnText, isAbsent && styles.statusAbsentText]}>Absent</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => handleStatusChange(student.id, 'leave')}
                          style={[styles.statusBtn, isLeave && styles.statusLeaveActive]}
                        >
                          <Calendar size={16} color={isLeave ? '#a16207' : colors.outline} />
                          <Text style={[styles.statusBtnText, isLeave && styles.statusLeaveText]}>Leave</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          ) : (
            <View>
              <View style={styles.historyHeader}>
                <View style={styles.historyHeaderLeft}>
                  <CalendarRange size={20} color={colors.primary} />
                  <Text style={styles.historyTitle}>Previous Records</Text>
                </View>
                <View style={styles.historyBadge}>
                  <Text style={styles.historyBadgeText}>Logs ({history.length})</Text>
                </View>
              </View>
              <View style={styles.historyList}>
                {history.map((record, index) => (
                  <View key={index} style={styles.historyCard}>
                    <View style={styles.historyCardHeader}>
                      <View style={styles.historyDate}>
                        <ListTodo size={14} color={colors.primary} />
                        <Text style={styles.historyDateText}>{record.date}</Text>
                      </View>
                      <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedBadgeText}>Verified</Text>
                      </View>
                    </View>
                    <View style={styles.historyStats}>
                      <View style={[styles.historyStat, { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }]}>
                        <Text style={[styles.historyStatLabel, { color: '#166534' }]}>Present</Text>
                        <Text style={[styles.historyStatNumber, { color: '#166534' }]}>{record.present}</Text>
                      </View>
                      <View style={[styles.historyStat, { backgroundColor: '#fef2f2', borderColor: '#fecaca' }]}>
                        <Text style={[styles.historyStatLabel, { color: '#991b1b' }]}>Absent</Text>
                        <Text style={[styles.historyStatNumber, { color: '#991b1b' }]}>{record.absent}</Text>
                      </View>
                      <View style={[styles.historyStat, { backgroundColor: '#fefce8', borderColor: '#fef08a' }]}>
                        <Text style={[styles.historyStatLabel, { color: '#854d0e' }]}>On Leave</Text>
                        <Text style={[styles.historyStatNumber, { color: '#854d0e' }]}>{record.leave}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {activeTab === 'mark' && (
        <View style={styles.submitFloat}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleAttendanceSubmit}
            disabled={isSubmitting || submitSuccess}
            style={[styles.submitBtn, submitSuccess ? { backgroundColor: colors.success } : isSubmitting ? { backgroundColor: 'rgba(0,74,198,0.8)' } : { backgroundColor: colors.primary }]}
          >
            {isSubmitting ? (
              <Text style={styles.submitBtnText}>Processing...</Text>
            ) : submitSuccess ? (
              <>
                <Check size={20} color="white" />
                <Text style={styles.submitBtnText}>Success</Text>
              </>
            ) : (
              <>
                <CheckCircle size={20} color="white" />
                <Text style={styles.submitBtnText}>Submit Attendance</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, height: 64, backgroundColor: colors.surfaceContainerLowest,
    borderBottomWidth: 1, borderBottomColor: colors.outlineVariant,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarContainer: {
    width: 40, height: 40, borderRadius: 20, overflow: 'hidden',
    borderWidth: 1, borderColor: colors.outlineVariant, backgroundColor: colors.surfaceContainer,
  },
  avatar: { width: '100%', height: '100%' },
  headerTitle: { fontSize: 20, fontWeight: '700', letterSpacing: -0.5, color: colors.primary },
  headerBtn: {
    width: 40, height: 40, alignItems: 'center', justifyContent: 'center',
    borderRadius: 20, backgroundColor: colors.surfaceContainerLow,
  },
  scroll: { flex: 1, paddingHorizontal: 16 },
  scrollContent: { paddingBottom: 120, paddingTop: 16 },
  tabBar: { marginBottom: 16 },
  tabInner: { flexDirection: 'row', padding: 4, backgroundColor: colors.surfaceContainer, borderRadius: 12, alignSelf: 'flex-start' },
  tab: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  tabActive: { backgroundColor: colors.surfaceContainerLowest },
  tabText: { fontSize: 12, fontWeight: '700', color: colors.onSurfaceVariant },
  tabTextActive: { color: colors.primary },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 12,
    paddingHorizontal: 16, height: 48, marginBottom: 16,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, fontWeight: '500', color: colors.onSurface },
  listHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4, marginBottom: 8 },
  listHeaderText: { fontSize: 12, color: colors.outline, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  studentList: { gap: 12 },
  studentCard: {
    backgroundColor: colors.surfaceContainerLowest, borderWidth: 1,
    borderColor: colors.outlineVariant, borderRadius: 16, padding: 16,
  },
  studentCardHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16,
  },
  studentInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  studentAvatar: {
    width: 48, height: 48, borderRadius: 24, overflow: 'hidden',
    borderWidth: 1, borderColor: colors.outlineVariant, backgroundColor: colors.surfaceContainer,
  },
  studentAvatarImg: { width: '100%', height: '100%' },
  studentName: { fontWeight: '700', color: colors.onSurface, fontSize: 16, letterSpacing: -0.3 },
  studentId: { fontSize: 12, color: colors.outline, marginTop: 2 },
  roomBadge: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: colors.surfaceContainer, borderRadius: 8 },
  roomBadgeText: { fontWeight: '700', fontSize: 12, color: colors.primary },
  statusRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.outlineVariant,
  },
  statusBtn: {
    flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    gap: 6, paddingVertical: 10, borderRadius: 9999, borderWidth: 1, borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLowest,
  },
  statusPresentActive: { backgroundColor: '#f0fdf4', borderColor: '#16a34a' },
  statusAbsentActive: { backgroundColor: '#fef2f2', borderColor: '#dc2626' },
  statusLeaveActive: { backgroundColor: '#fefce8', borderColor: '#ca8a04' },
  statusBtnText: { fontSize: 12, fontWeight: '700', color: colors.onSurfaceVariant },
  statusPresentText: { color: '#166534' },
  statusAbsentText: { color: '#991b1b' },
  statusLeaveText: { color: '#854d0e' },
  historyHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4, marginBottom: 16,
  },
  historyHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  historyTitle: { fontSize: 18, fontWeight: '700', color: colors.onSurface },
  historyBadge: { backgroundColor: colors.surfaceContainer, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  historyBadgeText: { fontSize: 12, fontWeight: '700', color: colors.outline, textTransform: 'uppercase' },
  historyList: { gap: 12 },
  historyCard: {
    backgroundColor: colors.surfaceContainerLowest, borderWidth: 1,
    borderColor: colors.outlineVariant, borderRadius: 16, padding: 16,
  },
  historyCardHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderBottomWidth: 1, borderBottomColor: colors.outlineVariant, paddingBottom: 8, marginBottom: 12,
  },
  historyDate: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  historyDateText: { fontSize: 12, fontWeight: '700', color: colors.onSurfaceVariant },
  verifiedBadge: { backgroundColor: 'rgba(0,74,198,0.1)', paddingHorizontal: 10, paddingVertical: 2, borderRadius: 9999 },
  verifiedBadgeText: { fontSize: 10, color: colors.primary, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  historyStats: { flexDirection: 'row', gap: 8 },
  historyStat: { flex: 1, padding: 8, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  historyStatLabel: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  historyStatNumber: { fontSize: 18, fontWeight: '800', marginTop: 4 },
  submitFloat: { position: 'absolute', bottom: 24, right: 16, zIndex: 40 },
  submitBtn: {
    paddingHorizontal: 24, paddingVertical: 16, borderRadius: 9999,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  submitBtnText: { color: 'white', fontWeight: '700', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
});
