import { login } from "@/services/api";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Screen } from "@/components/Screen";


export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const storage = AsyncStorage;

    async function handleLogin() {
        if (!email || !password) {
            Alert.alert("Erro", "Preencha email e senha");
            return;
        }

        try {
            setLoading(true);

            const { data: user, statusCode, role } = await login(email, password);

            if (statusCode === 200) {
                console.log("role: ", role);

                if (role === "user"){
                    await storage.setItem("role", JSON.stringify(role));
                    router.push("/(user)");
                    //printa as chaves (n da pra ver no devtools)
                    const keys = await AsyncStorage.getAllKeys();
                    const items = await AsyncStorage.multiGet(keys);
                    console.log(items);
                } else if (role === "admin"){
                    await storage.setItem("role", JSON.stringify(role));
                    router.push("/(admin)/admin-menu"); 
                }
            } else {
                Alert.alert("Erro", "Email ou senha inválidos");
            }
        } catch (error) {
            Alert.alert("Erro", "Email ou senha inválidos");
        } finally {
            setLoading(false);
        }
    }



    return (
        <Screen>
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
                <TouchableOpacity onPress={handleLogin} style={styles.buttonPrimary} disabled={loading}>
                    <Text style={styles.buttonTextPrimary}>{loading ? "Acessando..." : "Entrar"}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.back()} style={styles.linkButton}>
                    <Text style={styles.linkText}>Voltar ao menu</Text>
                </TouchableOpacity>
            </View>
        </View>
        </Screen>
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