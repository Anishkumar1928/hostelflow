import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ScreenWrapper, StubHeader, Card, PrimaryButton } from "../components/UI";
import { useTheme } from "../theme/ThemeContext";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const daysInMonth = (m: number, y: number) => new Date(y, m + 1, 0).getDate();
const firstDayOfMonth = (m: number, y: number) => new Date(y, m, 1).getDay();

function generateAttendanceData(year: number, month: number) {
  const total = daysInMonth(month, year);
  const data: Record<number, "present" | "absent" | "leave"> = {};
  for (let d = 1; d <= total; d++) {
    const r = Math.random();
    if (r < 0.7) data[d] = "present";
    else if (r < 0.85) data[d] = "absent";
    else data[d] = "leave";
  }
  return data;
}

export default function Attendance() {
  const { colors } = useTheme();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [attendanceData] = useState(() => generateAttendanceData(year, month));
  const [scanned, setScanned] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const total = daysInMonth(month, year);
  const present = Object.values(attendanceData).filter((v) => v === "present").length;
  const absent = Object.values(attendanceData).filter((v) => v === "absent").length;
  const leaves = Object.values(attendanceData).filter((v) => v === "leave").length;
  const percent = total > 0 ? Math.round((present / total) * 100) : 0;

  const prevMonth = () => { if (month === 0) { setYear(year - 1); setMonth(11); } else setMonth(month - 1); };
  const nextMonth = () => { if (month === 11) { setYear(year + 1); setMonth(0); } else setMonth(month + 1); };

  const handleScan = () => {
    setShowScanner(true);
    setTimeout(() => {
      setShowScanner(false);
      setScanned(true);
    }, 2000);
  };

  const calDays = daysInMonth(month, year);
  const startDay = firstDayOfMonth(month, year);
  const calendar: (number | null)[] = Array(startDay).fill(null);
  for (let d = 1; d <= calDays; d++) calendar.push(d);

  if (scanned) {
    return (
      <ScreenWrapper>
        <StubHeader title="Attendance" />
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 32 }}>
          <MaterialIcons name="check-circle" size={64} color={colors.success} />
          <Text style={{ color: colors.onSurface, fontSize: 22, fontWeight: "700", marginTop: 16 }}>Attendance Marked!</Text>
          <Text style={{ color: colors.onSurfaceVariant, fontSize: 15, textAlign: "center", marginTop: 8 }}>Your attendance has been recorded successfully for today.</Text>
          <View style={{ marginTop: 24, width: "100%" }}><PrimaryButton label="Done" onPress={() => setScanned(false)} /></View>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <StubHeader title="Attendance" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Card style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <Pressable onPress={prevMonth}><MaterialIcons name="chevron-left" size={24} color={colors.primary} /></Pressable>
            <Text style={{ color: colors.onSurface, fontSize: 16, fontWeight: "600" }}>{months[month]} {year}</Text>
            <Pressable onPress={nextMonth}><MaterialIcons name="chevron-right" size={24} color={colors.primary} /></Pressable>
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
                  <View style={{ width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: attendanceData[d] === "present" ? colors.successContainer : attendanceData[d] === "absent" ? colors.errorContainer : attendanceData[d] === "leave" ? colors.secondaryContainer : "transparent" }}>
                    <Text style={{ fontSize: 12, fontWeight: "500", color: attendanceData[d] === "present" ? colors.success : attendanceData[d] === "absent" ? colors.error : attendanceData[d] === "leave" ? colors.onSecondaryContainer : colors.onSurface }}>{d}</Text>
                  </View>
                ) : <View />}
              </View>
            ))}
          </View>
        </Card>

        <Card style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 16 }}>
            <View style={{ alignItems: "center" }}>
              <Text style={{ color: colors.primary, fontSize: 28, fontWeight: "700" }}>{percent}%</Text>
              <Text style={{ color: colors.onSurfaceVariant, fontSize: 12 }}>Attendance</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={{ color: colors.success, fontSize: 28, fontWeight: "700" }}>{present}</Text>
              <Text style={{ color: colors.onSurfaceVariant, fontSize: 12 }}>Present</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={{ color: colors.error, fontSize: 28, fontWeight: "700" }}>{absent}</Text>
              <Text style={{ color: colors.onSurfaceVariant, fontSize: 12 }}>Absent</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={{ color: colors.tertiary, fontSize: 28, fontWeight: "700" }}>{leaves}</Text>
              <Text style={{ color: colors.onSurfaceVariant, fontSize: 12 }}>Leaves</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "center", gap: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}><View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.success }} /><Text style={{ color: colors.onSurfaceVariant, fontSize: 12 }}>Present</Text></View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}><View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.error }} /><Text style={{ color: colors.onSurfaceVariant, fontSize: 12 }}>Absent</Text></View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}><View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.tertiary }} /><Text style={{ color: colors.onSurfaceVariant, fontSize: 12 }}>Leave</Text></View>
          </View>
        </Card>

        {showScanner ? (
          <Card style={{ marginBottom: 24, alignItems: "center", padding: 32 }}>
            <MaterialIcons name="qr-code-scanner" size={64} color={colors.primary} />
            <Text style={{ color: colors.onSurface, fontSize: 16, fontWeight: "600", marginTop: 16 }}>Scanning QR Code...</Text>
            <Text style={{ color: colors.onSurfaceVariant, fontSize: 14, marginTop: 4 }}>Point your camera at the class QR code.</Text>
          </Card>
        ) : (
          <PrimaryButton icon="qr-code" label="Scan QR Attendance" onPress={handleScan} />
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}
