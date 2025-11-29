import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../services/AuthContext';
import { supabase } from '../../services/supabase';

export default function ChatListScreen() {
    const { session } = useAuth();
    const [conversations, setConversations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (session) fetchConversations();
    }, [session]);

    async function fetchConversations() {
        try {
            const { data, error } = await supabase
                .from('conversations')
                .select(`
          *,
          product:products(title, images),
          buyer:profiles!buyer_id(full_name, avatar_url),
          seller:profiles!seller_id(full_name, avatar_url)
        `)
                .or(`buyer_id.eq.${session?.user.id},seller_id.eq.${session?.user.id}`)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setConversations(data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <ActivityIndicator />;

    return (
        <View className="flex-1 bg-gray-50">
            <FlatList
                data={conversations}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 16 }}
                renderItem={({ item }) => {
                    const isBuyer = item.buyer_id === session?.user.id;
                    const otherUser = isBuyer ? item.seller : item.buyer;

                    return (
                        <TouchableOpacity
                            className="bg-white p-4 rounded-xl shadow-sm mb-3 flex-row items-center"
                            onPress={() => router.push(`/chat/${item.id}`)}
                        >
                            <View className="h-14 w-14 bg-gray-200 rounded-full mr-4 overflow-hidden">
                                {otherUser?.avatar_url ? (
                                    <Image source={{ uri: otherUser.avatar_url }} className="h-full w-full" />
                                ) : (
                                    <View className="flex-1 items-center justify-center bg-blue-100">
                                        <Text className="text-blue-600 font-bold text-lg">{otherUser?.full_name?.charAt(0)}</Text>
                                    </View>
                                )}
                            </View>
                            <View className="flex-1">
                                <Text className="font-bold text-gray-800 text-base">{otherUser?.full_name}</Text>
                                <Text className="text-gray-500 text-sm" numberOfLines={1}>
                                    Product: {item.product?.title}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                }}
                ListEmptyComponent={
                    <View className="items-center py-20">
                        <Text className="text-gray-500">No messages yet.</Text>
                    </View>
                }
            />
        </View>
    );
}
