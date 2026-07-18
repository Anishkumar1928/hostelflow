import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert, StyleSheet } from 'react-native';
import {
  Users, AlertTriangle, UserPlus, ChevronRight, Phone, MessageSquare,
  ShieldAlert, CheckCircle, Clock, Bell, CalendarClock, UserCheck
} from 'lucide-react-native';
import { Complaint } from '../types';
import { colors } from '../theme';

interface HomeViewProps {
  onTabChange: (tab: 'home' | 'attendance' | 'complaints' | 'visitors') => void;
  pendingComplaintsCount: number;
  activeVisitorsCount: number;
  criticalComplaints: Complaint[];
  onSelectComplaint: (complaint: Complaint) => void;
  onOpenNewVisitor: () => void;
}

const WARDEN_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuCFXyWamq8jjVE5k20JXy4jW4zg4RWsUniwctczB2cXt3k7w9Xj9KOEBHfmzkFTVn1M9xJQyFd0aNLm9p0rnmDIN-7cets_bp4pYD6xI10St5QMBo2qxoPwMHxY7Xxwoh12xByLYeY0gWGs9grTUOMSoRf_oMK1ITDD1JgE5g7I--iwl82l9vm1w1RnkmzVui2BgP9dWfNGahjAtIUY5cu5__Phm3_VDr8YZ9h8HpkG4G5I1UBbJUxa";

