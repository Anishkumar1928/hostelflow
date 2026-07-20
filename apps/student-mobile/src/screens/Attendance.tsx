import React, { useState, useRef, useEffect, useCallback } from "react";
import { View, Text, ScrollView, Pressable, Animated, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { StubHeader, Card, PrimaryButton } from "../components/UI";
import { useTheme } from "../theme/ThemeContext";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const daysInMonth = (m: number, y: number) => new Date(y, m + 1, 0).getDate();
const firstDayOfMonth = (m: number, y: number) => new Date(y, m, 1).getDay();

type AttendanceStatus = "present" | "absent" | "leave" | "late";

// TODO: Replace with real API call
// async function fetchAttendance(studentId: string, month: number, year: number): Promise<Record<number, AttendanceStatus>>
function generateAttendanceData(year: number, month: number) {
  const total = daysInMonth(month, year);
  const data: Record<number, AttendanceStatus> = {};
  for (let d = 1; d <= total; d++) {
    const r = Math.random();
    if (r < 0.65) data[d] = "present";
    else if (r < 0.78) data[d] = "absent";
    else if (r < 0.88) data[d] = "leave";
    else data[d] = "late";
  }
  return data;
}

// TODO: Replace with real attendance marking API
// async function markAttendance(studentId: string, qrData: string): Promise<{ success: boolean; message: string }>
function simulateMarkAttendance(qrData: string): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: "Attendance marked for today" });
    }, 1000);
  });
}

