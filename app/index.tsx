import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/Screen";

export default function Index() {
  const router = useRouter();

  return (
    <Screen>
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>EduBlog</Text>
        <Text style={styles.subtitle}>Bem-vindo ao seu caminho de aprendizado</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.buttonTextPrimary}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => router.push("/register")}
        >
          <Text style={styles.buttonTextSecondary}>Cadastrar</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    marginBottom: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#0066CC',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  buttonPrimary: {
    backgroundColor: '#0066CC',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#0066CC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonTextPrimary: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonSecondary: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0066CC',
  },
  buttonTextSecondary: {
    color: '#0066CC',
    fontSize: 18,
    fontWeight: '600',
  },
});
