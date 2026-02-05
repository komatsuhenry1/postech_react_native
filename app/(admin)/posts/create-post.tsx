import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { createPost } from "@/services/api";
import { Screen } from "@/components/Screen";


export default function CreatePostScreen() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreatePost() {
    if (!title.trim() || !content.trim() || !author.trim()) {
      Alert.alert("Erro", "Preencha Title, Content e Author.");
      return;
    }

    try {
      setLoading(true);
      await createPost(title.trim(), content.trim(), author.trim());
      Alert.alert("Sucesso", "Post criado!");
      router.back();
    } catch (e: any) {
      Alert.alert("Erro", e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.h1}>Criar Publicação</Text>
      <Text style={styles.subtitle}>Crie uma publicação para o seu blog</Text>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Voltar</Text>
        </Pressable>

      <View style={styles.form}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Ex: Post 10"
          style={styles.input}
          autoCapitalize="sentences"
        />

        <Text style={[styles.label, { marginTop: 16 }]}>Content</Text>

        {/* “toolbar” fake só para ficar igual ao visual da imagem */}
        <View style={styles.toolbar}>
          <Text style={styles.toolBtn}>B</Text>
          <Text style={styles.toolBtn}>I</Text>
          <Text style={styles.toolBtn}>U</Text>
          <View style={styles.toolDivider} />
          <Text style={styles.toolBtn}>•</Text>
          <Text style={styles.toolBtn}>1.</Text>
          <View style={styles.toolDivider} />
          <Text style={styles.toolBtn}>🔗</Text>
          <Text style={styles.toolBtn}>T</Text>
        </View>

        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="Escreva o conteúdo..."
          style={styles.textarea}
          multiline
          textAlignVertical="top"
        />

        <Text style={[styles.label, { marginTop: 16 }]}>Author</Text>
        <TextInput
          value={author}
          onChangeText={setAuthor}
          placeholder="Ex: Henry K2"
          style={styles.input}
          autoCapitalize="words"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleCreatePost}
          disabled={loading}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>{loading ? "Salvando..." : "Criar"}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  h1: {
    fontSize: 34,
    fontWeight: "800",
    color: "#2E74FF", // azul parecido com o da imagem
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 18,
  },
  form: {
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: "#fff",
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 10,
    backgroundColor: "#F9FAFB",
  },
  toolBtn: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4B5563",
    width: 22,
    textAlign: "center",
  },
  toolDivider: {
    height: 18,
    width: 1,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 4,
  },
  textarea: {
    borderWidth: 1,
    borderColor: "#60A5FA", // borda azul “ativa” parecida
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopWidth: 0,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 15,
    minHeight: 260,
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 18,
    backgroundColor: "#2E74FF",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  backText: { fontWeight: "800", color: "#111827" },
  backBtn: { backgroundColor: "#F3F4F6", paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10 },
  
});
