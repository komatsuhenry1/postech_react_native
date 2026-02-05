import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getPostById, updatePost, PostDetailModel } from "@/services/api";

export default function EditPostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<PostDetailModel | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");

  async function load() {
    try {
      setLoading(true);
      const data = await getPostById(String(id));
      setPost(data);
      setTitle(data.title ?? "");
      setContent(data.content ?? "");
    } catch (e: any) {
      Alert.alert("Erro", e?.message ?? "Não foi possível carregar.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) load();
  }, [id]);

  async function handleSave() {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Erro", "Preencha Título e Conteúdo.");
      return;
    }

    try {
      setLoading(true);
      await updatePost(String(id), title.trim(), content.trim(), author.trim());
      Alert.alert("Sucesso", "Alterações salvas!");
      router.back();
    } catch (e: any) {
      Alert.alert("Erro", e?.message ?? "Não foi possível salvar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.h1}>Editar Publicação</Text>
      <Text style={styles.subtitle}>Edite uma publicação para o seu blog</Text>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      ) : (
        <View style={styles.grid}>
          {/* coluna esquerda */}
          <View style={styles.left}>
            <Text style={styles.label}>Título</Text>
            <TextInput value={title} onChangeText={setTitle} style={styles.input} />

            <Text style={[styles.label, { marginTop: 14 }]}>Conteúdo</Text>
            <TextInput
              value={content}
              onChangeText={setContent}
              style={styles.textarea}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* coluna direita (cards) */}
          <View style={styles.right}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Ações</Text>

              <Pressable style={[styles.primaryBtn, loading && styles.btnDisabled]} onPress={handleSave} disabled={loading}>
                <Text style={styles.primaryBtnText}>💾 Salvar alterações</Text>
              </Pressable>

              <Pressable style={styles.secondaryBtn} onPress={() => router.back()}>
                <Text style={styles.secondaryBtnText}>✕ Cancelar</Text>
              </Pressable>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Detalhes</Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailKey}>Autor:</Text>
                <Text style={styles.detailVal}>{post?.author ?? "-"}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailKey}>Status:</Text>
                <Text style={styles.detailVal}>{post?.status ?? "-"}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailKey}>Data de atualização:</Text>
                <Text style={styles.detailVal}>{post ? formatDate(post.updated_at) : "-"}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailKey}>Data de criação:</Text>
                <Text style={styles.detailVal}>{post ? formatDate(post.created_at) : "-"}</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso;
  }
}

const styles = StyleSheet.create({
  page: { padding: 18, backgroundColor: "#fff", flexGrow: 1 },
  h1: { fontSize: 34, fontWeight: "900", color: "#2563EB" },
  subtitle: { marginTop: 6, color: "#6B7280", marginBottom: 16 },
  center: { paddingVertical: 40, alignItems: "center" },

  // “grid” responsivo: no mobile fica uma coluna, mas a estética se mantém
  grid: { gap: 14 },
  left: {},
  right: { gap: 14 },

  label: { fontSize: 14, fontWeight: "800", color: "#111827", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#60A5FA",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: "#fff",
  },
  textarea: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    minHeight: 260,
    backgroundColor: "#F9FAFB",
  },

  card: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 14,
    backgroundColor: "#fff",
  },
  cardTitle: { fontSize: 18, fontWeight: "900", color: "#111827", marginBottom: 10 },

  primaryBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "900" },

  secondaryBtn: {
    marginTop: 10,
    backgroundColor: "#F3F4F6",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryBtnText: { color: "#374151", fontWeight: "900" },

  btnDisabled: { opacity: 0.6 },

  detailRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 },
  detailKey: { color: "#6B7280", fontWeight: "800" },
  detailVal: { color: "#111827", fontWeight: "800" },
});
