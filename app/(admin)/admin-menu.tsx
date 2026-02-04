import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { getPosts, PostModel } from "@/services/api";

export default function BlogHomeScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [query, setQuery] = useState("");

  async function load() {
    try {
      setLoading(true);
      const data = await getPosts();
      console.log(data);
      setPosts(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((p) => p.title.toLowerCase().includes(q));
  }, [posts, query]);

  return (
    <View style={styles.page}>
      {/* “Top bar” estilo web */}
      <View style={styles.topbar}>
        <Text style={styles.brand}>🎓 EduBlog</Text>

        <View style={styles.topbarRight}>
          <Pressable onPress={() => router.push("/(user)")}>
            <Text style={styles.topLink}>Início</Text>
          </Pressable>

          <Pressable onPress={() => { /* opcional */ }}>
            <Text style={styles.topLink}>Publicações</Text>
          </Pressable>

          <Pressable style={styles.topBtn} onPress={() => router.push("/(admin)/create-post")}>
            <Text style={styles.topBtnText}>Criar post</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.h1}>Blog Acadêmico</Text>
      <Text style={styles.subtitle}>Uma coleção de posts de professores e alunos</Text>

      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔎</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Pesquisar publicação por título..."
          style={styles.searchInput}
        />
      </View>

      <Text style={styles.countText}>{filtered.length} publicações disponíveis</Text>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ gap: 14 }}
          contentContainerStyle={{ paddingBottom: 18 }}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => router.push(`/(admin)/post/${item.id}`)} // rota fora do grupo, ver abaixo
            >
              <View style={styles.cardImagePlaceholder}>
                <Text style={styles.imgEmoji}>🖼️</Text>
              </View>

              <Text numberOfLines={2} style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardMeta}>By {item.author}</Text>
              <Text numberOfLines={2} style={styles.cardContent}>{item.content}</Text>

              <View style={styles.readMoreRow}>
                <Text style={styles.readMore}>Ler mais →</Text>
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#fff", padding: 18 },
  topbar: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  brand: { fontSize: 16, fontWeight: "800", color: "#2563EB" },
  topbarRight: { flexDirection: "row", alignItems: "center", gap: 14 },
  topLink: { color: "#374151", fontWeight: "600" },
  topBtn: { backgroundColor: "#2563EB", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  topBtnText: { color: "#fff", fontWeight: "700" },

  h1: { fontSize: 34, fontWeight: "900", color: "#2563EB", marginTop: 6 },
  subtitle: { color: "#6B7280", marginTop: 6, marginBottom: 14 },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14 },

  countText: { color: "#6B7280", marginBottom: 12, fontWeight: "600" },
  loading: { paddingVertical: 40, alignItems: "center" },

  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 14,
    overflow: "hidden",
    elevation: 1,
  },
  cardImagePlaceholder: {
    height: 120,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  imgEmoji: { fontSize: 26 },

  cardTitle: { fontSize: 16, fontWeight: "800", paddingHorizontal: 12, paddingTop: 10 },
  cardMeta: { color: "#6B7280", paddingHorizontal: 12, paddingTop: 4, fontWeight: "600" },
  cardContent: { color: "#374151", paddingHorizontal: 12, paddingTop: 6, paddingBottom: 10 },
  readMoreRow: { paddingHorizontal: 12, paddingBottom: 12 },
  readMore: { color: "#2563EB", fontWeight: "800" },
});
