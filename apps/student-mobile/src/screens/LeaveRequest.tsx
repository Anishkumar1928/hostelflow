import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Alert, Modal, Platform, TouchableOpacity, ActivityIndicator } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { StubHeader, PrimaryButton } from "../components/UI";
import { leaveService } from "../services/leave.service";
import { studentService } from "../services/student.service";
import { authStore } from "../services/authStore";
import { colors, spacing, radius } from "../theme/tokens";

const LEAVE_TYPES = ["Medical", "Personal", "Family", "Emergency", "Other"];

function fmt(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function LeaveRequest() {
  const navigation = useNavigation<any>();
  const [leaveType, setLeaveType] = useState("Personal");
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [studentProfile, setStudentProfile] = useState<any>(null);

  useEffect(() => {
    const user = authStore.getUser();
    if (!user?.id) { setProfileLoading(false); return; }
    studentService.getByUserId(user.id).then(res => {
      if (res.success && res.data) setStudentProfile(res.data);
    }).finally(() => setProfileLoading(false));
  }, []);

  const onFromChange = (_: DateTimePickerEvent, d?: Date) => {
    if (Platform.OS === "android") setShowFromPicker(false);
    if (d) { setFromDate(d); if (d > toDate) setToDate(d); }
  };

  const onToChange = (_: DateTimePickerEvent, d?: Date) => {
    if (Platform.OS === "android") setShowToPicker(false);
    if (d) setToDate(d);
  };

  const handleSubmit = async () => {
    if (!reason) {
      Alert.alert("Error", "Please enter a reason");
      return;
    }
    const sid = studentProfile?.id || authStore.getUser()?.id || "";
    setLoading(true);
    const res = await leaveService.applyLeave({
      studentId: sid,
      leaveType,
      fromDate: fmt(fromDate),
      toDate: fmt(toDate),
      reason,
    });
    setLoading(false);
    if (res.success) {
      Alert.alert("Success", "Leave applied successfully");
      navigation.goBack();
    } else {
      Alert.alert("Error", res.error || "Failed to apply leave");
    }
  };

  if (profileLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
        <StubHeader title="Leave Request" />
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <StubHeader title="Leave Request" />
      <ScrollView style={{ flex: 1, paddingHorizontal: spacing.gutter, paddingTop: spacing.lg }} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
        <Text style={{ color: colors.onSurfaceVariant, fontSize: 12, fontWeight: "500", textTransform: "uppercase", marginBottom: spacing.sm }}>Leave Type</Text>
        <Pressable
          onPress={() => setShowTypePicker(true)}
          style={{ backgroundColor: colors.surfaceContainerLowest, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: radius.lg, paddingHorizontal: spacing.md, paddingVertical: 14, marginBottom: spacing.md, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
        >
          <Text style={{ color: colors.onSurface, fontSize: 16 }}>{leaveType}</Text>
          <MaterialIcons name="arrow-drop-down" size={24} color={colors.onSurfaceVariant} />
        </Pressable>

        <Text style={{ color: colors.onSurfaceVariant, fontSize: 12, fontWeight: "500", textTransform: "uppercase", marginBottom: spacing.sm }}>From Date</Text>
        <Pressable
          onPress={() => setShowFromPicker(true)}
          style={{ backgroundColor: colors.surfaceContainerLowest, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: radius.lg, paddingHorizontal: spacing.md, paddingVertical: 14, marginBottom: spacing.md, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
        >
          <Text style={{ color: colors.onSurface, fontSize: 16 }}>{fmt(fromDate)}</Text>
          <MaterialIcons name="calendar-month" size={22} color={colors.primary} />
        </Pressable>
        {showFromPicker && Platform.OS === "ios" ? (
          <View style={{ backgroundColor: colors.surfaceContainerLow, borderRadius: radius.lg, marginBottom: spacing.md, overflow: "hidden" }}>
            <DateTimePicker value={fromDate} mode="date" display="spinner" onChange={onFromChange} minimumDate={new Date()} />
            <TouchableOpacity onPress={() => setShowFromPicker(false)} style={{ paddingVertical: 10, alignItems: "center", borderTopWidth: 1, borderTopColor: colors.outlineVariant }}>
              <Text style={{ color: colors.primary, fontWeight: "600", fontSize: 16 }}>Done</Text>
            </TouchableOpacity>
          </View>
        ) : showFromPicker ? (
          <DateTimePicker value={fromDate} mode="date" display="default" onChange={onFromChange} minimumDate={new Date()} />
        ) : null}

        <Text style={{ color: colors.onSurfaceVariant, fontSize: 12, fontWeight: "500", textTransform: "uppercase", marginBottom: spacing.sm }}>To Date</Text>
        <Pressable
          onPress={() => setShowToPicker(true)}
          style={{ backgroundColor: colors.surfaceContainerLowest, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: radius.lg, paddingHorizontal: spacing.md, paddingVertical: 14, marginBottom: spacing.md, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
        >
          <Text style={{ color: colors.onSurface, fontSize: 16 }}>{fmt(toDate)}</Text>
          <MaterialIcons name="calendar-month" size={22} color={colors.primary} />
        </Pressable>
        {showToPicker && Platform.OS === "ios" ? (
          <View style={{ backgroundColor: colors.surfaceContainerLow, borderRadius: radius.lg, marginBottom: spacing.md, overflow: "hidden" }}>
            <DateTimePicker value={toDate} mode="date" display="spinner" onChange={onToChange} minimumDate={fromDate} />
            <TouchableOpacity onPress={() => setShowToPicker(false)} style={{ paddingVertical: 10, alignItems: "center", borderTopWidth: 1, borderTopColor: colors.outlineVariant }}>
              <Text style={{ color: colors.primary, fontWeight: "600", fontSize: 16 }}>Done</Text>
            </TouchableOpacity>
          </View>
        ) : showToPicker ? (
          <DateTimePicker value={toDate} mode="date" display="default" onChange={onToChange} minimumDate={fromDate} />
        ) : null}

        <Text style={{ color: colors.onSurfaceVariant, fontSize: 12, fontWeight: "500", textTransform: "uppercase", marginBottom: spacing.sm }}>Reason</Text>
        <TextInput
          value={reason}
          onChangeText={setReason}
          placeholder="Describe your reason"
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={4}
          style={{ backgroundColor: colors.surfaceContainerLowest, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: radius.lg, paddingHorizontal: spacing.md, paddingVertical: 14, marginBottom: spacing.lg, color: colors.onSurface, fontSize: 16, minHeight: 100, textAlignVertical: "top" }}
        />

        <PrimaryButton label={loading ? "Submitting..." : "Submit Leave Request"} onPress={handleSubmit} icon="exit-to-app" />
      </ScrollView>

      <Modal visible={showTypePicker} transparent animationType="fade">
        <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", paddingHorizontal: 32 }} onPress={() => setShowTypePicker(false)}>
          <Pressable style={{ backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.lg }}>
            <Text style={{ color: colors.onSurface, fontWeight: "600", fontSize: 18, marginBottom: spacing.md }}>Select Leave Type</Text>
            {LEAVE_TYPES.map((t) => (
              <Pressable
                key={t}
                onPress={() => { setLeaveType(t); setShowTypePicker(false); }}
                style={{ paddingVertical: 14, paddingHorizontal: spacing.md, borderRadius: radius.md, backgroundColor: leaveType === t ? colors.primaryContainer : "transparent", marginBottom: 4 }}
              >
                <Text style={{ color: leaveType === t ? colors.primary : colors.onSurface, fontWeight: leaveType === t ? "600" : "400", fontSize: 16 }}>{t}</Text>
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
