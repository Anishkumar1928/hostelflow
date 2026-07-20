import React, { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView, Pressable, Image, ActivityIndicator, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { ScreenWrapper, StubHeader, PrimaryButton } from "../components/UI";
import { studentService } from "../services/student.service";
import { authStore } from "../services/authStore";
import { useTheme } from "../theme/ThemeContext";

// TODO: Replace with real upload API
// async function uploadAvatar(uri: string): Promise<string>
async function simulateUpload(uri: string): Promise<string> {
  return uri;
}

export default function EditProfile() {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [studentId, setStudentId] = useState("");

  const [avatar, setAvatar] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [hostelName, setHostelName] = useState("");
  const [roomNo, setRoomNo] = useState("");

  useEffect(() => {
    (async () => {
      const user = authStore.getUser();
      if (!user?.id) { setLoading(false); return; }
      const res = await studentService.getByUserId(user.id);
      if (res.success && res.data) {
        setStudentId(res.data.id);
        setName(res.data.fullName || "");
        setPhone(res.data.phone || "");
        setEmail(res.data.email || "");
        setGuardianName(res.data.parentName || "");
        setGuardianPhone(res.data.parentContact || "");
        setHostelName(res.data.hostelName || "");
        setRoomNo(res.data.roomNo || "");
      }
      setLoading(false);
    })();
  }, []);

  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const validatePhone = (v: string) => /^\d{10,15}$/.test(v.replace(/[\s\-()]/g, ""));

  const handlePickPhoto = async () => {
    const camera = await ImagePicker.requestCameraPermissionsAsync();
    const gallery = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!camera.granted || !gallery.granted) {
      Alert.alert("Permission Required", "Camera and gallery access is needed to change your profile photo.");
      return;
    }
    Alert.alert("Change Profile Photo", "Choose a source", [
      { text: "Camera", onPress: async () => {
        const result = await ImagePicker.launchCameraAsync({ mediaTypes: ["images"], quality: 0.8, allowsEditing: true, aspect: [1, 1] });
        if (!result.canceled && result.assets?.length) setAvatar(result.assets[0].uri);
      }},
      { text: "Gallery", onPress: async () => {
        const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.8, allowsEditing: true, aspect: [1, 1] });
        if (!result.canceled && result.assets?.length) setAvatar(result.assets[0].uri);
      }},
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleSave = async () => {
    const cleanPhone = phone.replace(/[\s\-()]/g, "");
    const cleanGuardianPhone = guardianPhone.replace(/[\s\-()]/g, "");

    if (!name.trim()) { Alert.alert("Validation", "Full name is required."); return; }
    if (!email.trim()) { Alert.alert("Validation", "Email address is required."); return; }
    if (!validateEmail(email.trim())) { Alert.alert("Validation", "Please enter a valid email address."); return; }
    if (phone && !validatePhone(phone)) { Alert.alert("Validation", "Phone number must be 10-15 digits."); return; }
    if (guardianPhone && !validatePhone(guardianPhone)) { Alert.alert("Validation", "Guardian phone number must be 10-15 digits."); return; }

    setSaving(true);

    let avatarUrl: string | undefined;
    if (avatar) {
      // TODO: Replace with real upload
      // avatarUrl = await uploadAvatar(avatar);
      avatarUrl = await simulateUpload(avatar);
    }

    const res = await studentService.update(studentId, {
      fullName: name.trim(),
      email: email.trim(),
      phone: cleanPhone || undefined,
      parentName: guardianName.trim() || undefined,
      parentContact: cleanGuardianPhone || undefined,
      hostelName: hostelName.trim() || undefined,
      roomNo: roomNo.trim() || undefined,
    });

    setSaving(false);

    if (res.success) {
      Alert.alert("Success", "Profile updated successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert("Error", res.error || "Failed to update profile");
    }
  };

  if (loading) {
    return (
      <ScreenWrapper>
        <StubHeader title="Edit Profile" />
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <StubHeader title="Edit Profile" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* Profile Photo */}
        <View style={{ alignItems: "center", marginBottom: 24 }}>
          <Pressable onPress={handlePickPhoto} style={{ position: "relative" }}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={{ width: 104, height: 104, borderRadius: 52, borderWidth: 3, borderColor: colors.primary }} />
            ) : (
              <View style={{ width: 104, height: 104, borderRadius: 52, backgroundColor: colors.surfaceContainerHigh, alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: colors.outlineVariant }}>
                <MaterialIcons name="person" size={48} color={colors.outline} />
              </View>
            )}
            <View style={{ position: "absolute", bottom: 0, right: 0, backgroundColor: colors.primary, width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: colors.background }}>
              <MaterialIcons name="camera-alt" size={16} color="#fff" />
            </View>
          </Pressable>
          <Pressable onPress={handlePickPhoto} style={{ marginTop: 8 }}>
            <Text style={{ color: colors.primary, fontWeight: "500", fontSize: 14 }}>Change Photo</Text>
          </Pressable>
        </View>

        {/* Full Name */}
        <Text style={{ color: colors.onSurfaceVariant, fontSize: 12, fontWeight: "500", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 }}>Full Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Your full name"
          placeholderTextColor={colors.outline}
          style={{ backgroundColor: colors.surfaceContainerLowest, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 20, color: colors.onSurface, fontSize: 16 }}
        />

        {/* Phone Number */}
        <Text style={{ color: colors.onSurfaceVariant, fontSize: 12, fontWeight: "500", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 }}>Phone Number</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="Phone number"
          placeholderTextColor={colors.outline}
          keyboardType="phone-pad"
          style={{ backgroundColor: colors.surfaceContainerLowest, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 20, color: colors.onSurface, fontSize: 16 }}
        />

        {/* Email Address */}
        <Text style={{ color: colors.onSurfaceVariant, fontSize: 12, fontWeight: "500", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 }}>Email Address</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email address"
          placeholderTextColor={colors.outline}
          keyboardType="email-address"
          autoCapitalize="none"
          style={{ backgroundColor: colors.surfaceContainerLowest, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 20, color: colors.onSurface, fontSize: 16 }}
        />

        {/* Guardian Name */}
        <Text style={{ color: colors.onSurfaceVariant, fontSize: 12, fontWeight: "500", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 }}>Guardian Name</Text>
        <TextInput
          value={guardianName}
          onChangeText={setGuardianName}
          placeholder="Parent or guardian name"
          placeholderTextColor={colors.outline}
          style={{ backgroundColor: colors.surfaceContainerLowest, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 20, color: colors.onSurface, fontSize: 16 }}
        />

        {/* Guardian Phone Number */}
        <Text style={{ color: colors.onSurfaceVariant, fontSize: 12, fontWeight: "500", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 }}>Guardian Phone Number</Text>
        <TextInput
          value={guardianPhone}
          onChangeText={setGuardianPhone}
          placeholder="Parent or guardian phone"
          placeholderTextColor={colors.outline}
          keyboardType="phone-pad"
          style={{ backgroundColor: colors.surfaceContainerLowest, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 20, color: colors.onSurface, fontSize: 16 }}
        />

        {/* Hostel Name */}
        <Text style={{ color: colors.onSurfaceVariant, fontSize: 12, fontWeight: "500", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 }}>Hostel Name</Text>
        <TextInput
          value={hostelName}
          onChangeText={setHostelName}
          placeholder="Hostel name"
          placeholderTextColor={colors.outline}
          style={{ backgroundColor: colors.surfaceContainerLowest, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 20, color: colors.onSurface, fontSize: 16 }}
        />

        {/* Room Number */}
        <Text style={{ color: colors.onSurfaceVariant, fontSize: 12, fontWeight: "500", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 }}>Room Number</Text>
        <TextInput
          value={roomNo}
          onChangeText={setRoomNo}
          placeholder="Room number"
          placeholderTextColor={colors.outline}
          style={{ backgroundColor: colors.surfaceContainerLowest, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 24, color: colors.onSurface, fontSize: 16 }}
        />

        <PrimaryButton label={saving ? "Saving..." : "Save Changes"} onPress={handleSave} icon="save" disabled={saving} />

        <Pressable onPress={() => navigation.goBack()} style={{ marginTop: 12, paddingVertical: 14, alignItems: "center" }}>
          <Text style={{ color: colors.onSurfaceVariant, fontWeight: "500", fontSize: 16 }}>Cancel</Text>
        </Pressable>
      </ScrollView>
    </ScreenWrapper>
  );
}
