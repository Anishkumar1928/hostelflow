import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ScreenWrapper, StubHeader, Card } from "../components/UI";
import { useTheme } from "../theme/ThemeContext";

const faqs = [
  { q: "How do I reset my password?", a: "Go to Settings > Security and use the Change Password option to update your password." },
  { q: "How do I mark attendance?", a: "Go to the Attendance tab and tap the 'Scan QR Attendance' button to scan your class QR code." },
  { q: "How do I raise a complaint?", a: "Go to the Complaint screen from Quick Actions on the Dashboard and fill out the form." },
  { q: "How do I apply for leave?", a: "Go to Leave Request from Quick Actions and fill out the leave form with dates and reason." },
  { q: "How do I update my profile?", a: "Go to the Profile tab and tap the Edit button to update your personal information." },
  { q: "How do I check my fees?", a: "Go to the Fees tab to view your outstanding balance, invoices, and payment history." },
];

export default function FAQ() {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <ScreenWrapper>
      <StubHeader title="FAQs" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Card style={{ padding: 0, overflow: "hidden" }}>
          {faqs.map((faq, i) => (
            <View key={i} style={{ borderBottomWidth: i < faqs.length - 1 ? 1 : 0, borderBottomColor: colors.outlineVariant }}>
              <Pressable
                onPress={() => setExpanded(expanded === i ? null : i)}
                style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, backgroundColor: pressed ? colors.surfaceContainerLow : "transparent" })}
              >
                <Text style={{ color: colors.onSurface, fontSize: 15, flex: 1 }}>{faq.q}</Text>
                <MaterialIcons name={expanded === i ? "expand-less" : "expand-more"} size={20} color={colors.onSurfaceVariant} />
              </Pressable>
              {expanded === i ? <Text style={{ color: colors.onSurfaceVariant, fontSize: 14, paddingHorizontal: 16, paddingBottom: 16 }}>{faq.a}</Text> : null}
            </View>
          ))}
        </Card>
      </ScrollView>
    </ScreenWrapper>
  );
}
