import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, Alert } from "react-native";
import { ScreenWrapper, StubHeader, PrimaryButton } from "../components/UI";
import { useTheme } from "../theme/ThemeContext";

export default function ReportProblem() {
  const { colors } = useTheme();
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!subject.trim()) { Alert.alert("Validation", "Please enter a subject."); return; }
    if (!description.trim()) { Alert.alert("Validation", "Please describe the problem."); return; }
    Alert.alert("Submitted", "Thank you for your report. Our team will look into it shortly.");
    setSubject(""); setDescription("");
  };

  return (
    <ScreenWrapper>
      <StubHeader title="Report a Problem" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Text style={{ color: colors.onSurfaceVariant, fontSize: 12, fontWeight: "500", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 }}>Subject</Text>
        <TextInput value={subject} onChangeText={setSubject} placeholder="Brief subject of the problem" placeholderTextColor={colors.outline} style={{ backgroundColor: colors.surfaceContainerLowest, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 20, color: colors.onSurface, fontSize: 16 }} />
        <Text style={{ color: colors.onSurfaceVariant, fontSize: 12, fontWeight: "500", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 }}>Description</Text>
        <TextInput value={description} onChangeText={setDescription} placeholder="Describe the problem in detail" placeholderTextColor={colors.outline} multiline numberOfLines={5} style={{ backgroundColor: colors.surfaceContainerLowest, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 24, color: colors.onSurface, fontSize: 16, minHeight: 140, textAlignVertical: "top" }} />
        <PrimaryButton label="Submit" icon="send" onPress={handleSubmit} />
      </ScrollView>
    </ScreenWrapper>
  );
}
