import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, Alert } from "react-native";
import { ScreenWrapper, StubHeader, PrimaryButton } from "../components/UI";
import { useTheme } from "../theme/ThemeContext";

export default function ChangePassword() {
  const { colors } = useTheme();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = () => {
    if (!currentPassword) { Alert.alert("Validation", "Please enter your current password."); return; }
    if (!newPassword) { Alert.alert("Validation", "Please enter a new password."); return; }
    if (newPassword.length < 6) { Alert.alert("Validation", "New password must be at least 6 characters."); return; }
    if (newPassword !== confirmPassword) { Alert.alert("Validation", "Passwords do not match."); return; }
    Alert.alert("Success", "Password changed successfully.");
    setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
  };

  return (
    <ScreenWrapper>
      <StubHeader title="Change Password" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Text style={{ color: colors.onSurfaceVariant, fontSize: 12, fontWeight: "500", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 }}>Current Password</Text>
        <TextInput value={currentPassword} onChangeText={setCurrentPassword} placeholder="Enter current password" placeholderTextColor={colors.outline} secureTextEntry style={{ backgroundColor: colors.surfaceContainerLowest, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 20, color: colors.onSurface, fontSize: 16 }} />
        <Text style={{ color: colors.onSurfaceVariant, fontSize: 12, fontWeight: "500", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 }}>New Password</Text>
        <TextInput value={newPassword} onChangeText={setNewPassword} placeholder="Enter new password" placeholderTextColor={colors.outline} secureTextEntry style={{ backgroundColor: colors.surfaceContainerLowest, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 20, color: colors.onSurface, fontSize: 16 }} />
        <Text style={{ color: colors.onSurfaceVariant, fontSize: 12, fontWeight: "500", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 }}>Confirm Password</Text>
        <TextInput value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Confirm new password" placeholderTextColor={colors.outline} secureTextEntry style={{ backgroundColor: colors.surfaceContainerLowest, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 24, color: colors.onSurface, fontSize: 16 }} />
        <PrimaryButton label="Save" onPress={handleSave} icon="save" />
      </ScrollView>
    </ScreenWrapper>
  );
}
