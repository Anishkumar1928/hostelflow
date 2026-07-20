import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, Alert } from "react-native";
import { ScreenWrapper, StubHeader, PrimaryButton } from "../components/UI";
import { useTheme } from "../theme/ThemeContext";

export default function ChangePIN() {
  const { colors } = useTheme();
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const handleSave = () => {
    if (!currentPin) { Alert.alert("Validation", "Please enter your current PIN."); return; }
    if (!newPin) { Alert.alert("Validation", "Please enter a new PIN."); return; }
    if (newPin.length < 4) { Alert.alert("Validation", "PIN must be at least 4 digits."); return; }
    if (newPin !== confirmPin) { Alert.alert("Validation", "PINs do not match."); return; }
    Alert.alert("Success", "PIN changed successfully.");
    setCurrentPin(""); setNewPin(""); setConfirmPin("");
  };

  return (
    <ScreenWrapper>
      <StubHeader title="Change PIN" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Text style={{ color: colors.onSurfaceVariant, fontSize: 12, fontWeight: "500", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 }}>Current PIN</Text>
        <TextInput value={currentPin} onChangeText={setCurrentPin} placeholder="Enter current PIN" placeholderTextColor={colors.outline} keyboardType="number-pad" secureTextEntry maxLength={6} style={{ backgroundColor: colors.surfaceContainerLowest, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 20, color: colors.onSurface, fontSize: 16 }} />
        <Text style={{ color: colors.onSurfaceVariant, fontSize: 12, fontWeight: "500", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 }}>New PIN</Text>
        <TextInput value={newPin} onChangeText={setNewPin} placeholder="Enter new PIN" placeholderTextColor={colors.outline} keyboardType="number-pad" secureTextEntry maxLength={6} style={{ backgroundColor: colors.surfaceContainerLowest, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 20, color: colors.onSurface, fontSize: 16 }} />
        <Text style={{ color: colors.onSurfaceVariant, fontSize: 12, fontWeight: "500", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 }}>Confirm PIN</Text>
        <TextInput value={confirmPin} onChangeText={setConfirmPin} placeholder="Confirm new PIN" placeholderTextColor={colors.outline} keyboardType="number-pad" secureTextEntry maxLength={6} style={{ backgroundColor: colors.surfaceContainerLowest, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 24, color: colors.onSurface, fontSize: 16 }} />
        <PrimaryButton label="Save" onPress={handleSave} icon="save" />
      </ScrollView>
    </ScreenWrapper>
  );
}
