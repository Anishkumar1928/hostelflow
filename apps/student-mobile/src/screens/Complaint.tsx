import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Alert, Modal, ActivityIndicator, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { ScreenWrapper, StubHeader, PrimaryButton } from "../components/UI";
import { complaintService } from "../services/complaint.service";
import { studentService } from "../services/student.service";
import { authStore } from "../services/authStore";
import { useTheme } from "../theme/ThemeContext";

const CATEGORIES = ["Maintenance", "Cleaning", "Noise", "Electricity", "Plumbing", "Security", "Other"];
const PRIORITIES = ["Low", "Medium", "High", "Critical"];

// TODO: Replace with real image upload API
// async function uploadImage(uri: string): Promise<string>
async function simulateUpload(uri: string): Promise<string> {
  return uri;
}

export default function Complaint() {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [studentProfile, setStudentProfile] = useState<any>(null);

  useEffect(() => {
    const user = authStore.getUser();
    if (!user?.id) { setProfileLoading(false); return; }
    studentService.getByUserId(user.id).then(res => {
      if (res.success && res.data) setStudentProfile(res.data);
    }).finally(() => setProfileLoading(false));
  }, []);

  const pickImage = async (useCamera: boolean) => {
    const permission = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Required", `Access to ${useCamera ? "camera" : "gallery"} is needed to attach a photo.`);
      return;
    }
    const result = useCamera
      ? await ImagePicker.launchCameraAsync({ mediaTypes: ["images"], quality: 0.8, allowsEditing: true })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.8, allowsEditing: true });
    if (!result.canceled && result.assets?.length) {
      setPhoto(result.assets[0].uri);
    }
    setShowPhotoPicker(false);
  };

  const handleSubmit = async () => {
    if (!title.trim()) { Alert.alert("Required", "Please enter a complaint title."); return; }
    if (!description.trim()) { Alert.alert("Required", "Please describe your issue."); return; }
    const user = authStore.getUser();
    const studentId = studentProfile?.id || user?.id || "";
    const roomNo = studentProfile?.roomNo || studentProfile?.allocations?.[0]?.room?.roomNumber || "";
    const roomId = studentProfile?.roomId || studentProfile?.allocations?.[0]?.roomId || "";
    setLoading(true);
    let photoUrl = "";
    if (photo) {
      // TODO: Replace with real upload
      // photoUrl = await uploadImage(photo);
      photoUrl = await simulateUpload(photo);
    }
    const res = await complaintService.create({
      studentId,
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      roomId,
      roomNo,
      photoUrl,
      studentName: studentProfile?.name || user?.name,
    });
    setLoading(false);
    if (res.success) {
      setSubmitted(true);
    } else {
      Alert.alert("Error", res.error || "Failed to submit complaint");
    }
  };

  if (profileLoading) {
    return (
      <ScreenWrapper>
        <StubHeader title="Raise Complaint" />
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  if (submitted) {
    return (
      <ScreenWrapper>
        <StubHeader title="Raise Complaint" />
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }}>
          <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: colors.successContainer, alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
            <MaterialIcons name="check-circle" size={40} color={colors.success} />
          </View>
          <Text style={{ color: colors.onSurface, fontSize: 22, fontWeight: "700", textAlign: "center" }}>Complaint Submitted!</Text>
          <Text style={{ color: colors.onSurfaceVariant, fontSize: 15, textAlign: "center", marginTop: 8, lineHeight: 22 }}>Your complaint has been recorded. You can track its status anytime.</Text>
          <View style={{ marginTop: 32, width: "100%" }}>
            <PrimaryButton label="View Status" onPress={() => navigation.navigate("ComplaintStatus")} />
          </View>
          <Pressable onPress={() => navigation.goBack()} style={{ marginTop: 12, padding: 8 }}>
            <Text style={{ color: colors.primary, fontWeight: "500", fontSize: 15 }}>Back to Dashboard</Text>
          </Pressable>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <StubHeader title="Raise Complaint" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* Category */}
        <Text style={{ color: colors.onSurfaceVariant, fontSize: 12, fontWeight: "500", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 }}>Category</Text>
        <Pressable
          onPress={() => setShowCategoryPicker(true)}
          style={{ backgroundColor: colors.surfaceContainerLowest, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
        >
          <Text style={{ color: colors.onSurface, fontSize: 16 }}>{category}</Text>
          <MaterialIcons name="arrow-drop-down" size={24} color={colors.onSurfaceVariant} />
        </Pressable>

        {/* Title */}
        <Text style={{ color: colors.onSurfaceVariant, fontSize: 12, fontWeight: "500", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 }}>Complaint Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Brief title for your complaint"
          placeholderTextColor={colors.outline}
          style={{ backgroundColor: colors.surfaceContainerLowest, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 20, color: colors.onSurface, fontSize: 16 }}
        />

        {/* Description */}
        <Text style={{ color: colors.onSurfaceVariant, fontSize: 12, fontWeight: "500", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 }}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Describe your issue in detail"
          placeholderTextColor={colors.outline}
          multiline
          numberOfLines={5}
          style={{ backgroundColor: colors.surfaceContainerLowest, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 20, color: colors.onSurface, fontSize: 16, minHeight: 130, textAlignVertical: "top" }}
        />

        {/* Photo Upload */}
        <Text style={{ color: colors.onSurfaceVariant, fontSize: 12, fontWeight: "500", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 }}>Upload Photo</Text>
        {photo ? (
          <View style={{ marginBottom: 20 }}>
            <Image source={{ uri: photo }} style={{ width: "100%", height: 180, borderRadius: 12, backgroundColor: colors.surfaceContainer }} />
            <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
              <Pressable onPress={() => setPhoto(null)} style={{ flexDirection: "row", alignItems: "center", gap: 4, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, backgroundColor: colors.errorContainer }}>
                <MaterialIcons name="delete" size={16} color={colors.error} />
                <Text style={{ color: colors.error, fontSize: 13, fontWeight: "500" }}>Remove</Text>
              </Pressable>
              <Pressable onPress={() => setShowPhotoPicker(true)} style={{ flexDirection: "row", alignItems: "center", gap: 4, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, backgroundColor: colors.primaryContainer }}>
                <MaterialIcons name="camera-alt" size={16} color={colors.primary} />
                <Text style={{ color: colors.primary, fontSize: 13, fontWeight: "500" }}>Change</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable
            onPress={() => setShowPhotoPicker(true)}
            style={{ borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 12, borderStyle: "dashed", paddingVertical: 32, alignItems: "center", justifyContent: "center", marginBottom: 20, backgroundColor: colors.surfaceContainerLow }}
          >
            <MaterialIcons name="add-a-photo" size={36} color={colors.outline} />
            <Text style={{ color: colors.onSurfaceVariant, fontSize: 14, marginTop: 8 }}>Tap to add a photo</Text>
            <Text style={{ color: colors.outline, fontSize: 12, marginTop: 2 }}>Camera or gallery</Text>
          </Pressable>
        )}

        {/* Priority */}
        <Text style={{ color: colors.onSurfaceVariant, fontSize: 12, fontWeight: "500", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 }}>Priority</Text>
        <View style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: "row", gap: 10 }}>
            {PRIORITIES.map((p) => {
              const selected = priority === p;
              const pColors: Record<string, string> = { Low: colors.success, Medium: "#d97706", High: colors.error, Critical: "#dc2626" };
              return (
                <Pressable
                  key={p}
                  onPress={() => setPriority(p)}
                  style={{ flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: "center", backgroundColor: selected ? pColors[p] + "20" : colors.surfaceContainerLow, borderWidth: 1, borderColor: selected ? pColors[p] : colors.outlineVariant }}
                >
                  <Text style={{ color: selected ? pColors[p] : colors.onSurfaceVariant, fontWeight: selected ? "700" : "500", fontSize: 13 }}>{p}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <PrimaryButton label={loading ? "Submitting..." : "Submit Complaint"} onPress={handleSubmit} icon="report-problem" disabled={loading} />
      </ScrollView>

      {/* Category Picker Modal */}
      <Modal visible={showCategoryPicker} transparent animationType="fade" onRequestClose={() => setShowCategoryPicker(false)}>
        <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", paddingHorizontal: 32 }} onPress={() => setShowCategoryPicker(false)}>
          <Pressable style={{ backgroundColor: colors.surfaceContainerLowest, borderRadius: 16, padding: 20 }} onPress={() => {}}>
            <Text style={{ color: colors.onSurface, fontWeight: "600", fontSize: 18, marginBottom: 16 }}>Select Category</Text>
            {CATEGORIES.map((c) => (
              <Pressable
                key={c}
                onPress={() => { setCategory(c); setShowCategoryPicker(false); }}
                style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 14, paddingHorizontal: 16, borderRadius: 10, backgroundColor: category === c ? colors.primaryContainer + "60" : "transparent", marginBottom: 4 }}
              >
                <Text style={{ color: category === c ? colors.primary : colors.onSurface, fontWeight: category === c ? "600" : "400", fontSize: 16 }}>{c}</Text>
                {category === c ? <MaterialIcons name="check" size={20} color={colors.primary} /> : null}
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>

      {/* Photo Source Picker Modal */}
      <Modal visible={showPhotoPicker} transparent animationType="fade" onRequestClose={() => setShowPhotoPicker(false)}>
        <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" }} onPress={() => setShowPhotoPicker(false)}>
          <Pressable style={{ backgroundColor: colors.surfaceContainerLowest, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 40 }} onPress={() => {}}>
            <Text style={{ color: colors.onSurface, fontWeight: "600", fontSize: 18, marginBottom: 20, textAlign: "center" }}>Add Photo</Text>
            <Pressable onPress={() => pickImage(true)} style={{ flexDirection: "row", alignItems: "center", gap: 16, paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, backgroundColor: colors.surfaceContainerLow, marginBottom: 12 }}>
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: colors.primaryContainer, alignItems: "center", justifyContent: "center" }}>
                <MaterialIcons name="camera-alt" size={24} color={colors.primary} />
              </View>
              <View><Text style={{ color: colors.onSurface, fontSize: 16, fontWeight: "500" }}>Take Photo</Text><Text style={{ color: colors.onSurfaceVariant, fontSize: 13 }}>Use your camera</Text></View>
            </Pressable>
            <Pressable onPress={() => pickImage(false)} style={{ flexDirection: "row", alignItems: "center", gap: 16, paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, backgroundColor: colors.surfaceContainerLow }}>
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: colors.primaryContainer, alignItems: "center", justifyContent: "center" }}>
                <MaterialIcons name="photo-library" size={24} color={colors.primary} />
              </View>
              <View><Text style={{ color: colors.onSurface, fontSize: 16, fontWeight: "500" }}>Choose from Gallery</Text><Text style={{ color: colors.onSurfaceVariant, fontSize: 13 }}>Browse your photos</Text></View>
            </Pressable>
            <Pressable onPress={() => setShowPhotoPicker(false)} style={{ marginTop: 16, paddingVertical: 12, alignItems: "center" }}>
              <Text style={{ color: colors.onSurfaceVariant, fontSize: 15 }}>Cancel</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </ScreenWrapper>
  );
}
