import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Image, Alert, Modal, StyleSheet } from 'react-native';
import {
  AlertTriangle, Wrench, Zap, Archive as Cabinet, Wifi, Clipboard,
  Plus, Search, Phone, ShieldAlert, Check, X, MapPin, Hammer, ChevronRight
} from 'lucide-react-native';
import { Complaint, ComplaintPriority, ComplaintStatus } from '../types';
import { colors } from '../theme';

interface ComplaintsViewProps {
  complaints: Complaint[];
  selectedComplaint: Complaint | null;
  onSelectComplaint: (complaint: Complaint | null) => void;
  onAddComplaint: (newComplaint: Complaint) => void;
  onUpdateComplaintStatus: (id: string, status: ComplaintStatus) => void;
}

const WARDEN_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuCc0MR6mlKnjF6FRTkqFskiY7zCiwN1bgMl3U2eYj5Y_SUnKH3_U92mNQQGL5Q5tKDz1OICs8vrsyiwaRHj6MwomBoWzW8FCsz0CkUsl15h58M8YwyGxAmx5wIgytOH0P2wGbbF3yMhet3AQExHzvkx-eB6UIChBFj_FkrW9Ojyvz81I_fT4uIiwFdrnd6-ZzbRenZtHiat04LPLxNmmP9WY9rzNIxhLotMokq6AWro6k6LttcMCcXq";

