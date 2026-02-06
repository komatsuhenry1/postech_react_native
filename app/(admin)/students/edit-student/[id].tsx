import { Screen } from "@/components/Screen";
import { getUserById, LoginResponse, updateUser } from "@/services/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

export default function EditStudentScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState<LoginResponse | null>(null);

    useEffect(() => {
        load();
    }, [id]);

    async function load() {
        try {
            setLoading(true);
            const data = await getUserById(String(id));
            setUser(data);
            setName(data.name);
            setEmail(data.email);
            setUsername(data.username);
            // Password is usually not sent back from server, so we leave it empty or handle as needed. 
            // If the user does not want to change it, they might leave it blank, but the current API 
            // seems to require all fields in the update. 
            // For now, we initialize it empty, but if the API expects the *current* password if unchanged, 
            // this might be an issue. However, usually update endpoints treat empty password as "no change" 
            // OR we need to ask the user to enter a new password.
            // Based on the 'edit-teacher' logic provided by the user, we send whatever is in 'password'.
            // If 'password' is required by the backend to be non-empty, we might have a problem if we don't know it.
            // But let's follow the 'edit-teacher' pattern. Ideally, the backend should handle optional password updates.
            // The user's snippet for edit-teacher sends `password.trim()`. 
            // We will do the same. If the user wants to keep the old password, they might need to re-enter it 
            // or the backend handles empty strings.
            setPassword(data.password || ""); // If backend sends it (unlikely/insecure)
        } catch (e: any) {
            Alert.alert("Erro", e.message || "Falha ao carregar usuário");
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        if (!name.trim()) {
            Alert.alert("Erro", "Preencha o nome.");
            return;
        }

        try {
            setLoading(true);
            console.log(name.trim(), email.trim(), username.trim(), password.trim());
            await updateUser(String(id), name.trim(), email.trim(), username.trim(), password.trim());
            Alert.alert("Sucesso", "Dados de estudante atualizados com sucesso!");
            router.back();
        } catch (e: any) {
            Alert.alert("Erro", e?.message ?? "Não foi possível salvar.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Screen>
            <ScrollView contentContainerStyle={styles.page}>
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backBtn}>
                        <Text style={styles.backText}>← Voltar</Text>
                    </Pressable>
                    <Text style={styles.h1}>Editar Estudante</Text>
                </View>
                <Text style={styles.subtitle}>Atualize os dados do estudante</Text>

                {loading ? (
                    <ActivityIndicator style={{ marginTop: 40 }} />
                ) : (
                    <View style={styles.grid}>
                        <View style={styles.left}>
                            <Text style={styles.label}>Novo Nome</Text>
                            <TextInput
                                value={name}
                                onChangeText={setName}
                                placeholder="Digite o novo nome"
                                style={styles.input}
                                autoCapitalize="words"
                            />
                            <Text style={styles.label}>Novo Email</Text>
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder="Digite o novo email"
                                style={styles.input}
                                autoCapitalize="none"
                            />
                            <Text style={styles.label}>Novo Username</Text>
                            <TextInput
                                value={username}
                                onChangeText={setUsername}
                                placeholder="Digite o novo username"
                                style={styles.input}
                                autoCapitalize="none"
                            />
                            <Text style={styles.label}>Novo Password</Text>
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Digite a nova senha"
                                style={styles.input}
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.right}>
                            <View style={styles.card}>
                                <Text style={styles.cardTitle}>Ações</Text>

                                <Pressable
                                    style={[styles.primaryBtn, loading && styles.btnDisabled]}
                                    onPress={handleSave}
                                    disabled={loading}
                                >
                                    <Text style={styles.primaryBtnText}>
                                        {loading ? "Salvando..." : "💾 Salvar alterações"}
                                    </Text>
                                </Pressable>

                                <Pressable style={styles.secondaryBtn} onPress={() => router.back()}>
                                    <Text style={styles.secondaryBtnText}>✕ Cancelar</Text>
                                </Pressable>
                            </View>

                            <View style={styles.card}>
                                <Text style={styles.cardTitle}>Informações</Text>
                                <Text style={styles.infoText}>ID: {id}</Text>
                                <Text style={styles.infoText}>Email: {user?.email}</Text>
                                <Text style={styles.infoText}>Username: {user?.username}</Text>
                                <Text style={styles.infoText}>Role: {user?.role}</Text>
                                <Text style={styles.infoNote}>
                                    Apenas o nome pode ser alterado por enquanto.
                                </Text>
                            </View>
                        </View>
                    </View>
                )}
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    page: { padding: 18, backgroundColor: "#fff", flexGrow: 1 },
    h1: { fontSize: 34, fontWeight: "900", color: "#2563EB" },
    subtitle: { marginTop: 6, color: "#6B7280", marginBottom: 16 },

    backBtn: { backgroundColor: "#F3F4F6", paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10 },
    backText: { fontWeight: "bold", color: "#333" },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 14,
        marginVertical: 10,
        marginHorizontal: 10,
    },

    grid: { gap: 14 },
    left: {},
    right: { gap: 14 },

    label: {
        marginTop: 10,
        marginBottom: 10,
        fontSize: 14,
        fontWeight: "800",
        color: "#111827",
    },
    input: {
        borderWidth: 1,
        borderColor: "#60A5FA",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        backgroundColor: "#fff",
    },

    card: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 14,
        padding: 14,
        backgroundColor: "#fff",
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "900",
        color: "#111827",
        marginBottom: 10,
    },

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

    infoText: { color: "#374151", fontSize: 13, marginBottom: 4 },
    infoNote: { color: "#6B7280", fontSize: 12, fontStyle: "italic" },
});
