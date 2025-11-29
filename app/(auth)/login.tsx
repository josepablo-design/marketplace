import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../services/supabase';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function signInWithEmail() {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            Alert.alert(error.message);
            setLoading(false);
        } else {
            // Auth state change will handle navigation via AuthContext/Layout logic if implemented, 
            // or we can manually navigate.
            router.replace('/(tabs)');
        }
    }

    return (
        <View className="flex-1 justify-center items-center bg-gray-50 px-4">
            <View className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg">
                <Text className="text-3xl font-bold text-center mb-6 text-gray-800">Welcome Back</Text>

                <View className="mb-4">
                    <Text className="text-gray-600 mb-2 font-medium">Email</Text>
                    <TextInput
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                        placeholder="email@address.com"
                        autoCapitalize="none"
                    />
                </View>

                <View className="mb-6">
                    <Text className="text-gray-600 mb-2 font-medium">Password</Text>
                    <TextInput
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                        secureTextEntry={true}
                        placeholder="Password"
                        autoCapitalize="none"
                    />
                </View>

                <TouchableOpacity
                    className={`w-full py-4 rounded-xl bg-blue-600 ${loading ? 'opacity-70' : ''}`}
                    onPress={signInWithEmail}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text className="text-white text-center font-bold text-lg">Sign In</Text>
                    )}
                </TouchableOpacity>

                <View className="mt-6 flex-row justify-center">
                    <Text className="text-gray-600">Don't have an account? </Text>
                    <Link href="/register" asChild>
                        <TouchableOpacity>
                            <Text className="text-blue-600 font-bold">Sign Up</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </View>
    );
}
