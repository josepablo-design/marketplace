import { useAuth } from '@/services/AuthContext';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
    const { session, loading } = useAuth();

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!session) {
        return <Redirect href="/(auth)/login" />;
    }

    return <Redirect href="/(tabs)" />;
}
