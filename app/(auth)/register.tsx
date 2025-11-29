import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../services/supabase';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function signUpWithEmail() {
        // Validation
        if (!email || !password) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
            return;
        }

        console.log('Iniciando registro con:', email);
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            console.log('Respuesta de Supabase:', { data, error });

            if (error) {
                console.error('Error de registro:', error);
                Alert.alert('Error', error.message);
                setLoading(false);
                return;
            }

            // Verificar si se creó la sesión
            if (!data.session) {
                console.log('Sin sesión - verificación de email requerida');
                Alert.alert(
                    'Registro Exitoso',
                    'Por favor revisa tu correo electrónico para verificar tu cuenta.',
                    [{ text: 'OK', onPress: () => router.replace('/login') }]
                );
            } else {
                console.log('Registro exitoso con sesión:', data.session.user.email);
                Alert.alert(
                    'Registro Exitoso',
                    '¡Bienvenido!',
                    [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
                );
            }
        } catch (error) {
            console.error('Error inesperado:', error);
            Alert.alert('Error', 'Ocurrió un error inesperado. Por favor intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <View className="flex-1 justify-center items-center bg-gray-50 px-4">
            <View className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg">
                <Text className="text-3xl font-bold text-center mb-6 text-gray-800">Create Account</Text>

                <View className="mb-4">
                    <Text className="text-gray-600 mb-2 font-medium">Email</Text>
                    <TextInput
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                        placeholder="email@address.com"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        autoComplete="email"
                    />
                </View>

                <View className="mb-6">
                    <Text className="text-gray-600 mb-2 font-medium">Password (mínimo 6 caracteres)</Text>
                    <TextInput
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                        secureTextEntry={true}
                        placeholder="Contraseña"
                        autoCapitalize="none"
                        autoComplete="password"
                    />
                </View>

                <TouchableOpacity
                    className={`w-full py-4 rounded-xl bg-blue-600 ${loading ? 'opacity-70' : ''}`}
                    onPress={signUpWithEmail}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text className="text-white text-center font-bold text-lg">Sign Up</Text>
                    )}
                </TouchableOpacity>

                <View className="mt-6 flex-row justify-center">
                    <Text className="text-gray-600">Already have an account? </Text>
                    <Link href="/login" asChild>
                        <TouchableOpacity>
                            <Text className="text-blue-600 font-bold">Sign In</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </View>
    );
}
