import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import InventoryList from '../../components/InventoryList';
import { useAuth } from '../../services/AuthContext';
import { supabase } from '../../services/supabase';

export default function ProfileScreen() {
    const { session } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [website, setWebsite] = useState('');
    const [bio, setBio] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [role, setRole] = useState('buyer');

    useEffect(() => {
        if (session) {
            getProfile();
        } else {
            setLoading(false);
        }
    }, [session]);

    async function getProfile() {
        try {
            setLoading(true);
            if (!session?.user) throw new Error('No user on the session!');

            const { data, error, status } = await supabase
                .from('profiles')
                .select(`username, website, avatar_url, full_name, bio, role`)
                .eq('id', session?.user.id)
                .single();

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setUsername(data.username);
                setWebsite(data.website);
                setAvatarUrl(data.avatar_url);
                setFullName(data.full_name);
                setBio(data.bio);
                setRole(data.role || 'buyer');
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message);
            }
        } finally {
            setLoading(false);
        }
    }

    async function updateProfile() {
        try {
            setLoading(true);
            if (!session?.user) throw new Error('No user on the session!');

            const updates = {
                id: session?.user.id,
                username,
                website,
                full_name: fullName,
                bio,
                role,
                updated_at: new Date(),
            };

            const { error } = await supabase.from('profiles').upsert(updates);

            if (error) {
                throw error;
            }
            Alert.alert('Profile updated!');
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message);
            }
        } finally {
            setLoading(false);
        }
    }

    // Show guest screen if not logged in
    if (!session && !loading) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50 px-4">
                <View className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg items-center">
                    <Text className="text-3xl font-bold text-center mb-2 text-gray-800">Mi Perfil</Text>
                    <Text className="text-gray-600 text-center mb-6">
                        Inicia sesión para gestionar tu perfil y crear publicaciones
                    </Text>

                    <TouchableOpacity
                        className="w-full py-4 rounded-xl bg-blue-600 mb-3"
                        onPress={() => router.push('/(auth)/login')}
                    >
                        <Text className="text-white text-center font-bold text-lg">Iniciar Sesión</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="w-full py-4 rounded-xl border-2 border-blue-600"
                        onPress={() => router.push('/(auth)/register')}
                    >
                        <Text className="text-blue-600 text-center font-bold text-lg">Crear Cuenta</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-gray-50 p-4">
            <View className="items-center mb-6">
                <View className="h-24 w-24 rounded-full bg-gray-300 items-center justify-center mb-2 overflow-hidden">
                    {avatarUrl ? (
                        <Image source={{ uri: avatarUrl }} className="h-full w-full" />
                    ) : (
                        <Text className="text-2xl text-gray-500">{fullName?.charAt(0) || '?'}</Text>
                    )}
                </View>
                <Text className="text-xl font-bold text-gray-800">{session?.user.email}</Text>
                <View className="flex-row mt-2">
                    <TouchableOpacity
                        onPress={() => setRole('buyer')}
                        className={`px-4 py-1 rounded-l-lg border border-blue-600 ${role === 'buyer' ? 'bg-blue-600' : 'bg-transparent'}`}
                    >
                        <Text className={`${role === 'buyer' ? 'text-white' : 'text-blue-600'} font-medium`}>Buyer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setRole('seller')}
                        className={`px-4 py-1 rounded-r-lg border border-blue-600 ${role === 'seller' ? 'bg-blue-600' : 'bg-transparent'}`}
                    >
                        <Text className={`${role === 'seller' ? 'text-white' : 'text-blue-600'} font-medium`}>Seller</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                <View>
                    <Text className="text-gray-600 mb-1 font-medium">Full Name</Text>
                    <TextInput
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50"
                        value={fullName}
                        onChangeText={setFullName}
                        placeholder="John Doe"
                    />
                </View>

                <View>
                    <Text className="text-gray-600 mb-1 font-medium">Username</Text>
                    <TextInput
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50"
                        value={username}
                        onChangeText={setUsername}
                        placeholder="johndoe"
                    />
                </View>

                <View>
                    <Text className="text-gray-600 mb-1 font-medium">Bio</Text>
                    <TextInput
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 h-24"
                        value={bio}
                        onChangeText={setBio}
                        placeholder="Tell us about yourself..."
                        multiline
                        textAlignVertical="top"
                    />
                </View>

                <View>
                    <Text className="text-gray-600 mb-1 font-medium">Website</Text>
                    <TextInput
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50"
                        value={website}
                        onChangeText={setWebsite}
                        placeholder="https://example.com"
                        autoCapitalize="none"
                    />
                </View>

                <TouchableOpacity
                    className="w-full py-4 rounded-xl bg-blue-600 mt-4"
                    onPress={updateProfile}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text className="text-white text-center font-bold text-lg">Update Profile</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    className="w-full py-4 rounded-xl border border-red-500 mt-2"
                    onPress={() => supabase.auth.signOut()}
                >
                    <Text className="text-red-500 text-center font-bold text-lg">Sign Out</Text>
                </TouchableOpacity>
            </View>

            {role === 'seller' && (
                <View className="mt-6 mb-10">
                    <InventoryList />
                </View>
            )}
        </ScrollView>
    );
}
