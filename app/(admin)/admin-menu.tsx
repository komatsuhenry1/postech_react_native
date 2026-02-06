import { Screen } from "@/components/Screen";
import { getPosts, PostModel } from "@/services/api";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const STATIC_IMAGES = [
  require("@/assets/images/posts/education_1.png"),
  require("@/assets/images/posts/education_2.png"),
  require("@/assets/images/posts/education_3.png"),
];

export default function BlogHomeScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [query, setQuery] = useState("");
  const [showMenu, setShowMenu] = useState(false);

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

  function getPostImage(index: number) {
    return STATIC_IMAGES[index % STATIC_IMAGES.length];
  }

  const renderHeader = () => (
    <View style={styles.headerContent}>
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
    </View>
  );

  return (
    <Screen>
      <View style={styles.page}>
        {/* “Top bar” estilo web */}
        <View style={styles.topbar}>
          <View style={styles.topbarLeft} />

                  <Text style={styles.brand}>🎓 EduBlog</Text>

                  <View style={styles.topbarRight}>
                    <Pressable
                      style={styles.menuBtn}
                      onPress={() => setShowMenu(!showMenu)}
                    >
                      <Text style={styles.menuBtnText}>
                        {showMenu ? "✕" : "☰"}
                      </Text>
                    </Pressable>
                  </View>

                  {showMenu && (
                    <View style={styles.dropdown}>
                      <Pressable
                        style={styles.dropdownItem}
                        onPress={() => {
                          setShowMenu(false);
                          router.push("/(admin)/admin-menu");
                        }}
                      >
                        <Text style={styles.dropdownItemText}>Menu</Text>
                      </Pressable>

                      <View style={styles.dropdownSeparator} />

                      <Pressable
                        style={styles.dropdownItem}
                        onPress={() => {
                          setShowMenu(false);
                          router.push("/(admin)/posts/create-post");
                        }}
                      >
                        <Text style={styles.dropdownItemText}>Criar post</Text>
                      </Pressable>

                      <Pressable
                        style={styles.dropdownItem}
                        onPress={() => {
                          setShowMenu(false);
                          router.push("/(admin)/posts/posts-painel");
                        }}
                      >
                        <Text style={styles.dropdownItemText}>
                          Gerenciar Posts
                        </Text>
                      </Pressable>

                      <View style={styles.dropdownSeparator} />

                      <Pressable
                        style={styles.dropdownItem}
                        onPress={() => {
                          setShowMenu(false);
                          router.push("/(admin)/teachers/create-teacher");
                        }}
                      >
                        <Text style={styles.dropdownItemText}>
                          Criar Professor
                        </Text>
                      </Pressable>

                      <Pressable
                        style={styles.dropdownItem}
                        onPress={() => {
                          setShowMenu(false);
                          router.push("/(admin)/teachers/teachers-painel");
                        }}
                      >
                        <Text style={styles.dropdownItemText}>
                          Gerenciar Professores
                        </Text>
                      </Pressable>

                      <View style={styles.dropdownSeparator} />

                      <Pressable
                        style={styles.dropdownItem}
                        onPress={() => {
                          setShowMenu(false);
                          router.push("/(admin)/students/create-student");
                        }}
                      >
                        <Text style={styles.dropdownItemText}>
                          Criar Estudante
                        </Text>
                      </Pressable>

                      <Pressable
                        style={styles.dropdownItem}
                        onPress={() => {
                          setShowMenu(false);
                          router.push("/(admin)/students/students-painel");
                        }}
                      >
                        <Text style={styles.dropdownItemText}>
                          Gerenciar Estudantes
                        </Text>
                      </Pressable>

                      <View style={styles.dropdownSeparator} />

              <Pressable
                style={styles.dropdownItem}
                onPress={() => {
                  setShowMenu(false);
                  // exemplo: logout
                }}
              >
                <Text style={styles.dropdownItemTextSair}>Sair</Text>
              </Pressable>
            </View>
          )}
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
            renderItem={({ item, index }) => (
              <Pressable
                style={styles.card}
                onPress={() => router.push(`/post/${item.id}`)}
              >
                <Image source={getPostImage(index)} style={styles.cardCover} />

                <Text numberOfLines={2} style={styles.cardTitle}>
                  {item.title}
                </Text>
                {/* <Text style={styles.cardMeta}>By {item.author}</Text> */}
                <Text numberOfLines={2} style={styles.cardContent}>
                  {item.content}
                </Text>

                <View style={styles.readMoreRow}>
                  <Text style={styles.readMore}>Ler mais →</Text>
                </View>
              </Pressable>
            )}
          />
        )}
      </View>
    </Screen>
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
    zIndex: 10,
  },
  topbarLeft: { width: 40 },
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
  menuBtnText: {
    fontSize: 20,
    color: "#374151",
    fontWeight: "bold",
  },
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
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  dropdownItemText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  dropdownItemTextSair: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ff0000ff",
  },
  dropdownSeparator: {
    height: 1,
    width: "100%",
    backgroundColor: "#E5E7EB",
    marginVertical: 6,
  },

  headerContent: {
    paddingTop: 0,
  },
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
  cardCover: {
    height: 120,
    width: "100%",
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  cardMeta: {
    color: "#6B7280",
    paddingHorizontal: 12,
    paddingTop: 4,
    fontWeight: "600",
  },
  cardContent: {
    color: "#374151",
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 10,
  },
  readMoreRow: { paddingHorizontal: 12, paddingBottom: 12 },
  readMore: { color: "#2563EB", fontWeight: "800" },
});
