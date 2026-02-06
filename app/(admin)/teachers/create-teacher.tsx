import { Screen } from "@/components/Screen";
import { register } from "@/services/api";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function CreateTeacherScreen() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleCreateTeacher() {
        if (!name.trim() || !email.trim() || !username.trim() || !password.trim()) {
            Alert.alert("Erro", "Preencha todos os campos.");
            return;
        }

        try {
            setLoading(true);
            await register(name.trim(), email.trim(), username.trim(), password.trim(), "admin");
            Alert.alert("Sucesso", "Professor cadastrado com sucesso!");
            router.back();
        } catch (e: any) {
            Alert.alert("Erro", e.message || "Falha ao cadastrar professor");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Screen>
            <ScrollView contentContainerStyle={styles.page}>
                <Text style={styles.h1}>Cadastrar Professor</Text>
                <Text style={styles.subtitle}>Crie uma nova conta de administrador/professor</Text>

                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <Text style={styles.backText}>← Voltar</Text>
                </Pressable>

                <View style={styles.form}>
                    <Text style={styles.label}>Name</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="Nome completo"
                        style={styles.input}
                        autoCapitalize="words"
                    />

                    <Text style={[styles.label, { marginTop: 16 }]}>Email</Text>
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="email@exemplo.com"
                        style={styles.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Text style={[styles.label, { marginTop: 16 }]}>Username</Text>
                    <TextInput
                        value={username}
                        onChangeText={setUsername}
                        placeholder="Nome de usuário"
                        style={styles.input}
                        autoCapitalize="none"
                    />

                    <Text style={[styles.label, { marginTop: 16 }]}>Password</Text>
                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Senha"
                        style={styles.input}
                        secureTextEntry
                    />

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleCreateTeacher}
                        disabled={loading}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.buttonText}>{loading ? "Salvando..." : "Cadastrar"}</Text>
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
        color: "#2E74FF",
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
        marginTop: 20,
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
    button: {
        marginTop: 24,
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
    backBtn: { backgroundColor: "#F3F4F6", paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10, alignSelf: "flex-start" },
});