import React from "react";
import { View, Text, Pressable, Image, TextInput, ViewStyle, PressableStateCallbackType } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../theme/ThemeContext";

export function TopAppBar({ name = "Student" }: { name?: string }) {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", height: 64, paddingHorizontal: 24, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.outlineVariant }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Image source={{ uri: "https://i.pravatar.cc/150?img=12" }} style={{ width: 40, height: 40, borderRadius: 9999, borderWidth: 1, borderColor: colors.primaryContainer }} />
        <Text style={{ color: colors.primary, fontWeight: "700", fontSize: 20, lineHeight: 28, marginLeft: 12 }}>Hi, {name}</Text>
      </View>
      <Pressable onPress={() => navigation.navigate("Notifications")} style={({ pressed }: PressableStateCallbackType) => ({ width: 40, height: 40, alignItems: "center", justifyContent: "center", borderRadius: 9999, backgroundColor: pressed ? colors.surfaceContainerLow : "transparent" })}>
        <MaterialIcons name="notifications" size={24} color={colors.primary} />
      </Pressable>
    </View>
  );
}

export function Card({ style, children, ...props }: { style?: ViewStyle; children?: React.ReactNode }) {
  const { colors } = useTheme();
  return <View style={[{ backgroundColor: colors.surfaceContainerLowest, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 12, padding: 16 }, style]} {...props}>{children}</View>;
}

export function Badge({ label, tone = "neutral" }: { label: string; tone?: "neutral" | "success" | "warning" | "error" }) {
  const { colors } = useTheme();
  const tones: Record<string, { bg: string; text: string }> = {
    neutral: { bg: colors.secondaryContainer, text: colors.onSecondaryContainer },
    success: { bg: colors.successContainer, text: colors.success },
    warning: { bg: colors.secondaryContainer, text: colors.onSecondaryContainer },
    error: { bg: colors.errorContainer, text: colors.onErrorContainer },
  };
  const t = tones[tone];
  return (
    <View style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 9999, alignSelf: "flex-start", backgroundColor: t.bg }}>
      <Text style={{ fontSize: 12, fontWeight: "700", textTransform: "uppercase", color: t.text }}>{label}</Text>
    </View>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  return <Text style={{ color: colors.onSurfaceVariant, fontWeight: "500", fontSize: 12, lineHeight: 16, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>{children}</Text>;
}

export function PrimaryButton({ label, onPress, icon, disabled }: { label: string; onPress?: () => void; icon?: keyof typeof MaterialIcons.glyphMap; disabled?: boolean }) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }: PressableStateCallbackType) => ({ width: "100%", backgroundColor: disabled ? colors.outline : colors.primary, paddingVertical: 16, borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, opacity: pressed ? 0.9 : 1 })}>
      {icon ? <MaterialIcons name={icon} size={22} color="#fff" /> : null}
      <Text style={{ color: "#fff", fontWeight: "600", fontSize: 18, lineHeight: 28 }}>{label}</Text>
    </Pressable>
  );
}

export function StubHeader({ title, onBack }: { title: string; onBack?: () => void }) {
  const navigation = useNavigation();
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", height: 64, paddingHorizontal: 24, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.outlineVariant }}>
      <Pressable onPress={onBack || (() => navigation.goBack())} style={({ pressed }: PressableStateCallbackType) => ({ marginRight: 12, opacity: pressed ? 0.6 : 1 })}>
        <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
      </Pressable>
      <Text style={{ color: colors.primary, fontWeight: "700", fontSize: 20, lineHeight: 28 }}>{title}</Text>
    </View>
  );
}

export function ScreenWrapper({ children, edges = ["top"] as any }: { children: React.ReactNode; edges?: any }) {
  const { colors } = useTheme();
  return <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={edges}>{children}</SafeAreaView>;
}

export function StyledInput({ style, ...props }: any) {
  const { colors } = useTheme();
  return <TextInput placeholderTextColor={colors.outline} style={[{ backgroundColor: colors.surfaceContainerLowest, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, color: colors.onSurface, fontSize: 16 }, style]} {...props} />;
}
