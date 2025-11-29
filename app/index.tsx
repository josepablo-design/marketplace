import { Redirect } from 'expo-router';

export default function Index() {
    // Redirect everyone to tabs - no auth required to browse
    return <Redirect href="/(tabs)" />;
}