export default function HomeView({
  onTabChange, pendingComplaintsCount, activeVisitorsCount,
  criticalComplaints, onSelectComplaint, onOpenNewVisitor
}: HomeViewProps) {
  const [notifiedParents, setNotifiedParents] = useState(false);
  const [calledStudent, setCalledStudent] = useState(false);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarContainer}>
            <Image style={styles.avatar} source={{ uri: WARDEN_AVATAR }} />
          </View>
          <Text style={styles.headerTitle}>HostelFlow</Text>
        </View>
        <TouchableOpacity
          style={styles.notifBtn}
          onPress={() => Alert.alert("Notifications", "All notification services are fully operational. No new alerts.")}
        >
          <View>
            <Bell size={24} color={colors.primary} />
            <View style={styles.notifDot} />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.greeting}>
          <Text style={styles.greetingTitle}>Daily Overview</Text>
          <Text style={styles.greetingSub}>Wednesday, Oct 25 • Sector 4 Block A</Text>
        </View>

        <View style={styles.statsGrid}>
          <TouchableOpacity activeOpacity={0.8} style={styles.statMainCard}>
            <View style={styles.statMainTop}>
              <View style={styles.statIconBg}>
                <Users size={24} color={colors.primary} />
              </View>
              <View style={styles.liveBadge}>
                <Text style={styles.liveBadgeText}>Live</Text>
              </View>
            </View>
            <Text style={styles.statMainNumber}>1,248</Text>
            <Text style={styles.statMainLabel}>Active Students</Text>
          </TouchableOpacity>

          <View style={styles.statsRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onTabChange('complaints')}
              style={styles.statSmallCard}
            >
              <View style={[styles.statIconBgSmall, { backgroundColor: 'rgba(186,26,26,0.1)' }]}>
                <AlertTriangle size={20} color={colors.error} />
              </View>
              <Text style={styles.statSmallNumber}>{pendingComplaintsCount}</Text>
              <Text style={styles.statSmallLabel}>Pending Complaints</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onTabChange('visitors')}
              style={[styles.statSmallCard, { backgroundColor: colors.secondaryContainer }]}
            >
              <View style={[styles.statIconBgSmall, { backgroundColor: 'rgba(88,95,108,0.1)' }]}>
                <UserPlus size={20} color={colors.primary} />
              </View>
              <Text style={styles.statSmallNumber}>{activeVisitorsCount}</Text>
              <Text style={styles.statSmallLabel}>Incoming Visitors</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.quickTasks}>
          <Text style={styles.sectionLabel}>Quick Tasks</Text>
          <View style={styles.tasksList}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onTabChange('attendance')}
              style={styles.taskCard}
            >
              <View style={[styles.taskIcon, { backgroundColor: colors.primary }]}>
                <CalendarClock size={20} color="white" />
              </View>
              <View style={styles.taskInfo}>
                <Text style={styles.taskTitle}>Mark Night Attendance</Text>
                <Text style={styles.taskSub}>Scheduled for 10:00 PM</Text>
              </View>
              <ChevronRight size={20} color={colors.outline} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                onTabChange('attendance');
                setTimeout(() => Alert.alert("Action", "Filtering student list by pending leaves."), 300);
              }}
              style={styles.taskCard}
            >
              <View style={[styles.taskIcon, { backgroundColor: colors.tertiaryContainer }]}>
                <UserCheck size={20} color="white" />
              </View>
              <View style={styles.taskInfo}>
                <Text style={styles.taskTitle}>Approve Leave</Text>
                <Text style={styles.taskSub}>14 pending requests</Text>
              </View>
              <ChevronRight size={20} color={colors.outline} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onOpenNewVisitor}
              style={styles.taskCard}
            >
              <View style={[styles.taskIcon, { backgroundColor: colors.secondary }]}>
                <UserPlus size={20} color="white" />
              </View>
              <View style={styles.taskInfo}>
                <Text style={styles.taskTitle}>Register Visitor</Text>
                <Text style={styles.taskSub}>New entry registration</Text>
              </View>
              <ChevronRight size={20} color={colors.outline} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.alerts}>
          <View style={styles.alertsHeader}>
            <Text style={styles.sectionLabel}>Recent Alerts</Text>
            <TouchableOpacity onPress={() => onTabChange('complaints')}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.alertsList}>
            {criticalComplaints.map((item) => (
              <TouchableOpacity
                activeOpacity={0.8}
                key={item.id}
                onPress={() => onSelectComplaint(item)}
                style={styles.alertCard}
              >
                <View style={styles.alertCardHeader}>
                  <View style={styles.alertBadge}>
                    <ShieldAlert size={16} color={colors.error} />
                    <Text style={styles.alertBadgeText}>CRITICAL COMPLAINT</Text>
                  </View>
                  <Text style={styles.alertTime}>{item.timeAgo}</Text>
                </View>
                <Text style={styles.alertTitle}>{item.title} ({item.room})</Text>
                <Text style={styles.alertDesc}>Immediate attention required. Reported by {item.reportedBy}.</Text>
              </TouchableOpacity>
            ))}

            <View style={styles.overdueCard}>
              <View style={styles.alertCardHeader}>
                <View style={[styles.alertBadge, { borderColor: 'transparent' }]}>
                  <Clock size={16} color={colors.tertiary} />
                  <Text style={[styles.alertBadgeText, { color: colors.tertiary }]}>OVERDUE LEAVE</Text>
                </View>
                <Text style={styles.alertTime}>1h ago</Text>
              </View>
              <Text style={styles.alertTitle}>Aditya Verma (Room 105)</Text>
              <Text style={styles.alertDesc}>
                Expected return was 8:00 PM. Student is not reachable via primary mobile connection.
              </Text>

              <View style={styles.overdueActions}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setCalledStudent(true);
                    Alert.alert("Calling", "Initiating secure proxy call to Student Aditya Verma (+91 99887 76655). Connection established.");
                  }}
                  style={[styles.overdueBtn, calledStudent ? styles.overdueBtnSecondary : styles.overdueBtnPrimary]}
                >
                  <Phone size={14} color="white" />
                  <Text style={styles.overdueBtnText}>{calledStudent ? 'Calling...' : 'Call Student'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setNotifiedParents(true);
                    Alert.alert("Notified", "Sending high-priority SMS and Email alerts to Parents of Aditya Verma. Sent successfully.");
                  }}
                  style={[
                    styles.overdueBtnOutline,
                    notifiedParents && { backgroundColor: colors.successContainer, borderColor: '#86efac' }
                  ]}
                >
                  {notifiedParents ? (
                    <CheckCircle size={14} color={colors.success} />
                  ) : (
                    <MessageSquare size={14} color={colors.onSurface} />
                  )}
                  <Text style={[styles.overdueBtnOutlineText, notifiedParents && { color: '#166534' }]}>
                    {notifiedParents ? 'Parents Notified' : 'Notify Parents'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.banner}>
          <View style={styles.bannerGlow} />
          <View>
            <View style={styles.bannerStatus}>
              <View style={styles.bannerDot} />
              <Text style={styles.bannerStatusText}>Warden Center Online</Text>
            </View>
            <Text style={styles.bannerDesc}>
              System running smoothly. All services and network logs are operational.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
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
  notifBtn: {
    width: 40, height: 40, alignItems: 'center', justifyContent: 'center',
    borderRadius: 20, backgroundColor: colors.surfaceContainerLow,
  },
  notifDot: {
    position: 'absolute', top: -4, right: -4, width: 10, height: 10,
    borderRadius: 5, backgroundColor: colors.error, borderWidth: 2, borderColor: colors.surfaceContainerLowest,
  },
  scroll: { flex: 1, paddingHorizontal: 16 },
  scrollContent: { paddingBottom: 120, paddingTop: 16 },
  greeting: { marginBottom: 24 },
  greetingTitle: { fontSize: 24, fontWeight: '800', color: colors.onSurface },
  greetingSub: { fontSize: 14, color: colors.onSurfaceVariant, fontWeight: '500', marginTop: 4 },
  statsGrid: { marginBottom: 24, gap: 12 },
  statMainCard: {
    backgroundColor: colors.surfaceContainerLowest, borderWidth: 1,
    borderColor: colors.outlineVariant, borderRadius: 16, padding: 16,
  },
  statMainTop: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16,
  },
  statIconBg: {
    backgroundColor: 'rgba(0,74,198,0.1)', padding: 8, borderRadius: 8,
  },
  liveBadge: {
    backgroundColor: colors.primaryFixed, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 9999,
  },
  liveBadgeText: { fontSize: 12, fontWeight: '600', color: colors.onPrimaryFixed },
  statMainNumber: { fontSize: 30, fontWeight: '800', color: colors.onSurface },
  statMainLabel: { fontSize: 12, fontWeight: '600', color: colors.onSurfaceVariant, marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statSmallCard: {
    flex: 1, backgroundColor: colors.errorContainer, borderWidth: 1,
    borderColor: colors.outlineVariant, borderRadius: 16, padding: 16,
  },
  statIconBgSmall: { padding: 8, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 16 },
  statSmallNumber: { fontSize: 24, fontWeight: '800', color: colors.onSurface },
  statSmallLabel: { fontSize: 12, fontWeight: '700', color: colors.onSurfaceVariant, marginTop: 4, opacity: 0.9 },
  quickTasks: { marginBottom: 24 },
  sectionLabel: {
    fontSize: 12, fontWeight: '700', color: colors.onSurfaceVariant,
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12,
  },
  tasksList: { gap: 8 },
  taskCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceContainer,
    borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 16, padding: 16,
  },
  taskIcon: {
    width: 40, height: 40, borderRadius: 12, alignItems: 'center',
    justifyContent: 'center', marginRight: 12,
  },
  taskInfo: { flex: 1 },
  taskTitle: { fontSize: 14, fontWeight: '700', color: colors.onSurface },
  taskSub: { fontSize: 12, color: colors.onSurfaceVariant, fontWeight: '500', marginTop: 2 },
  alerts: { marginBottom: 24 },
  alertsHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12,
  },
  viewAll: { fontSize: 12, fontWeight: '700', color: colors.primary },
  alertsList: { gap: 12 },
  alertCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderLeftWidth: 4, borderLeftColor: colors.error,
    borderWidth: 1, borderColor: colors.outlineVariant,
    padding: 16, borderRadius: 16,
  },
  alertCardHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4,
  },
  alertBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
  },
  alertBadgeText: {
    fontSize: 12, color: colors.error, fontWeight: '800', marginLeft: 4,
  },
  alertTime: { fontSize: 12, color: colors.onSurfaceVariant, fontWeight: '600' },
  alertTitle: { fontSize: 14, fontWeight: '700', color: colors.onSurface, marginTop: 4 },
  alertDesc: { fontSize: 12, color: colors.onSurfaceVariant, fontWeight: '500', marginTop: 4 },
  overdueCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderLeftWidth: 4, borderLeftColor: colors.tertiary,
    borderWidth: 1, borderColor: colors.outlineVariant,
    padding: 16, borderRadius: 16,
  },
  overdueActions: { flexDirection: 'row', gap: 8, marginTop: 16 },
  overdueBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1 },
  overdueBtnPrimary: { backgroundColor: colors.primary },
  overdueBtnSecondary: { backgroundColor: colors.secondary },
  overdueBtnText: { color: 'white', fontSize: 12, fontWeight: '700', marginLeft: 6 },
  overdueBtnOutline: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12,
    borderWidth: 1, borderColor: colors.outlineVariant,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1,
    backgroundColor: colors.surfaceContainer,
  },
  overdueBtnOutlineText: { fontSize: 12, fontWeight: '700', marginLeft: 6, color: colors.onSurface },
  banner: {
    height: 112, borderRadius: 16, backgroundColor: colors.primaryFixed,
    overflow: 'hidden', flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, borderWidth: 1, borderColor: colors.outlineVariant, marginBottom: 16,
  },
  bannerGlow: {
    position: 'absolute', right: -20, bottom: -20, opacity: 0.1,
    width: 160, height: 160, borderRadius: 80, backgroundColor: colors.primary,
  },
  bannerStatus: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  bannerDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.success },
  bannerStatusText: {
    fontSize: 12, fontWeight: '700', color: colors.primary,
    textTransform: 'uppercase', letterSpacing: 2,
  },
  bannerDesc: {
    fontSize: 14, fontWeight: '600', color: colors.onSurfaceVariant,
    maxWidth: 260, lineHeight: 22,
  },
});
