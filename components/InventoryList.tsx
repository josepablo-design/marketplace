import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../services/AuthContext';
import { supabase } from '../services/supabase';

export default function InventoryList() {
    const { session } = useAuth();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (session) fetchInventory();
    }, [session]);

    async function fetchInventory() {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('seller_id', session?.user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <ActivityIndicator />;

    return (
        <View className="flex-1">
            <View className="flex-row justify-between items-center mb-4 px-4">
                <Text className="text-xl font-bold text-gray-800">My Inventory</Text>
                <TouchableOpacity
                    onPress={() => router.push('/add-product')}
                    className="bg-blue-600 px-4 py-2 rounded-lg"
                >
                    <Text className="text-white font-bold">+ Add New</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
                renderItem={({ item }) => (
                    <View className="bg-white p-4 rounded-xl shadow-sm mb-3 flex-row items-center">
                        <View className="h-16 w-16 bg-gray-200 rounded-lg mr-4" />
                        <View className="flex-1">
                            <Text className="font-bold text-gray-800 text-lg">{item.title}</Text>
                            <Text className="text-blue-600 font-bold">${item.price}</Text>
                            <Text className="text-gray-500 text-xs capitalize">{item.status}</Text>
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    <View className="items-center py-10">
                        <Text className="text-gray-500">You haven't listed any items yet.</Text>
                    </View>
                }
            />
        </View>
    );
}