export default function ComplaintsView({
  complaints, selectedComplaint, onSelectComplaint,
  onAddComplaint, onUpdateComplaintStatus
}: ComplaintsViewProps) {
  const [filter, setFilter] = useState<'all' | 'open' | 'in-progress' | 'resolved'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [title, setTitle] = useState('');
  const [room, setRoom] = useState('');
  const [category, setCategory] = useState('Plumbing');
  const [priority, setPriority] = useState<ComplaintPriority>('medium');
  const [description, setDescription] = useState('');
  const [reportedBy, setReportedBy] = useState('');

  const filteredComplaints = complaints.filter(c => {
    const matchesFilter = filter === 'all' || c.status === filter;
    const matchesSearch = searchQuery === '' ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const activeCount = complaints.filter(c => c.status !== 'resolved').length;
  const criticalCount = complaints.filter(c => c.priority === 'critical' && c.status !== 'resolved').length;
  const todayCount = complaints.length;

  const getCategoryIcon = (cat: string, size = 16, colorOverride?: string) => {
    const c = colorOverride || colors.outline;
    switch (cat.toLowerCase()) {
      case 'plumbing': return <Wrench size={size} color={c} />;
      case 'electrical': return <Zap size={size} color={c} />;
      case 'furniture': return <Cabinet size={size} color={c} />;
      case 'network': return <Wifi size={size} color={c} />;
      default: return <Clipboard size={size} color={c} />;
    }
  };

  const handleCreateComplaint = () => {
    if (!title.trim() || !room.trim() || !description.trim() || !reportedBy.trim()) {
      Alert.alert("Error", "Please complete all the input fields.");
      return;
    }
    const newComplaint: Complaint = {
      id: `C-${Math.floor(1000 + Math.random() * 9000)}`,
      title: title.trim(),
      priority,
      status: 'open',
      room: room.trim().startsWith('Room') ? room.trim() : `Room ${room.trim()}`,
      category,
      timeAgo: 'Just now',
      reportedBy: reportedBy.trim(),
      studentId: `HF-2024-0${Math.floor(10 + Math.random() * 90)}`,
      studentPhone: '+91 99001 12233',
      description: description.trim(),
      imageUrl: category.toLowerCase() === 'plumbing'
        ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFlv3sLw-MWOdGz43Z-kZFJDGtCSqDbK9lR3rAzlOKTg9UZbFlwd-fU32IHl-IiWj_jniPH8KXvfxDBGMStcc45t2igIKV5gAM2d-mN7ENHjL_AdzNGz2wr0Pe4GbZvbmsYVaLx9kbIgU_tadEHPyYMihk98IvfrqEnEvo9WByBSU6beqRTuZVGBVNcm1DIRFShHrMlhtwi5ahhDPZfvYkwNEV2KaaXtzi78EpnNccKQFY5TvUt9ry'
        : 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600'
    };
    onAddComplaint(newComplaint);
    setTitle(''); setRoom(''); setCategory('Plumbing'); setPriority('medium');
    setDescription(''); setReportedBy(''); setShowAddForm(false);
  };

  const categories = ['Plumbing', 'Electrical', 'Furniture', 'Network', 'Other'];
  const priorities: ComplaintPriority[] = ['low', 'medium', 'critical'];

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarContainer}>
            <Image style={styles.avatar} source={{ uri: WARDEN_AVATAR }} />
          </View>
          <Text style={styles.headerTitle}>Complaints</Text>
        </View>
        <TouchableOpacity onPress={() => setShowSearch(!showSearch)} style={styles.headerBtn}>
          <Search size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {showSearch && (
          <View style={styles.searchBar}>
            <Search size={20} color={colors.outline} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by title, room, or category..."
              style={styles.searchInput}
              autoFocus
            />
          </View>
        )}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {(['all', 'open', 'in-progress', 'resolved'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setFilter(tab)}
              style={[styles.filterChip, filter === tab && styles.filterChipActive]}
            >
              <Text style={[styles.filterChipText, filter === tab && styles.filterChipTextActive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Active</Text>
            <Text style={[styles.statNumber, { color: colors.primary }]}>{activeCount}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Critical</Text>
            <Text style={[styles.statNumber, { color: colors.error }]}>{criticalCount}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Logged Today</Text>
            <Text style={[styles.statNumber, { color: colors.tertiary }]}>{todayCount}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Avg Resolve</Text>
            <Text style={[styles.statNumber, { color: colors.onSurface }]}>4.2h</Text>
          </View>
        </View>

        <View style={styles.complaintList}>
          {filteredComplaints.length > 0 ? (
            filteredComplaints.map((complaint) => {
              const isCritical = complaint.priority === 'critical';
              const isMedium = complaint.priority === 'medium';
              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  key={complaint.id}
                  onPress={() => onSelectComplaint(complaint)}
                  style={styles.complaintCard}
                >
                  <View style={styles.complaintCardTop}>
                    <View style={styles.complaintInfo}>
                      <View style={styles.priorityRow}>
                        <Text style={[
                          styles.priorityText,
                          isCritical ? { color: colors.error } : isMedium ? { color: colors.tertiary } : { color: colors.secondary }
                        ]}>
                          {complaint.priority} priority
                        </Text>
                      </View>
                      <Text style={styles.complaintTitle} numberOfLines={1}>{complaint.title}</Text>
                    </View>
                    <View style={[
                      styles.statusBadge,
                      complaint.status === 'open' ? { backgroundColor: colors.errorContainer } :
                      complaint.status === 'in-progress' ? { backgroundColor: colors.secondaryContainer } :
                      { backgroundColor: colors.successContainer }
                    ]}>
                      <Text style={[
                        styles.statusBadgeText,
                        complaint.status === 'open' ? { color: colors.onErrorContainer } :
                        complaint.status === 'in-progress' ? { color: colors.onSecondaryContainer } :
                        { color: colors.success }
                      ]}>
                        {complaint.status}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.complaintMeta}>
                    <View style={styles.complaintMetaItem}>
                      <MapPin size={12} color={colors.outline} />
                      <Text style={styles.complaintMetaText}>{complaint.room}</Text>
                    </View>
                    <View style={styles.complaintMetaItem}>
                      {getCategoryIcon(complaint.category, 12)}
                      <Text style={styles.complaintMetaText}>{complaint.category}</Text>
                    </View>
                    <Text style={styles.complaintTime}>{complaint.timeAgo}</Text>
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Check size={32} color="#22c55e" />
              </View>
              <Text style={styles.emptyText}>All clear! No active complaints found</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setShowAddForm(true)}
        style={styles.fab}
      >
        <Plus size={28} color="white" />
      </TouchableOpacity>

      <Modal visible={showAddForm} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.addForm}>
            <View style={styles.addFormHeader}>
              <View style={styles.addFormHeaderLeft}>
                <Hammer size={20} color={colors.primary} />
                <Text style={styles.addFormTitle}>Log New Complaint</Text>
              </View>
              <TouchableOpacity onPress={() => setShowAddForm(false)}>
                <X size={24} color={colors.outline} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formScroll}>
              <Text style={styles.formLabel}>Title</Text>
              <TextInput value={title} onChangeText={setTitle} placeholder="e.g. Wash basin tap leak" style={styles.formInput} />

              <View style={styles.formRow}>
                <View style={styles.formHalf}>
                  <Text style={styles.formLabel}>Room</Text>
                  <TextInput value={room} onChangeText={setRoom} placeholder="e.g. 402B" style={styles.formInput} />
                </View>
                <View style={styles.formHalf}>
                  <Text style={styles.formLabel}>Reported By</Text>
                  <TextInput value={reportedBy} onChangeText={setReportedBy} placeholder="e.g. Rohan Verma" style={styles.formInput} />
                </View>
              </View>

              <Text style={styles.formLabel}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow}>
                {categories.map(c => (
                  <TouchableOpacity key={c} onPress={() => setCategory(c)}
                    style={[styles.categoryChip, category === c && styles.categoryChipActive]}>
                    <Text style={[styles.categoryChipText, category === c && styles.categoryChipTextActive]}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.formLabel}>Priority</Text>
              <View style={styles.priorityRow}>
                {priorities.map(p => (
                  <TouchableOpacity key={p} onPress={() => setPriority(p)}
                    style={[styles.priorityChip, priority === p && styles.priorityChipActive]}>
                    <Text style={[styles.priorityChipText, priority === p && styles.priorityChipTextActive]}>{p}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.formLabel}>Description</Text>
              <TextInput value={description} onChangeText={setDescription}
                placeholder="Describe the complaint in detail..." multiline numberOfLines={4}
                textAlignVertical="top" style={styles.formTextarea} />
            </ScrollView>

            <TouchableOpacity activeOpacity={0.8} onPress={handleCreateComplaint} style={styles.submitBtn}>
              <Text style={styles.submitBtnText}>Submit Complaint</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={!!selectedComplaint} animationType="fade" transparent>
        {selectedComplaint && (
          <View style={styles.modalOverlay}>
            <View style={styles.detailModal}>
              <View style={styles.detailHeader}>
                <View>
                  <Text style={styles.detailId}>Complaint #{selectedComplaint.id}</Text>
                  <Text style={styles.detailTitle}>{selectedComplaint.title}</Text>
                </View>
                <TouchableOpacity onPress={() => onSelectComplaint(null)}>
                  <X size={24} color={colors.outline} />
                </TouchableOpacity>
              </View>

              <ScrollView>
                <View style={styles.reportedByCard}>
                  <View>
                    <Text style={styles.reportedByLabel}>Reported By</Text>
                    <Text style={styles.reportedByName}>{selectedComplaint.reportedBy} ({selectedComplaint.room})</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => Alert.alert("Call", `Dialing ${selectedComplaint.studentPhone}`)}
                    style={styles.callBtn}
                  >
                    <Phone size={18} color="white" />
                  </TouchableOpacity>
                </View>

                <View style={styles.detailStats}>
                  <View style={styles.detailStat}>
                    <Text style={styles.detailStatLabel}>Status</Text>
                    <View style={styles.detailStatusRow}>
                      <View style={[
                        styles.detailStatusDot,
                        selectedComplaint.status === 'open' ? { backgroundColor: colors.error } :
                        selectedComplaint.status === 'in-progress' ? { backgroundColor: colors.tertiary } :
                        { backgroundColor: colors.success }
                      ]} />
                      <Text style={styles.detailStatusText}>{selectedComplaint.status}</Text>
                    </View>
                  </View>
                  <View style={styles.detailStat}>
                    <Text style={styles.detailStatLabel}>Category</Text>
                    <View style={styles.detailCategoryRow}>
                      {getCategoryIcon(selectedComplaint.category, 14)}
                      <Text style={styles.detailCategoryText}>{selectedComplaint.category}</Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.detailStatLabel}>Description</Text>
                <Text style={styles.detailDesc}>{selectedComplaint.description}</Text>

                {selectedComplaint.imageUrl && (
                  <View style={styles.imageSection}>
                    <Text style={styles.detailStatLabel}>Photo Evidence</Text>
                    <View style={styles.imageWrap}>
                      <Image source={{ uri: selectedComplaint.imageUrl }} style={styles.image} />
                    </View>
                  </View>
                )}
              </ScrollView>

              <View style={styles.detailActions}>
                {selectedComplaint.status !== 'in-progress' && selectedComplaint.status !== 'resolved' && (
                  <TouchableOpacity
                    onPress={() => onUpdateComplaintStatus(selectedComplaint.id, 'in-progress')}
                    style={[styles.actionBtn, { backgroundColor: colors.primary }]}>
                    <Text style={styles.actionBtnText}>Assign Staff</Text>
                  </TouchableOpacity>
                )}
                {selectedComplaint.status !== 'resolved' && (
                  <TouchableOpacity
                    onPress={() => onUpdateComplaintStatus(selectedComplaint.id, 'resolved')}
                    style={[styles.actionBtn, { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary }]}>
                    <Text style={[styles.actionBtnText, { color: colors.primary }]}>Mark Resolved</Text>
                  </TouchableOpacity>
                )}
                {selectedComplaint.status === 'resolved' && (
                  <TouchableOpacity
                    onPress={() => onUpdateComplaintStatus(selectedComplaint.id, 'open')}
                    style={[styles.actionBtn, { backgroundColor: colors.error }]}>
                    <Text style={styles.actionBtnText}>Reopen</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        )}
      </Modal>
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
  headerBtn: {
    width: 40, height: 40, alignItems: 'center', justifyContent: 'center',
    borderRadius: 20, backgroundColor: colors.surfaceContainerLow,
  },
  scroll: { flex: 1, paddingHorizontal: 16 },
  scrollContent: { paddingBottom: 120, paddingTop: 16 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 12,
    paddingHorizontal: 16, height: 48, marginBottom: 16,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, fontWeight: '500', color: colors.onSurface },
  filterRow: { marginBottom: 24 },
  filterChip: {
    marginRight: 8, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 9999,
    borderWidth: 1, borderColor: colors.outlineVariant, backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center', justifyContent: 'center',
  },
  filterChipActive: { backgroundColor: colors.primaryContainer, borderColor: colors.primaryContainer },
  filterChipText: { fontSize: 12, fontWeight: '700', color: colors.onSurfaceVariant },
  filterChipTextActive: { color: 'white' },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  statCard: {
    width: '48%', padding: 16, backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 16,
  },
  statLabel: {
    fontSize: 10, fontWeight: '700', color: colors.onSurfaceVariant,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  statNumber: { fontSize: 24, fontWeight: '800', marginTop: 4 },
  complaintList: { gap: 12 },
  complaintCard: {
    backgroundColor: colors.surfaceContainerLowest, borderWidth: 1,
    borderColor: colors.outlineVariant, borderRadius: 16, padding: 16,
  },
  complaintCardTop: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12,
  },
  complaintInfo: { flex: 1, marginRight: 8 },
  priorityRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  priorityText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  complaintTitle: { fontWeight: '700', color: colors.onSurface, fontSize: 16, letterSpacing: -0.3 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 9999 },
  statusBadgeText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  complaintMeta: {
    flexDirection: 'row', alignItems: 'center', paddingTop: 12,
    borderTopWidth: 1, borderTopColor: colors.outlineVariant,
  },
  complaintMetaItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  complaintMetaText: { fontSize: 12, color: colors.onSurfaceVariant, marginLeft: 4 },
  complaintTime: { flex: 1, textAlign: 'right', fontSize: 10, color: colors.outline },
  emptyState: { alignItems: 'center', paddingVertical: 48, backgroundColor: colors.surfaceContainerLowest, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 16 },
  emptyIcon: { backgroundColor: '#f0fdf4', padding: 12, borderRadius: 9999, marginBottom: 12 },
  emptyText: { fontSize: 14, fontWeight: '700', color: colors.onSurfaceVariant },
  fab: {
    position: 'absolute', right: 24, bottom: 24, width: 56, height: 56,
    backgroundColor: colors.primary, borderRadius: 28, alignItems: 'center',
    justifyContent: 'center', zIndex: 40,
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  addForm: {
    backgroundColor: colors.surfaceContainerLowest, borderTopLeftRadius: 24,
    borderTopRightRadius: 24, paddingTop: 24, paddingHorizontal: 24,
    paddingBottom: 48, maxHeight: '85%',
  },
  addFormHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderBottomWidth: 1, borderBottomColor: colors.outlineVariant, paddingBottom: 16, marginBottom: 16,
  },
  addFormHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  addFormTitle: { fontSize: 18, fontWeight: '700', color: colors.onSurface },
  formScroll: { marginBottom: 16 },
  formLabel: {
    fontSize: 12, fontWeight: '700', color: colors.onSurfaceVariant,
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8,
  },
  formInput: {
    width: '100%', height: 48, paddingHorizontal: 16, borderWidth: 1,
    borderColor: colors.outlineVariant, borderRadius: 12, fontSize: 14,
    fontWeight: '500', color: colors.onSurface, marginBottom: 16,
  },
  formRow: { flexDirection: 'row', gap: 16, marginBottom: 0 },
  formHalf: { flex: 1 },
  formTextarea: {
    width: '100%', height: 96, paddingHorizontal: 16, paddingVertical: 12,
    borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 12,
    fontSize: 14, fontWeight: '500', color: colors.onSurface, marginBottom: 16,
  },
  categoryRow: { marginBottom: 16 },
  categoryChip: {
    marginRight: 8, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12,
    borderWidth: 1, borderColor: colors.outlineVariant, backgroundColor: colors.surfaceContainer,
  },
  categoryChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  categoryChipText: { fontSize: 12, fontWeight: '700', color: colors.onSurface },
  categoryChipTextActive: { color: 'white' },
  priorityRowTwo: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  priorityChip: {
    flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 10,
    borderRadius: 12, borderWidth: 1, borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainer,
  },
  priorityChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  priorityChipText: { fontSize: 10, textTransform: 'uppercase', fontWeight: '700', color: colors.onSurface },
  priorityChipTextActive: { color: 'white' },
  submitBtn: {
    backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center',
  },
  submitBtnText: { color: 'white', fontWeight: '700', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  detailModal: {
    backgroundColor: colors.surfaceContainerLowest, borderRadius: 16,
    marginHorizontal: 16, padding: 24, maxHeight: '80%',
  },
  detailHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16,
  },
  detailId: { fontSize: 10, fontWeight: '700', color: colors.outline, textTransform: 'uppercase', letterSpacing: 0.5 },
  detailTitle: { fontSize: 20, fontWeight: '800', color: colors.onSurface, marginTop: 4 },
  reportedByCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16, backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 16, marginBottom: 16,
  },
  reportedByLabel: { fontSize: 10, fontWeight: '700', color: colors.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: 0.5 },
  reportedByName: { fontWeight: '700', fontSize: 14, color: colors.onSurface, marginTop: 4 },
  callBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  detailStats: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  detailStat: { flex: 1, padding: 12, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 16 },
  detailStatLabel: {
    fontSize: 10, fontWeight: '700', color: colors.onSurfaceVariant,
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8,
  },
  detailStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailStatusDot: { width: 10, height: 10, borderRadius: 5 },
  detailStatusText: { fontWeight: '700', fontSize: 12, color: colors.onSurface, textTransform: 'uppercase', letterSpacing: 0.5 },
  detailCategoryRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detailCategoryText: { fontWeight: '700', fontSize: 12, color: colors.onSurface, marginLeft: 4 },
  detailDesc: {
    fontSize: 12, color: colors.onSurface, fontWeight: '500',
    backgroundColor: colors.surfaceContainerLow, padding: 16,
    borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 12, lineHeight: 20, marginBottom: 16,
  },
  imageSection: { marginBottom: 16 },
  imageWrap: { height: 176, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: colors.outlineVariant },
  image: { width: '100%', height: '100%' },
  detailActions: {
    flexDirection: 'row', gap: 12, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.outlineVariant,
  },
  actionBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center',
  },
  actionBtnText: { color: 'white', fontWeight: '700', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
});
