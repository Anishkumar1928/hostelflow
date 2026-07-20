import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, Switch, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { StubHeader, Card } from "../components/UI";
import { useTheme } from "../theme/ThemeContext";
import { authStore } from "../services/authStore";

const APP_VERSION = "1.0.0";
const BUILD_NUMBER = "1";

const en = {
  settings: "Settings",
  security: "Security",
  changePassword: "Change Password",
  changePIN: "Change PIN",
  twoFA: "Two-Factor Authentication",
  language: "Language",
  english: "English",
  hindi: "Hindi",
  notifications: "Notifications",
  pushNotifications: "Push Notifications",
  emailNotifications: "Email Notifications",
  helpSupport: "Help & Support",
  faqs: "FAQs",
  contactSupport: "Contact Support",
  reportProblem: "Report a Problem",
  about: "About",
  appVersion: "App Version",
  privacyPolicy: "Privacy Policy",
  termsConditions: "Terms & Conditions",
  logout: "Log Out",
  version: "Version",
  buildNumber: "Build Number",
  appName: "HostelFlow",
  twoFAEnabled: "Two-Factor Authentication Enabled",
  twoFADisabled: "Two-Factor Authentication Disabled",
  logoutTitle: "Log Out",
  logoutMessage: "Are you sure you want to log out?",
  logoutCancel: "Cancel",
  logoutConfirm: "Log Out",
  appInfoTitle: "App Info",
  ok: "OK",
};

const hi: typeof en = {
  settings: "सेटिंग्स",
  security: "सुरक्षा",
  changePassword: "पासवर्ड बदलें",
  changePIN: "PIN बदलें",
  twoFA: "दो-चरणीय प्रमाणीकरण",
  language: "भाषा",
  english: "अंग्रेज़ी",
  hindi: "हिंदी",
  notifications: "सूचनाएं",
  pushNotifications: "पुश सूचनाएं",
  emailNotifications: "ईमेल सूचनाएं",
  helpSupport: "सहायता",
  faqs: "सामान्य प्रश्न",
  contactSupport: "संपर्क करें",
  reportProblem: "समस्या रिपोर्ट करें",
  about: "के बारे में",
  appVersion: "ऐप संस्करण",
  privacyPolicy: "गोपनीयता नीति",
  termsConditions: "नियम व शर्तें",
  logout: "लॉग आउट",
  version: "संस्करण",
  buildNumber: "बिल्ड नंबर",
  appName: "हॉस्टलफ्लो",
  twoFAEnabled: "दो-चरणीय प्रमाणीकरण सक्षम किया गया",
  twoFADisabled: "दो-चरणीय प्रमाणीकरण अक्षम किया गया",
  logoutTitle: "लॉग आउट",
  logoutMessage: "क्या आप लॉग आउट करना चाहते हैं?",
  logoutCancel: "रद्द करें",
  logoutConfirm: "लॉग आउट",
  appInfoTitle: "ऐप जानकारी",
  ok: "ठीक है",
};

const LANGUAGES = [
  { code: "en", labelEN: "English", labelHI: "अंग्रेज़ी" },
  { code: "hi", labelEN: "Hindi", labelHI: "हिंदी" },
];

