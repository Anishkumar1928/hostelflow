import React from "react";
import { View, Text, ScrollView } from "react-native";
import { ScreenWrapper, StubHeader } from "../components/UI";
import { useTheme } from "../theme/ThemeContext";

export default function TermsConditions() {
  const { colors } = useTheme();

  return (
    <ScreenWrapper>
      <StubHeader title="Terms & Conditions" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Text style={{ color: colors.onSurface, fontSize: 20, fontWeight: "700", marginBottom: 8 }}>Terms & Conditions</Text>
        <Text style={{ color: colors.onSurfaceVariant, fontSize: 13, marginBottom: 4 }}>Last updated: January 2026</Text>

        <Text style={{ color: colors.onSurface, fontSize: 16, fontWeight: "600", marginTop: 20, marginBottom: 8 }}>Acceptance of Terms</Text>
        <Text style={{ color: colors.onSurfaceVariant, fontSize: 14, lineHeight: 22 }}>
          By using the HostelFlow app, you agree to these Terms & Conditions. If you do not agree, please do not use the app.
        </Text>

        <Text style={{ color: colors.onSurface, fontSize: 16, fontWeight: "600", marginTop: 20, marginBottom: 8 }}>User Responsibilities</Text>
        <Text style={{ color: colors.onSurfaceVariant, fontSize: 14, lineHeight: 22 }}>
          You are responsible for maintaining the confidentiality of your account credentials. You agree to use the app only for lawful purposes and in accordance with hostel rules and regulations.
        </Text>

        <Text style={{ color: colors.onSurface, fontSize: 16, fontWeight: "600", marginTop: 20, marginBottom: 8 }}>Hostel Rules</Text>
        <Text style={{ color: colors.onSurfaceVariant, fontSize: 14, lineHeight: 22 }}>
          All users must abide by the hostel's code of conduct. Violation of rules may result in disciplinary action including suspension of app access and hostel privileges.
        </Text>

        <Text style={{ color: colors.onSurface, fontSize: 16, fontWeight: "600", marginTop: 20, marginBottom: 8 }}>Limitation of Liability</Text>
        <Text style={{ color: colors.onSurfaceVariant, fontSize: 14, lineHeight: 22 }}>
          HostelFlow is provided "as is" without warranties of any kind. We are not liable for any damages arising from the use or inability to use the app.
        </Text>

        <Text style={{ color: colors.onSurface, fontSize: 16, fontWeight: "600", marginTop: 20, marginBottom: 8 }}>Changes to Terms</Text>
        <Text style={{ color: colors.onSurfaceVariant, fontSize: 14, lineHeight: 22 }}>
          We reserve the right to modify these terms at any time. Continued use of the app after changes constitutes acceptance of the new terms.
        </Text>
      </ScrollView>
    </ScreenWrapper>
  );
}
