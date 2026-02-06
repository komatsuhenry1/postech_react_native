import { Screen } from "@/components/Screen";
import { getPostById, PostDetailModel } from "@/services/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";

const IMAGES = [
  require("@/assets/images/posts/education_1.png"),
  require("@/assets/images/posts/education_2.png"),
  require("@/assets/images/posts/education_3.png"),
];

export default function PostDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const imageSource = IMAGES[Number(id) % IMAGES.length] || IMAGES[0];

  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<PostDetailModel | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setError(null);
        setLoading(true);

        const data = await getPostById(String(id));
        setPost(data);
      } catch (e: any) {
        setError(e?.message ?? "Erro ao carregar post");
      } finally {
        setLoading(false);
      }
    }

    if (id) load();
  }, [id]);

  return (
    <Screen>
      <View style={styles.page}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← Voltar</Text>
          </Pressable>

          <Text style={styles.brand}>🎓 EduBlog</Text>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator />
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Text style={styles.errorTitle}>Não deu pra carregar 😅</Text>
            <Text style={styles.errorText}>{error}</Text>

            <Pressable onPress={() => router.replace(`/posts/post/${String(id)}`)} style={styles.retryBtn}>
              <Text style={styles.retryText}>Tentar de novo</Text>
            </Pressable>
          </View>
        ) : post ? (
          <View style={styles.card}>
            <Image source={imageSource} style={styles.banner} resizeMode="cover" />
            <Text style={styles.title}>{post.title}</Text>

            <View style={styles.metaRow}>
              <Text style={styles.meta}>By {post.author}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{post.status}</Text>
              </View>
            </View>

            <Text style={styles.date}>
              Criado: {formatDate(post.created_at)} • Atualizado: {formatDate(post.updated_at)}
            </Text>

            <View style={styles.hr} />

            <Text style={styles.content}>{post.content}</Text>

            <View style={styles.hr} />

            <Text style={styles.sectionTitle}>Comentários</Text>
            {post.comments?.length ? (
              <Text style={styles.commentText}>({post.comments.length})</Text>
            ) : (
              <Text style={styles.empty}>Nenhum comentário ainda.</Text>
            )}
          </View>
        ) : (
          <View style={styles.center}>
            <Text>Post não encontrado.</Text>
          </View>
        )}
      </View>
    </Screen>
  );
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString();
  } catch {
    return iso;
  }
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#fff", padding: 18 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  brand: { fontSize: 16, fontWeight: "900", color: "#2563EB" },

  backBtn: { backgroundColor: "#F3F4F6", paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10 },
  backText: { fontWeight: "800", color: "#111827" },

  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 18 },

  card: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: { fontSize: 24, fontWeight: "900", color: "#111827" },

  metaRow: { marginTop: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  meta: { color: "#6B7280", fontWeight: "700" },

  badge: { backgroundColor: "#EEF2FF", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  badgeText: { color: "#2563EB", fontWeight: "900", fontSize: 12 },

  date: { marginTop: 8, color: "#9CA3AF", fontWeight: "600" },

  hr: { height: 1, backgroundColor: "#E5E7EB", marginVertical: 14 },

  content: { fontSize: 16, lineHeight: 22, color: "#111827" },
  banner: { width: "100%", height: 200, borderRadius: 12, marginBottom: 16 },

  sectionTitle: { fontSize: 16, fontWeight: "900", color: "#111827" },
  empty: { marginTop: 8, color: "#6B7280", fontWeight: "600" },
  commentText: { marginTop: 8, color: "#6B7280", fontWeight: "700" },

  errorTitle: { fontSize: 18, fontWeight: "900", color: "#111827", marginBottom: 6 },
  errorText: { color: "#6B7280", textAlign: "center", marginBottom: 14 },
  retryBtn: { backgroundColor: "#2563EB", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 },
  retryText: { color: "#fff", fontWeight: "900" },
});
