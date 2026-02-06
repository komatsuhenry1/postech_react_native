import { Screen } from "@/components/Screen";
import { getUserById, LoginResponse, updateUser } from "@/services/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

export default function EditTeacherScreen() {
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
            // Pre-fill password if desired, or leaving it empty implies no change unless user types
            // Based on user request "carregado os dados", we can try to fill what we have, 
            // but usually password is not returned. 
            // However, the user's previous code in edit-student tried to set it.
            setPassword(data.password || "");
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
            Alert.alert("Sucesso", "Dados de professor atualizados com sucesso!");
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
                    <Text style={styles.h1}>Editar Professor</Text>
                </View>
                <Text style={styles.subtitle}>Atualize os dados do professor</Text>
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
    h1: { fontSize: 30, fontWeight: "900", color: "#2563EB", textAlign: "center", paddingLeft: 10 },
    subtitle: { marginTop: 6, color: "#6B7280", marginBottom: 16 },

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
