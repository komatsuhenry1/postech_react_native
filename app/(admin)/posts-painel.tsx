import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { deletePost, getPosts, searchPosts, PostModel } from "@/services/api";
import { Screen } from "@/components/Screen";

export default function PostsPainelScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState<PostModel[]>([]);

  async function loadAll() {
    try {
      setLoading(true);
      const data = await getPosts();
      setPosts(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  // busca no backend com debounce
  useEffect(() => {
    const term = query.trim();

    const t = setTimeout(async () => {
      try {
        setLoading(true);

        if (!term) {
          const data = await getPosts();
          setPosts(data);
          return;
        }

        const data = await searchPosts(term);
        setPosts(data);
      } catch (e) {
        console.log(e);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(t);
  }, [query]);

  const resultsLabel = useMemo(() => {
    const n = posts.length;
    return `Mostrando 1 a ${n} de ${n} resultados`;
  }, [posts.length]);

  async function confirmDelete(id: string, title: string) {
    Alert.alert(
      "Excluir publicação",
      `Tem certeza que deseja excluir:\n\n"${title}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await deletePost(id);
              await loadAll();
            } catch (e: any) {
              Alert.alert("Erro", e?.message ?? "Não foi possível excluir.");
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  }

  return (
    <Screen>
    <View style={styles.page}>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.backButton}>← Voltar</Text>
      </Pressable>
      <Text style={styles.h1}>Minhas Publicações</Text>
      <Text style={styles.subtitle}>Gerencie suas publicações</Text>

      <View style={styles.filtersRow}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔎</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search by title or author..."
            style={styles.searchInput}
          />
        </View>

        {/* filtros visuais (stub) só pra ficar igual ao layout */}
        <Pressable style={styles.dropdownStub}>
          <Text style={styles.dropdownText}>Status ▾</Text>
        </Pressable>

        <Pressable style={styles.dropdownStub}>
          <Text style={styles.dropdownText}>Author ▾</Text>
        </Pressable>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.th, styles.colTitle]}>TITLE</Text>
          <Text style={[styles.th, styles.colAuthor]}>AUTHOR</Text>
          <Text style={[styles.th, styles.colDate]}>DATE</Text>
          <Text style={[styles.th, styles.colStatus]}>STATUS</Text>
          <Text style={[styles.th, styles.colActions]}>ACTIONS</Text>
        </View>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator />
          </View>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <View style={styles.tr}>
                <Text numberOfLines={1} style={[styles.td, styles.colTitle, styles.titleStrong]}>
                  {item.title}
                </Text>

                <Text numberOfLines={1} style={[styles.td, styles.colAuthor]}>
                  {item.author}
                </Text>

                <Text style={[styles.td, styles.colDate]}>
                  {formatDate(item.created_at)}
                </Text>

                <View style={[styles.colStatus, styles.statusCell]}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>

                <View style={[styles.colActions, styles.actionsRow]}>
                  {/* 👁️ view */}
                  <Pressable
                    style={styles.iconBtn}
                    onPress={() => router.push(`/(admin)/post/${item.id}`)}
                  >
                    <Text style={styles.iconText}>👁️</Text>
                  </Pressable>

                  {/* ✏️ edit */}
                  <Pressable
                    style={styles.iconBtn}
                    onPress={() => router.push(`/(admin)/post-edit/${item.id}`)}
                  >
                    <Text style={styles.iconText}>✏️</Text>
                  </Pressable>

                  {/* 🗑️ delete */}
                  <Pressable
                    style={styles.iconBtn}
                    onPress={() => confirmDelete(item.id, item.title)}
                  >
                    <Text style={[styles.iconText, { color: "#DC2626" }]}>🗑️</Text>
                  </Pressable>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>Nenhuma publicação encontrada.</Text>
              </View>
            }
          />
        )}
      </View>

      <Text style={styles.footerText}>{resultsLabel}</Text>
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
  h1: { fontSize: 34, fontWeight: "900", color: "#2563EB" },
  subtitle: { marginTop: 6, color: "#6B7280", marginBottom: 16 },

  filtersRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14 },

  dropdownStub: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
  },
  dropdownText: { fontWeight: "700", color: "#374151" },

  table: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  backButton: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2563EB",
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#F9FAFB",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  th: { fontSize: 12, fontWeight: "900", color: "#6B7280" },

  tr: {
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    alignItems: "center",
  },
  td: { fontSize: 14, color: "#111827" },

  colTitle: { flex: 2.2 },
  colAuthor: { flex: 1.2 },
  colDate: { flex: 1.2 },
  colStatus: { flex: 1.3 },
  colActions: { flex: 1.1, alignItems: "flex-end" },

  titleStrong: { fontWeight: "800" },

  statusCell: { flexDirection: "row", alignItems: "center", gap: 8 },
  statusDot: { width: 8, height: 8, borderRadius: 8, backgroundColor: "#22C55E" },
  statusText: { color: "#6B7280", fontWeight: "700" },

  actionsRow: { flexDirection: "row", gap: 10, justifyContent: "flex-end" },
  iconBtn: { padding: 6, borderRadius: 10 },
  iconText: { fontSize: 16 },

  loadingBox: { paddingVertical: 30, alignItems: "center" },
  emptyBox: { paddingVertical: 20, alignItems: "center" },
  emptyText: { color: "#6B7280", fontWeight: "700" },

  footerText: { marginTop: 12, color: "#6B7280", fontWeight: "600" },
});
