import React from "react";
import { View, Text, ScrollView } from "react-native";
import { ScreenWrapper, StubHeader } from "../components/UI";
import { useTheme } from "../theme/ThemeContext";

export default function PrivacyPolicy() {
  const { colors } = useTheme();

  return (
    <ScreenWrapper>
      <StubHeader title="Privacy Policy" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Text style={{ color: colors.onSurface, fontSize: 20, fontWeight: "700", marginBottom: 8 }}>Privacy Policy</Text>
        <Text style={{ color: colors.onSurfaceVariant, fontSize: 13, marginBottom: 4 }}>Last updated: January 2026</Text>

        <Text style={{ color: colors.onSurface, fontSize: 16, fontWeight: "600", marginTop: 20, marginBottom: 8 }}>Information We Collect</Text>
        <Text style={{ color: colors.onSurfaceVariant, fontSize: 14, lineHeight: 22 }}>
          We collect personal information such as your name, email address, phone number, and hostel-related data when you register and use the HostelFlow app. This includes your room number, attendance records, fee payments, and communication history.
        </Text>

        <Text style={{ color: colors.onSurface, fontSize: 16, fontWeight: "600", marginTop: 20, marginBottom: 8 }}>How We Use Your Information</Text>
        <Text style={{ color: colors.onSurfaceVariant, fontSize: 14, lineHeight: 22 }}>
          Your information is used to manage hostel operations including room allocation, attendance tracking, fee collection, complaint handling, and communication between students and hostel administration.
        </Text>

        <Text style={{ color: colors.onSurface, fontSize: 16, fontWeight: "600", marginTop: 20, marginBottom: 8 }}>Data Sharing</Text>
        <Text style={{ color: colors.onSurfaceVariant, fontSize: 14, lineHeight: 22 }}>
          We do not share your personal data with third parties except as required by law or with your explicit consent. Hostel administration staff may access your data for operational purposes.
        </Text>

        <Text style={{ color: colors.onSurface, fontSize: 16, fontWeight: "600", marginTop: 20, marginBottom: 8 }}>Data Security</Text>
        <Text style={{ color: colors.onSurfaceVariant, fontSize: 14, lineHeight: 22 }}>
          We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.
        </Text>

        <Text style={{ color: colors.onSurface, fontSize: 16, fontWeight: "600", marginTop: 20, marginBottom: 8 }}>Contact</Text>
        <Text style={{ color: colors.onSurfaceVariant, fontSize: 14, lineHeight: 22 }}>
          If you have any questions about this Privacy Policy, please contact us at support@hostelflow.com.
        </Text>
      </ScrollView>
    </ScreenWrapper>
  );
}
