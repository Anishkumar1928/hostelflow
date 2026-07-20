import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Image, Alert, StyleSheet } from 'react-native';
import { Icon } from '../icons';
import { colors } from '../theme';

const WARDEN_AVATAR =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120';

export default function VisitorsView({ visitors, onAddVisitor, onCheckOutVisitor }) {
  const [showForm, setShowForm] = useState(false);
  const [visitorName, setVisitorName] = useState('');
  const [studentName, setStudentName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const activeVisitors = visitors.filter((v) => v.status === 'in-premise');
  const checkedOutCount = visitors.filter((v) => v.status === 'checked-out').length;
  const totalToday = visitors.length;

  const handleSubmit = () => {
    if (!visitorName.trim() || !studentName.trim()) {
      Alert.alert('Error', 'Please provide both Visitor Name and Host Student Name.');
      return;
    }
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = (hours % 12 || 12).toString();
    const entryTime = `${formattedHours}:${minutes} ${ampm}`;

    onAddVisitor({
      id: `V-${Date.now()}`,
      name: visitorName.trim(),
      studentName: studentName.trim(),
      entryTime,
      status: 'in-premise',
    });
    setVisitorName('');
    setStudentName('');
    setShowForm(false);
  };

  const filteredVisitors = activeVisitors.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarContainer}>
            <Image style={styles.avatar} source={{ uri: WARDEN_AVATAR }} />
          </View>
          <Text style={styles.headerTitle}>Visitors</Text>
        </View>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => Alert.alert('Total', `${activeVisitors.length} visitors in premise`)}
        >
          <Icon name="account-group" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.bannerCard}>
          <View style={styles.bannerInfo}>
            <Text style={styles.bannerLabel}>Total Today</Text>
            <Text style={styles.bannerCount}>{totalToday}</Text>
            <Text style={styles.bannerSub}>
              {activeVisitors.length} active • {checkedOutCount} checked out
            </Text>
          </View>
          <View style={styles.bannerIconWrap}>
            <Icon name="account-group" size={32} color="white" />
          </View>
        </View>

        <View style={styles.section}>
          {!showForm ? (
            <TouchableOpacity onPress={() => setShowForm(true)} style={styles.addBtn}>
              <Icon name="account-plus" size={20} color="white" />
              <Text style={styles.addBtnText}>Log New Visitor</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.formCard}>
              <View style={styles.formHeader}>
                <View style={styles.formHeaderLeft}>
                  <Icon name="account-plus" size={16} color={colors.primary} />
                  <Text style={styles.formTitle}>Register New Entry</Text>
                </View>
                <TouchableOpacity onPress={() => setShowForm(false)}>
                  <Text style={styles.formCancel}>Cancel</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.inputLabel}>Visitor Full Name</Text>
              <TextInput
                value={visitorName}
                onChangeText={setVisitorName}
                placeholder="e.g. Robert Stevenson"
                style={styles.input}
              />
              <Text style={styles.inputLabel}>Host Student Name / Room</Text>
              <TextInput
                value={studentName}
                onChangeText={setStudentName}
                placeholder="e.g. Alex Chen (Room 302)"
                style={styles.input}
              />
              <TouchableOpacity onPress={handleSubmit} style={styles.submitBtn}>
                <Text style={styles.submitBtnText}>Confirm Visitor Entry</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Current Visitors</Text>
            <View style={styles.listBadge}>
              <Text style={styles.listBadgeText}>Active ({activeVisitors.length})</Text>
            </View>
          </View>

          <View style={styles.searchBar}>
            <Icon name="magnify" size={20} color={colors.outline} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search visitors..."
              style={styles.searchInput}
            />
          </View>

          <View style={styles.visitorList}>
            {filteredVisitors.length > 0 ? (
              filteredVisitors.map((visitor) => (
                <View key={visitor.id} style={styles.visitorCard}>
                  <View style={styles.visitorRow}>
                    <View style={styles.visitorInfo}>
                      <View style={styles.visitorAvatar}>
                        <Icon name="account" size={24} color={colors.secondary} />
                      </View>
                      <View style={styles.visitorDetails}>
                        <Text style={styles.visitorName}>{visitor.name}</Text>
                        <View style={styles.visitorStudent}>
                          <Icon name="school" size={14} color={colors.secondary} />
                          <Text style={styles.visitorStudentText}>Student: {visitor.studentName}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.visitorTime}>
                      <View style={styles.visitorTimeRow}>
                        <Icon name="clock" size={12} color={colors.primary} />
                        <Text style={styles.visitorTimeText}>{visitor.entryTime}</Text>
                      </View>
                      <Text style={styles.visitorTimeLabel}>Entry</Text>
                    </View>
                  </View>
                  <View style={styles.visitorActions}>
                    <View style={styles.statusBadge}>
                      <View style={styles.statusDot} />
                      <Text style={styles.statusText}>In Premise</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => onCheckOutVisitor(visitor.id)}
                      style={styles.checkoutBtn}
                    >
                      <Icon name="logout" size={14} color={colors.error} />
                      <Text style={styles.checkoutBtnText}>Check Out</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Icon name="account-check" size={40} color={colors.outlineVariant} />
                <Text style={styles.emptyStateText}>No active visitors</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 64,
    backgroundColor: colors.surfaceContainerLowest,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainer,
  },
  avatar: { width: '100%', height: '100%' },
  headerTitle: { fontSize: 20, fontWeight: '700', letterSpacing: -0.5, color: colors.primary },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: colors.surfaceContainerLow,
  },
  scroll: { flex: 1, paddingHorizontal: 16 },
  scrollContent: { paddingBottom: 120, paddingTop: 16 },
  bannerCard: {
    backgroundColor: colors.primaryContainer,
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  bannerInfo: { flex: 1 },
  bannerLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(238,239,255,0.9)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bannerCount: { fontSize: 36, fontWeight: '800', color: 'white', marginVertical: 4 },
  bannerSub: { fontSize: 12, color: 'rgba(238,239,255,0.9)', fontWeight: '500' },
  bannerIconWrap: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 16, borderRadius: 9999 },
  section: { marginBottom: 24 },
  addBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: 'white', fontWeight: '700', marginLeft: 8 },
  formCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 16,
    padding: 20,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
    paddingBottom: 12,
    marginBottom: 16,
  },
  formHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  formTitle: { fontWeight: '700', color: colors.onSurface, fontSize: 14, textTransform: 'uppercase', letterSpacing: 0.5 },
  formCancel: { fontSize: 12, color: colors.onSurfaceVariant, fontWeight: '700' },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 48,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 12,
    fontSize: 14,
    fontWeight: '500',
    color: colors.onSurface,
    marginBottom: 16,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnText: { color: 'white', fontWeight: '700', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  listSection: { marginBottom: 16 },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  listTitle: { fontSize: 18, fontWeight: '700', color: colors.onSurface },
  listBadge: {
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  listBadgeText: { fontSize: 12, fontWeight: '700', color: colors.onSurfaceVariant, textTransform: 'uppercase' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    marginBottom: 16,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, fontWeight: '500', color: colors.onSurface },
  visitorList: { gap: 12 },
  visitorCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 16,
    padding: 16,
  },
  visitorRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  visitorInfo: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  visitorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  visitorDetails: { flex: 1, marginRight: 8 },
  visitorName: { fontWeight: '700', color: colors.onSurface, fontSize: 16 },
  visitorStudent: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  visitorStudentText: { fontSize: 12, color: colors.onSurfaceVariant, fontWeight: '500' },
  visitorTime: { alignItems: 'flex-end' },
  visitorTimeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  visitorTimeText: { fontSize: 12, color: colors.primary, fontWeight: '800' },
  visitorTimeLabel: { fontSize: 10, color: colors.onSurfaceVariant, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 },
  visitorActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
  },
  statusBadge: {
    backgroundColor: colors.secondaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary },
  statusText: { fontSize: 12, fontWeight: '600', color: colors.onSecondaryContainer },
  checkoutBtn: {
    borderWidth: 1,
    borderColor: 'rgba(186,26,26,0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(186,26,26,0.05)',
  },
  checkoutBtnText: { color: colors.error, fontWeight: '700', fontSize: 12 },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 16,
  },
  emptyStateText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 16,
  },
});
