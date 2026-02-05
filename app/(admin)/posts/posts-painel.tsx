import { Screen } from "@/components/Screen";
import { deletePost, getPosts, PostModel, searchPosts } from "@/services/api";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const STATIC_IMAGES = [
  require("@/assets/images/posts/education_1.png"),
  require("@/assets/images/posts/education_2.png"),
  require("@/assets/images/posts/education_3.png"),
];

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

  function getPostImage(index: number) {
    return STATIC_IMAGES[index % STATIC_IMAGES.length];
  }

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
        {/* Header Igual ao Admin Menu */}
        <View style={styles.topbar}>
          <View style={styles.topbarLeft}>
            <Pressable onPress={() => router.back()}>
              <Text style={styles.backButton}>←</Text>
            </Pressable>
          </View>

          <Text style={styles.brand}>🎓 EduBlog</Text>
        </View>

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

          {/* Filtros visuais */}
          <Pressable style={styles.dropdownStub}>
            <Text style={styles.dropdownText}>Status ▾</Text>
          </Pressable>
        </View>

        <Text style={styles.countText}>{resultsLabel}</Text>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator />
          </View>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(i) => i.id}
            numColumns={2}
            columnWrapperStyle={{ gap: 14 }}
            contentContainerStyle={{ paddingBottom: 18 }}
            renderItem={({ item, index }) => (
              <View style={styles.card}>
                <Image source={getPostImage(index)} style={styles.cardCover} />

                <Text numberOfLines={2} style={styles.cardTitle}>{item.title}</Text>

                <View style={styles.cardMetaRow}>
                  <Text style={styles.cardMeta}>By {item.author}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: item.status === 'published' ? '#DCFCE7' : '#F3F4F6' }]}>
                    <Text style={[styles.statusText, { color: item.status === 'published' ? '#166534' : '#6B7280' }]}>
                      {item.status}
                    </Text>
                  </View>
                </View>

                {/* Ações */}
                <View style={styles.actionsContainer}>
                  <Pressable
                    style={[styles.actionBtn, styles.viewBtn]}
                    onPress={() => router.push(`/post/${item.id}`)}
                  >
                    <Text style={styles.actionBtnText}>👁️</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.actionBtn, styles.editBtn]}
                    onPress={() => router.push(`/(admin)/posts/post-edit/${item.id}`)}
                  >
                    <Text style={styles.actionBtnText}>✏️</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.actionBtn, styles.deleteBtn]}
                    onPress={() => confirmDelete(item.id, item.title)}
                  >
                    <Text style={styles.actionBtnText}>🗑️</Text>
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

  // Header
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
    zIndex: 10,
  },
  topbarLeft: { width: 40 },
  backButton: { fontSize: 24, fontWeight: "700", color: "#2563EB" },
  brand: {
    fontSize: 20,
    fontWeight: "900",
    color: "#2563EB",
    flex: 1,
    textAlign: "center",
  },
  topbarRight: {
    width: 40,
    alignItems: "flex-end",
  },
  menuBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  menuBtnText: { fontSize: 20, color: "#374151", fontWeight: "bold" },

  // Dropdown
  dropdown: {
    position: "absolute",
    top: 60,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    width: 180,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  dropdownItem: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8 },
  dropdownItemText: { fontSize: 14, fontWeight: "600", color: "#374151" },
  dropdownItemTextSair: { fontSize: 14, fontWeight: "600", color: "#DC2626" },
  dropdownSeparator: { height: 1, backgroundColor: "#E5E7EB", marginVertical: 6 },

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

  countText: { color: "#6B7280", marginBottom: 12, fontWeight: "600" },
  loadingBox: { paddingVertical: 30, alignItems: "center" },
  emptyBox: { paddingVertical: 20, alignItems: "center" },
  emptyText: { color: "#6B7280", fontWeight: "700" },

  // Cards
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
  cardCover: {
    height: 120,
    width: "100%",
  },
  cardTitle: { fontSize: 16, fontWeight: "800", paddingHorizontal: 12, paddingTop: 10 },
  cardMetaRow: {
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardMeta: { color: "#6B7280", fontWeight: "600", fontSize: 12 },
  statusBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  statusText: { fontSize: 10, fontWeight: "700" },

  actionsContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  actionBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  viewBtn: { backgroundColor: "#EFF6FF" }, // light blue
  editBtn: { backgroundColor: "#FFF7ED" }, // light orange
  deleteBtn: { backgroundColor: "#FEF2F2" }, // light red
  actionBtnText: { fontSize: 18 },
});
