import { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from './theme';
import { INITIAL_STUDENTS, INITIAL_COMPLAINTS, INITIAL_VISITORS } from './data';
import BottomNavBar from './components/BottomNavBar';
import HomeView from './components/HomeView';
import AttendanceView from './components/AttendanceView';
import ComplaintsView from './components/ComplaintsView';
import VisitorsView from './components/VisitorsView';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
  const [visitors, setVisitors] = useState(INITIAL_VISITORS);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadState = async () => {
      try {
        const savedStudents = await AsyncStorage.getItem('hf_students');
        if (savedStudents) setStudents(JSON.parse(savedStudents));
        const savedComplaints = await AsyncStorage.getItem('hf_complaints');
        if (savedComplaints) setComplaints(JSON.parse(savedComplaints));
        const savedVisitors = await AsyncStorage.getItem('hf_visitors');
        if (savedVisitors) setVisitors(JSON.parse(savedVisitors));
      } catch (e) {
        console.error(e);
      } finally {
        setIsReady(true);
      }
    };
    loadState();
  }, []);

  useEffect(() => {
    if (!isReady) return;
    AsyncStorage.setItem('hf_students', JSON.stringify(students)).catch(() => {});
  }, [students, isReady]);

  useEffect(() => {
    if (!isReady) return;
    AsyncStorage.setItem('hf_complaints', JSON.stringify(complaints)).catch(() => {});
  }, [complaints, isReady]);

  useEffect(() => {
    if (!isReady) return;
    AsyncStorage.setItem('hf_visitors', JSON.stringify(visitors)).catch(() => {});
  }, [visitors, isReady]);

  const handleUpdateAttendance = (studentId, status) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, attendanceStatus: status } : s))
    );
  };

  const handleSubmitAllAttendance = () => {};

  const handleAddComplaint = (newComplaint) => {
    setComplaints((prev) => [newComplaint, ...prev]);
  };

  const handleUpdateComplaintStatus = (id, status) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
    setSelectedComplaint((prev) =>
      prev && prev.id === id ? { ...prev, status } : prev
    );
  };

  const handleAddVisitor = (newVisitor) => {
    setVisitors((prev) => [newVisitor, ...prev]);
  };

  const handleCheckOutVisitor = (id) => {
    setVisitors((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              status: 'checked-out',
              checkOutTime: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
            }
          : v
      )
    );
  };

  if (!isReady) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        {activeTab === 'home' && (
          <HomeView
            onTabChange={setActiveTab}
            pendingComplaintsCount={complaints.filter((c) => c.status !== 'resolved').length}
            activeVisitorsCount={visitors.filter((v) => v.status === 'in-premise').length}
            criticalComplaints={complaints.filter((c) => c.priority === 'critical' && c.status !== 'resolved')}
            onSelectComplaint={(c) => { setSelectedComplaint(c); setActiveTab('complaints'); }}
            onOpenNewVisitor={() => setActiveTab('visitors')}
          />
        )}
        {activeTab === 'attendance' && (
          <AttendanceView
            students={students}
            onUpdateAttendance={handleUpdateAttendance}
            onSubmitAllAttendance={handleSubmitAllAttendance}
          />
        )}
        {activeTab === 'complaints' && (
          <ComplaintsView
            complaints={complaints}
            selectedComplaint={selectedComplaint}
            onSelectComplaint={setSelectedComplaint}
            onAddComplaint={handleAddComplaint}
            onUpdateComplaintStatus={handleUpdateComplaintStatus}
          />
        )}
        {activeTab === 'visitors' && (
          <VisitorsView
            visitors={visitors}
            onAddVisitor={handleAddVisitor}
            onCheckOutVisitor={handleCheckOutVisitor}
          />
        )}
      </View>
      <BottomNavBar activeTab={activeTab} onTabChange={setActiveTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, paddingBottom: 80 },
});
