import { Screen } from "@/components/Screen";
import { deleteUser, getUsersByRole, LoginResponse } from "@/services/api";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function TeachersPainelScreen() {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<LoginResponse[]>([]);
    const [query, setQuery] = useState("");

    const load = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getUsersByRole("admin");
            setUsers(data);
        } catch (error: any) {
            Alert.alert("Erro", error.message || "Falha ao carregar professores");
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            load();
        }, [load])
    );

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return users;
        return users.filter(
            (u) =>
                u.name.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q) ||
                u.username.toLowerCase().includes(q)
        );
    }, [users, query]);

    async function handleDelete(id: string) {
        Alert.alert("Confirmar", "Tem certeza que deseja excluir este professor?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Excluir",
                style: "destructive",
                onPress: async () => {
                    try {
                        setLoading(true);
                        await deleteUser(id);
                        Alert.alert("Sucesso", "Professor excluído.");
                        load();
                    } catch (e: any) {
                        Alert.alert("Erro", e.message);
                        setLoading(false);
                    }
                },
            },
        ]);
    }

    function handleEdit(id: string) {
        router.push(`/(admin)/teachers/edit-teacher/${id}`);
    }

    return (
        <Screen>
            <View style={styles.page}>
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backBtn}>
                        <Text style={styles.backText}>← Voltar</Text>
                    </Pressable>
                    <Text style={styles.h1}>Gerenciar Professores</Text>
                </View>

                <View style={styles.searchBox}>
                    <Text style={styles.searchIcon}>🔎</Text>
                    <TextInput
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Pesquisar por nome ou email..."
                        style={styles.searchInput}
                    />
                </View>

                {loading ? (
                    <View style={styles.center}>
                        <ActivityIndicator />
                    </View>
                ) : (
                    <FlatList
                        data={filtered}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        ListEmptyComponent={<Text style={styles.empty}>Nenhum professor encontrado.</Text>}
                        renderItem={({ item }) => (
                            <View style={styles.card}>
                                <View style={styles.cardInfo}>
                                    <Text style={styles.cardTitle}>{item.name}</Text>
                                    <Text style={styles.cardMeta}>{item.email}</Text>
                                    <Text style={styles.cardMeta}>@{item.username}</Text>
                                </View>

                                <View style={styles.actions}>
                                    <Pressable onPress={() => handleEdit(item.id)} style={styles.editBtn}>
                                        <Text style={styles.btnText}>✏️</Text>
                                    </Pressable>
                                    <Pressable onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
                                        <Text style={styles.btnText}>🗑️</Text>
                                    </Pressable>
                                </View>
                            </View>
                        )}
                    />
                )}
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    page: { flex: 1, backgroundColor: "#fff", padding: 18 },
    header: { flexDirection: "row", alignItems: "center", marginBottom: 18, gap: 12 },
    backBtn: { backgroundColor: "#F3F4F6", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
    backText: { fontWeight: "bold", color: "#333" },
    h1: { fontSize: 24, fontWeight: "900", color: "#111827" },

    searchBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F3F4F6",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 16,
    },
    searchIcon: { marginRight: 8 },
    searchInput: { flex: 1, fontSize: 14 },

    center: { flex: 1, alignItems: "center", justifyContent: "center" },
    empty: { textAlign: "center", marginTop: 20, color: "#666" },

    card: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
    },
    cardInfo: { flex: 1 },
    cardTitle: { fontSize: 16, fontWeight: "800", color: "#111827" },
    cardMeta: { fontSize: 13, color: "#6B7280", marginTop: 2 },

    actions: { flexDirection: "row", gap: 10 },
    editBtn: { backgroundColor: "#EFF6FF", padding: 8, borderRadius: 8 },
    deleteBtn: { backgroundColor: "#FEF2F2", padding: 8, borderRadius: 8 },
    btnText: { fontSize: 16 },
});