export default function Attendance() {
  const { colors } = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [attendanceData, setAttendanceData] = useState(() => generateAttendanceData(year, month));
  const [showScanner, setShowScanner] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string } | null>(null);
  const [marking, setMarking] = useState(false);
  const [torch, setTorch] = useState(false);

  const total = daysInMonth(month, year);
  const present = Object.values(attendanceData).filter((v) => v === "present").length;
  const absent = Object.values(attendanceData).filter((v) => v === "absent").length;
  const leaves = Object.values(attendanceData).filter((v) => v === "leave").length;
  const late = Object.values(attendanceData).filter((v) => v === "late").length;
  const percent = total > 0 ? Math.round((present / total) * 100) : 0;

  const prevMonth = useCallback(() => {
    setMonth((m) => (m === 0 ? (setYear((y) => y - 1), 11) : m - 1));
  }, []);
  const nextMonth = useCallback(() => {
    setMonth((m) => (m === 11 ? (setYear((y) => y + 1), 0) : m + 1));
  }, []);

  // Refresh data when month/year changes
  useEffect(() => {
    setAttendanceData(generateAttendanceData(year, month));
    setScanResult(null);
  }, [year, month]);

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (!scanning || marking) return;
    setScanning(false);
    setMarking(true);
    try {
      // TODO: Replace with real API call
      // const result = await markAttendance(studentId, data);
      const result = await simulateMarkAttendance(data);
      setScanResult(result);
    } catch {
      setScanResult({ success: false, message: "Failed to mark attendance" });
    } finally {
      setMarking(false);
    }
  };

  const closeScanner = () => {
    setShowScanner(false);
    setScanning(true);
    setScanResult(null);
    setTorch(false);
  };

  const calDays = daysInMonth(month, year);
  const startDay = firstDayOfMonth(month, year);
  const calendar: (number | null)[] = Array(startDay).fill(null);
  for (let d = 1; d <= calDays; d++) calendar.push(d);

  const statusColor = (status: AttendanceStatus) => {
    switch (status) {
      case "present": return { bg: colors.successContainer, fg: colors.success };
      case "absent": return { bg: colors.errorContainer, fg: colors.error };
      case "leave": return { bg: "#fef9c3", fg: "#a16207" };
      case "late": return { bg: "#fef3c7", fg: "#d97706" };
      default: return { bg: "transparent", fg: colors.onSurface };
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <StubHeader title="Attendance" />

      {/* QR Scanner Modal */}
      <Modal visible={showScanner} animationType="slide" onRequestClose={closeScanner}>
        <View style={{ flex: 1, backgroundColor: "#000" }}>
          {permission?.granted ? (
            <CameraView
              style={{ flex: 1 }}
              facing="back"
              enableTorch={torch}
              onBarcodeScanned={scanning ? handleBarcodeScanned : undefined}
              barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            >
              <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
                <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12 }}>
                  <Pressable onPress={closeScanner} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(0,0,0,0.4)", alignItems: "center", justifyContent: "center" }}>
                    <MaterialIcons name="arrow-back" size={24} color="#fff" />
                  </Pressable>
                  <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600", marginLeft: 16 }}>Scan QR Code</Text>
                </View>
              </SafeAreaView>

              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <View style={{ width: 240, height: 240, borderRadius: 20, overflow: "hidden", borderWidth: 2, borderColor: "rgba(255,255,255,0.5)", position: "relative" }}>
                  <View style={{ position: "absolute", top: -2, left: -2, width: 24, height: 24, borderTopWidth: 4, borderLeftWidth: 4, borderColor: "#fff", borderTopLeftRadius: 20 }} />
                  <View style={{ position: "absolute", top: -2, right: -2, width: 24, height: 24, borderTopWidth: 4, borderRightWidth: 4, borderColor: "#fff", borderTopRightRadius: 20 }} />
                  <View style={{ position: "absolute", bottom: -2, left: -2, width: 24, height: 24, borderBottomWidth: 4, borderLeftWidth: 4, borderColor: "#fff", borderBottomLeftRadius: 20 }} />
                  <View style={{ position: "absolute", bottom: -2, right: -2, width: 24, height: 24, borderBottomWidth: 4, borderRightWidth: 4, borderColor: "#fff", borderBottomRightRadius: 20 }} />
                  <ScannerLine />
                </View>
                <Text style={{ color: "#fff", fontSize: 15, textAlign: "center", marginTop: 28, paddingHorizontal: 32, opacity: 0.85 }}>
                  Point camera at the hostel or class QR code
                </Text>
              </View>

              <SafeAreaView style={{ paddingHorizontal: 32, paddingBottom: 24 }} edges={["bottom"]}>
                {scanResult ? (
                  <View style={{ backgroundColor: scanResult.success ? colors.successContainer : colors.errorContainer, borderRadius: 12, padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
                      <MaterialIcons name={scanResult.success ? "check-circle" : "error"} size={24} color={scanResult.success ? colors.success : colors.error} />
                      <View>
                        <Text style={{ color: scanResult.success ? colors.success : colors.error, fontWeight: "600" }}>
                          {scanResult.success ? "Attendance Marked!" : "Failed"}
                        </Text>
                        <Text style={{ color: scanResult.success ? colors.success : colors.error, fontSize: 12 }}>{scanResult.message}</Text>
                      </View>
                    </View>
                    <Pressable onPress={() => { closeScanner(); setAttendanceData(generateAttendanceData(year, month)); }} style={{ backgroundColor: scanResult.success ? colors.success : colors.error, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }}>
                      <Text style={{ color: "#fff", fontWeight: "600" }}>Done</Text>
                    </Pressable>
                  </View>
                ) : (
                  <View style={{ flexDirection: "row", justifyContent: "center", gap: 48, marginBottom: 16 }}>
                    <Pressable onPress={() => setTorch((p) => !p)} style={{ alignItems: "center", opacity: 0.85 }}>
                      <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" }}>
                        <MaterialIcons name={torch ? "flash-on" : "flash-off"} size={24} color="#fff" />
                      </View>
                      <Text style={{ color: "#fff", fontSize: 12, marginTop: 6 }}>Flash</Text>
                    </Pressable>
                  </View>
                )}
                <PrimaryButton
                  label={marking ? "Marking Attendance..." : scanResult ? "Scan Another" : "Simulate Scan → Mark Present"}
                  onPress={() => {
                    if (scanResult) {
                      setScanResult(null);
                      setScanning(true);
                    } else {
                      handleBarcodeScanned({ data: "SIMULATED-ATTENDANCE-CODE" });
                    }
                  }}
                />
              </SafeAreaView>
            </CameraView>
          ) : (
            <View style={{ flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center", padding: 32 }}>
              <MaterialIcons name="camera-alt" size={64} color={colors.onSurfaceVariant} />
              <Text style={{ color: colors.onSurface, fontSize: 18, fontWeight: "600", marginTop: 16, textAlign: "center" }}>Camera Permission Required</Text>
              <Text style={{ color: colors.onSurfaceVariant, fontSize: 14, textAlign: "center", marginTop: 8 }}>We need camera access to scan QR codes for attendance.</Text>
              <View style={{ marginTop: 24, width: "100%" }}>
                <PrimaryButton label="Grant Permission" onPress={requestPermission} />
              </View>
              <Pressable onPress={closeScanner} style={{ marginTop: 16 }}><Text style={{ color: colors.primary, fontWeight: "500" }}>Cancel</Text></Pressable>
            </View>
          )}
        </View>
      </Modal>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* Top Stats Section */}
        <Card style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 16 }}>
            <StatItem value={`${percent}%`} label="Attendance" color={colors.primary} />
            <StatItem value={`${present}`} label="Present" color={colors.success} />
            <StatItem value={`${absent}`} label="Absent" color={colors.error} />
            <StatItem value={`${late}`} label="Late" color="#d97706" />
          </View>
          <View style={{ flexDirection: "row", justifyContent: "center", gap: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.outlineVariant }}>
            <LegendDot color={colors.success} label="Present" />
            <LegendDot color={colors.error} label="Absent" />
            <LegendDot color="#a16207" label="Leave" />
            <LegendDot color="#d97706" label="Late" />
          </View>
        </Card>

        {/* Calendar */}
        <Card style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <Pressable onPress={prevMonth} style={{ padding: 4 }}><MaterialIcons name="chevron-left" size={24} color={colors.primary} /></Pressable>
            <Text style={{ color: colors.onSurface, fontSize: 16, fontWeight: "600" }}>{months[month]} {year}</Text>
            <Pressable onPress={nextMonth} style={{ padding: 4 }}><MaterialIcons name="chevron-right" size={24} color={colors.primary} /></Pressable>
          </View>
          <View style={{ flexDirection: "row", marginBottom: 8 }}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <Text key={d} style={{ flex: 1, textAlign: "center", color: colors.onSurfaceVariant, fontSize: 11, fontWeight: "500" }}>{d}</Text>
            ))}
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {calendar.map((d, i) => (
              <View key={i} style={{ width: "14.28%", aspectRatio: 1, alignItems: "center", justifyContent: "center" }}>
                {d ? (
                  <View style={{ width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: statusColor(attendanceData[d] || "present").bg }}>
                    <Text style={{ fontSize: 12, fontWeight: "600", color: statusColor(attendanceData[d] || "present").fg }}>{d}</Text>
                  </View>
                ) : <View />}
              </View>
            ))}
          </View>
        </Card>

        {/* Summary Card */}
        <Card style={{ marginBottom: 20 }}>
          <Text style={{ color: colors.onSurface, fontSize: 16, fontWeight: "600", marginBottom: 12 }}>Attendance Summary</Text>
          <SummaryRow label="Total Working Days" value={`${total}`} colors={colors} />
          <SummaryRow label="Days Present" value={`${present}`} colors={colors} />
          <SummaryRow label="Days Absent" value={`${absent}`} colors={colors} />
          <SummaryRow label="Leaves" value={`${leaves}`} colors={colors} />
          <SummaryRow label="Late Arrivals" value={`${late}`} colors={colors} last />
          <View style={{ marginTop: 12, backgroundColor: colors.primary, borderRadius: 8, padding: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ color: "#fff", fontWeight: "600" }}>Overall Attendance</Text>
            <Text style={{ color: "#fff", fontSize: 20, fontWeight: "700" }}>{percent}%</Text>
          </View>
        </Card>

        {/* Scan Button */}
        <PrimaryButton icon="qr-code" label="Scan QR Attendance" onPress={() => setShowScanner(true)} />
      </ScrollView>
    </SafeAreaView>
  );
}

function StatItem({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <View style={{ alignItems: "center" }}>
      <Text style={{ color, fontSize: 24, fontWeight: "700" }}>{value}</Text>
      <Text style={{ color, fontSize: 11, textTransform: "uppercase", marginTop: 4, opacity: 0.8 }}>{label}</Text>
    </View>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
      <Text style={{ color: "#737686", fontSize: 11 }}>{label}</Text>
    </View>
  );
}

function SummaryRow({ label, value, colors, last }: { label: string; value: string; colors: any; last?: boolean }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: last ? 0 : 1, borderBottomColor: colors.outlineVariant }}>
      <Text style={{ color: colors.onSurfaceVariant, fontSize: 14 }}>{label}</Text>
      <Text style={{ color: colors.onSurface, fontSize: 14, fontWeight: "500" }}>{value}</Text>
    </View>
  );
}

function ScannerLine() {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 220] });

  return (
    <Animated.View style={{ width: "100%", height: 2, backgroundColor: "#4ade80", opacity: 0.8, transform: [{ translateY }], position: "absolute", top: 8, left: 0 }} />
  );
}