export default function SettingsScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [twoFA, setTwoFA] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en");

  const t = selectedLang === "hi" ? hi : en;

  const handleToggle2FA = (val: boolean) => {
    setTwoFA(val);
    Alert.alert("", val ? t.twoFAEnabled : t.twoFADisabled);
  };

  const handleLogout = () => {
    Alert.alert(t.logoutTitle, t.logoutMessage, [
      { text: t.logoutCancel, style: "cancel" },
      { text: t.logoutConfirm, style: "destructive", onPress: () => { authStore.clear(); navigation.replace("Login"); } },
    ]);
  };

  const handleAppVersion = () => {
    Alert.alert(t.appName, `${t.version}: ${APP_VERSION}\n${t.buildNumber}: ${BUILD_NUMBER}`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <StubHeader title={t.settings} />
      <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Security */}
        <SectionTitle label={t.security} colors={colors} />
        <Card style={{ marginBottom: 24, padding: 0, overflow: "hidden" }}>
          <SettingRow icon="lock" label={t.changePassword} onPress={() => navigation.navigate("ChangePassword")} colors={colors} />
          <SettingRow icon="dialpad" label={t.changePIN} onPress={() => navigation.navigate("ChangePIN")} colors={colors} />
          <ToggleRow icon="verified-user" label={t.twoFA} value={twoFA} onValueChange={handleToggle2FA} colors={colors} last />
        </Card>

        {/* Language */}
        <SectionTitle label={t.language} colors={colors} />
        <Card style={{ marginBottom: 24, padding: 0, overflow: "hidden" }}>
          {LANGUAGES.map((lang, i) => (
            <Pressable
              key={lang.code}
              onPress={() => setSelectedLang(lang.code)}
              style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, borderBottomWidth: i < LANGUAGES.length - 1 ? 1 : 0, borderBottomColor: colors.outlineVariant, backgroundColor: pressed ? colors.surfaceContainerLow : "transparent" })}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
                <MaterialIcons name="language" size={22} color={colors.onSurfaceVariant} />
                <Text style={{ color: colors.onSurface, fontWeight: "500", fontSize: 16, marginLeft: 16 }}>{selectedLang === "en" ? lang.labelEN : lang.labelHI}</Text>
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
        <SectionTitle label={t.notifications} colors={colors} />
        <Card style={{ marginBottom: 24, padding: 0, overflow: "hidden" }}>
          <ToggleRow icon="notifications" label={t.pushNotifications} value={pushEnabled} onValueChange={setPushEnabled} colors={colors} />
          <ToggleRow icon="email" label={t.emailNotifications} value={emailEnabled} onValueChange={setEmailEnabled} colors={colors} last />
        </Card>

        {/* Help & Support */}
        <SectionTitle label={t.helpSupport} colors={colors} />
        <Card style={{ marginBottom: 24, padding: 0, overflow: "hidden" }}>
          <SettingRow icon="question-answer" label={t.faqs} onPress={() => navigation.navigate("FAQ")} colors={colors} />
          <SettingRow icon="support" label={t.contactSupport} onPress={() => navigation.navigate("ContactSupport")} colors={colors} />
          <SettingRow icon="bug-report" label={t.reportProblem} onPress={() => navigation.navigate("ReportProblem")} colors={colors} last />
        </Card>

        {/* About */}
        <SectionTitle label={t.about} colors={colors} />
        <Card style={{ marginBottom: 24, padding: 0, overflow: "hidden" }}>
          <Pressable onPress={handleAppVersion} style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, borderBottomWidth: 1, borderBottomColor: colors.outlineVariant, backgroundColor: pressed ? colors.surfaceContainerLow : "transparent" })}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
              <MaterialIcons name="info" size={22} color={colors.onSurfaceVariant} />
              <Text style={{ color: colors.onSurface, fontWeight: "500", fontSize: 16, marginLeft: 16 }}>{t.appVersion}</Text>
            </View>
            <Text style={{ color: colors.onSurfaceVariant, fontSize: 14 }}>v{APP_VERSION}</Text>
          </Pressable>
          <SettingRow icon="privacy-tip" label={t.privacyPolicy} onPress={() => navigation.navigate("PrivacyPolicy")} colors={colors} />
          <SettingRow icon="article" label={t.termsConditions} onPress={() => navigation.navigate("TermsConditions")} colors={colors} last />
        </Card>

        {/* Logout */}
        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: pressed ? colors.errorContainer : colors.surfaceContainerLowest, borderWidth: 1, borderColor: colors.error, borderRadius: 12, paddingVertical: 14, opacity: pressed ? 0.8 : 1 })}
        >
          <MaterialIcons name="logout" size={20} color={colors.error} />
          <Text style={{ color: colors.error, fontWeight: "600", fontSize: 16 }}>{t.logout}</Text>
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
