import { Text, View, TextInput, TouchableOpacity, StyleSheet, Alert, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { login } from "@/services/api";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        if (!email || !password) {
            Alert.alert("Erro", "Preencha email e senha");
            return;
        }

        try {
            setLoading(true);

            const user = await login(email, password);

            console.log("Login OK:", user);

            // depois:
            // redirect por role
        } catch (error) {
            Alert.alert("Erro", "Email ou senha inválidos");
        } finally {
            setLoading(false);
        }
    }



    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Login</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Insira seu email"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Text style={styles.label}>Senha</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Insira sua senha"
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            <View style={styles.buttonContainer}>
                <Pressable onPress={handleLogin}>
                    <Text>Entrar</Text>
                </Pressable>

                <TouchableOpacity onPress={() => router.back()} style={styles.linkButton}>
                    <Text style={styles.linkText}>Voltar ao menu</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 20,
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#0066CC',
        marginBottom: 40,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 30,
    },
    label: {
        fontSize: 16,
        color: '#333333',
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 15,
        marginBottom: 20,
        fontSize: 16,
    },
    buttonContainer: {
        gap: 15,
    },
    buttonPrimary: {
        backgroundColor: '#0066CC',
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        shadowColor: '#0066CC',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    buttonTextPrimary: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    linkButton: {
        alignItems: 'center',
        marginTop: 10,
    },
    linkText: {
        color: '#666666',
        fontSize: 16,
    },
});