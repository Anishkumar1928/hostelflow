import React from "react";
import { View, Text, ScrollView, Pressable, Linking, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ScreenWrapper, StubHeader, Card, PrimaryButton } from "../components/UI";
import { useTheme } from "../theme/ThemeContext";

export default function ContactSupport() {
  const { colors } = useTheme();

  return (
    <ScreenWrapper>
      <StubHeader title="Contact Support" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Card style={{ marginBottom: 24, alignItems: "center", padding: 24 }}>
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primaryContainer, alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
            <MaterialIcons name="support-agent" size={32} color={colors.primary} />
          </View>
          <Text style={{ color: colors.onSurface, fontSize: 18, fontWeight: "600" }}>HostelFlow Support</Text>
          <Text style={{ color: colors.onSurfaceVariant, fontSize: 14, marginTop: 4, textAlign: "center" }}>We're here to help you 24/7</Text>
        </Card>

        <Card style={{ marginBottom: 24, padding: 0, overflow: "hidden" }}>
          <ContactRow icon="email" label="Email" value="support@hostelflow.com" colors={colors} onPress={() => Linking.openURL("mailto:support@hostelflow.com")} />
          <ContactRow icon="phone" label="Phone" value="+1 (555) 123-4567" colors={colors} onPress={() => Linking.openURL("tel:+15551234567")} last />
        </Card>

        <Card style={{ marginBottom: 24 }}>
          <Text style={{ color: colors.onSurfaceVariant, fontSize: 12, fontWeight: "500", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>Support Hours</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
            <Text style={{ color: colors.onSurface, fontSize: 15 }}>Monday — Friday</Text>
            <Text style={{ color: colors.onSurfaceVariant, fontSize: 15 }}>9:00 AM — 6:00 PM</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
            <Text style={{ color: colors.onSurface, fontSize: 15 }}>Saturday</Text>
            <Text style={{ color: colors.onSurfaceVariant, fontSize: 15 }}>10:00 AM — 4:00 PM</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ color: colors.onSurface, fontSize: 15 }}>Sunday</Text>
            <Text style={{ color: colors.onSurfaceVariant, fontSize: 15 }}>Closed</Text>
          </View>
        </Card>

        <PrimaryButton label="Send Message" icon="send" onPress={() => Alert.alert("Coming Soon", "In-app messaging will be available soon. Please email us at support@hostelflow.com.")} />
      </ScrollView>
    </ScreenWrapper>
  );
}

function ContactRow({ icon, label, value, colors, onPress, last }: { icon: keyof typeof MaterialIcons.glyphMap; label: string; value: string; colors: any; onPress: () => void; last?: boolean }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", padding: 16, borderBottomWidth: last ? 0 : 1, borderBottomColor: colors.outlineVariant, backgroundColor: pressed ? colors.surfaceContainerLow : "transparent" })}>
      <MaterialIcons name={icon} size={22} color={colors.primary} />
      <View style={{ marginLeft: 16, flex: 1 }}>
        <Text style={{ color: colors.onSurfaceVariant, fontSize: 12 }}>{label}</Text>
        <Text style={{ color: colors.onSurface, fontSize: 16, marginTop: 2 }}>{value}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={20} color={colors.outline} />
    </Pressable>
  );
}
