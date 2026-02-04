import { Button, Text, View } from "react-native";
import { useRouter } from "expo-router";


export default function Posts() {
    const router = useRouter();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title="Back" onPress={() => router.back()} />
            <Text> ADMIN POSTS CRUD PAGE</Text>
        </View>
    );
}