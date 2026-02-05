import { Screen } from "@/components/Screen";
import { Button } from "@react-navigation/elements";
import { Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function CreateTeacherScreen() {
    const router = useRouter();
    return (
        <Screen>
            <Button onPress={() => {router.back()}}> Voltar</Button>
            <Text>Crear Professor</Text>
        </Screen>
    );
}