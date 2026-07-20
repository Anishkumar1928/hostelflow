import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { StubHeader, Card } from "../components/UI";
import { useTheme } from "../theme/ThemeContext";

const APP_VERSION = "1.0.0";
const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
];

export default function SettingsScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [twoFA, setTwoFA] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <StubHeader title="Settings" />
      <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Security */}
        <SectionTitle label="Security" colors={colors} />
        <Card style={{ marginBottom: 24, padding: 0, overflow: "hidden" }}>
          <SettingRow icon="lock" label="Change Password" onPress={() => navigation.navigate("Security")} colors={colors} />
          <SettingRow icon="dialpad" label="Change PIN" onPress={() => {}} colors={colors} />
          <ToggleRow icon="verified-user" label="Two-Factor Authentication" value={twoFA} onValueChange={setTwoFA} colors={colors} last />
        </Card>

        {/* Language */}
        <SectionTitle label="Language" colors={colors} />
        <Card style={{ marginBottom: 24, padding: 0, overflow: "hidden" }}>
          {LANGUAGES.map((lang, i) => (
            <Pressable
              key={lang.code}
              onPress={() => setSelectedLang(lang.code)}
              style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, borderBottomWidth: i < LANGUAGES.length - 1 ? 1 : 0, borderBottomColor: colors.outlineVariant, backgroundColor: pressed ? colors.surfaceContainerLow : "transparent" })}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
                <MaterialIcons name="language" size={22} color={colors.onSurfaceVariant} />
                <Text style={{ color: colors.onSurface, fontWeight: "500", fontSize: 16, marginLeft: 16 }}>{lang.label}</Text>
              </View>
              <MaterialIcons
                name={selectedLang === lang.code ? "radio-button-checked" : "radio-button-unchecked"}
                size={22}
                color={selectedLang === lang.code ? colors.primary : colors.outline}
              />
            </Pressable>
          ))}
        </Card>

        {/* Notifications */}
        <SectionTitle label="Notifications" colors={colors} />
        <Card style={{ marginBottom: 24, padding: 0, overflow: "hidden" }}>
          <ToggleRow icon="notifications" label="Push Notifications" value={pushEnabled} onValueChange={setPushEnabled} colors={colors} />
          <ToggleRow icon="email" label="Email Notifications" value={emailEnabled} onValueChange={setEmailEnabled} colors={colors} last />
        </Card>

        {/* Help & Support */}
        <SectionTitle label="Help & Support" colors={colors} />
        <Card style={{ marginBottom: 24, padding: 0, overflow: "hidden" }}>
          <SettingRow icon="question-answer" label="FAQs" onPress={() => {}} colors={colors} />
          <SettingRow icon="support" label="Contact Support" onPress={() => {}} colors={colors} />
          <SettingRow icon="bug-report" label="Report a Problem" onPress={() => {}} colors={colors} last />
        </Card>

        {/* About */}
        <SectionTitle label="About" colors={colors} />
        <Card style={{ marginBottom: 24, padding: 0, overflow: "hidden" }}>
          <InfoRow icon="info" label="App Version" value={`v${APP_VERSION}`} colors={colors} />
          <SettingRow icon="privacy-tip" label="Privacy Policy" onPress={() => {}} colors={colors} />
          <SettingRow icon="article" label="Terms & Conditions" onPress={() => {}} colors={colors} last />
        </Card>

        {/* Logout */}
        <Pressable
          onPress={() => {}}
          style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: pressed ? colors.errorContainer : colors.surfaceContainerLowest, borderWidth: 1, borderColor: colors.error, borderRadius: 12, paddingVertical: 14, opacity: pressed ? 0.8 : 1 })}
        >
          <MaterialIcons name="logout" size={20} color={colors.error} />
          <Text style={{ color: colors.error, fontWeight: "600", fontSize: 16 }}>Log Out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionTitle({ label, colors }: { label: string; colors: any }) {
  return (
    <Text style={{ color: colors.onSurfaceVariant, fontSize: 12, fontWeight: "500", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 }}>
      {label}
    </Text>
  );
}

function SettingRow({ icon, label, onPress, colors, last }: { icon: keyof typeof MaterialIcons.glyphMap; label: string; onPress?: () => void; colors: any; last?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, borderBottomWidth: last ? 0 : 1, borderBottomColor: colors.outlineVariant, backgroundColor: pressed ? colors.surfaceContainerLow : "transparent" })}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
        <MaterialIcons name={icon} size={22} color={colors.onSurfaceVariant} />
        <Text style={{ color: colors.onSurface, fontWeight: "500", fontSize: 16, marginLeft: 16 }}>{label}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={20} color={colors.outline} />
    </Pressable>
  );
}

function ToggleRow({ icon, label, value, onValueChange, colors, last }: { icon: keyof typeof MaterialIcons.glyphMap; label: string; value: boolean; onValueChange: (v: boolean) => void; colors: any; last?: boolean }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, borderBottomWidth: last ? 0 : 1, borderBottomColor: colors.outlineVariant }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
        <MaterialIcons name={icon} size={22} color={colors.onSurfaceVariant} />
        <Text style={{ color: colors.onSurface, fontWeight: "500", fontSize: 16, marginLeft: 16 }}>{label}</Text>
      </View>
      <Switch value={value} onValueChange={onValueChange} trackColor={{ true: colors.primary, false: colors.outlineVariant }} />
    </View>
  );
}

function InfoRow({ icon, label, value, colors, last }: { icon: keyof typeof MaterialIcons.glyphMap; label: string; value: string; colors: any; last?: boolean }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, borderBottomWidth: last ? 0 : 1, borderBottomColor: colors.outlineVariant }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
        <MaterialIcons name={icon} size={22} color={colors.onSurfaceVariant} />
        <Text style={{ color: colors.onSurface, fontWeight: "500", fontSize: 16, marginLeft: 16 }}>{label}</Text>
      </View>
      <Text style={{ color: colors.onSurfaceVariant, fontSize: 14 }}>{value}</Text>
    </View>
  );
}
