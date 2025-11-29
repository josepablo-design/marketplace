import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../services/AuthContext';
import { supabase } from '../../services/supabase';

export default function OrdersScreen() {
    const { session } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (session) fetchOrders();
    }, [session]);

    async function fetchOrders() {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select(`
          *,
          product:products(title, images),
          buyer:profiles!buyer_id(full_name),
          seller:profiles!seller_id(full_name)
        `)
                .or(`buyer_id.eq.${session?.user.id},seller_id.eq.${session?.user.id}`)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function updateStatus(orderId: string, newStatus: string) {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (error) throw error;
            Alert.alert('Success', `Order marked as ${newStatus}`);
            fetchOrders();
        } catch (error) {
            Alert.alert('Error', 'Could not update order');
        }
    }

    if (loading) return <ActivityIndicator />;

    return (
        <View className="flex-1 bg-gray-50">
            <FlatList
                data={orders}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 16 }}
                renderItem={({ item }) => {
                    const isBuyer = item.buyer_id === session?.user.id;
                    const role = isBuyer ? 'Buyer' : 'Seller';
                    const otherUser = isBuyer ? item.seller : item.buyer;

                    return (
                        <View className="bg-white p-4 rounded-xl shadow-sm mb-3">
                            <View className="flex-row justify-between mb-2">
                                <Text className="font-bold text-gray-800 text-lg">{item.product?.title}</Text>
                                <Text className="font-bold text-blue-600">${item.amount}</Text>
                            </View>

                            <Text className="text-gray-500 mb-2">
                                {role} • {otherUser?.full_name}
                            </Text>

                            <View className="flex-row items-center justify-between mt-2">
                                <View className="bg-gray-100 px-3 py-1 rounded-lg">
                                    <Text className="text-gray-700 font-medium capitalize">{item.status}</Text>
                                </View>

                                {/* Action Buttons based on Status and Role */}
                                {isBuyer && item.status === 'shipped' && (
                                    <TouchableOpacity
                                        onPress={() => updateStatus(item.id, 'completed')}
                                        className="bg-green-600 px-4 py-2 rounded-lg"
                                    >
                                        <Text className="text-white font-bold">Confirm Receipt</Text>
                                    </TouchableOpacity>
                                )}

                                {!isBuyer && item.status === 'paid' && (
                                    <TouchableOpacity
                                        onPress={() => updateStatus(item.id, 'shipped')}
                                        className="bg-blue-600 px-4 py-2 rounded-lg"
                                    >
                                        <Text className="text-white font-bold">Mark Shipped</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    );
                }}
                ListEmptyComponent={
                    <View className="items-center py-20">
                        <Text className="text-gray-500">No active orders.</Text>
                    </View>
                }
            />
        </View>
    );
}
