import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../services/AuthContext';
import { supabase } from '../../services/supabase';

export default function ProductDetails() {
    const { id } = useLocalSearchParams();
    const { session } = useAuth();
    const [product, setProduct] = useState<any>(null);
    const [seller, setSeller] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (id) fetchProductDetails();
    }, [id]);

    async function fetchProductDetails() {
        try {
            const { data: productData, error: productError } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (productError) throw productError;
            setProduct(productData);

            if (productData.seller_id) {
                const { data: sellerData, error: sellerError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', productData.seller_id)
                    .single();

                if (!sellerError) setSeller(sellerData);
            }

        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Could not load product details');
            router.back();
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <View className="flex-1 justify-center items-center"><ActivityIndicator /></View>;
    if (!product) return null;

    return (
        <>
            <Stack.Screen options={{ title: 'Details', headerBackTitle: 'Back' }} />
            <ScrollView className="flex-1 bg-white">
                <View className="h-80 bg-gray-200 w-full">
                    {product.images && product.images.length > 0 ? (
                        <Image source={{ uri: product.images[0] }} className="h-full w-full" resizeMode="cover" />
                    ) : (
                        <View className="flex-1 items-center justify-center">
                            <Text className="text-6xl">📦</Text>
                        </View>
                    )}
                </View>

                <View className="p-6">
                    <View className="flex-row justify-between items-start mb-2">
                        <Text className="text-2xl font-bold text-gray-800 flex-1 mr-2">{product.title}</Text>
                        <Text className="text-2xl font-bold text-blue-600">${product.price}</Text>
                    </View>

                    <View className="flex-row items-center mb-6">
                        <View className="bg-gray-100 px-3 py-1 rounded-full mr-2">
                            <Text className="text-gray-600 capitalize">{product.condition.replace('_', ' ')}</Text>
                        </View>
                        <View className="bg-gray-100 px-3 py-1 rounded-full">
                            <Text className="text-gray-600 capitalize">{product.category || 'General'}</Text>
                        </View>
                    </View>

                    <Text className="text-gray-800 text-lg font-bold mb-2">Description</Text>
                    <Text className="text-gray-600 leading-6 mb-8">{product.description}</Text>

                    <View className="border-t border-gray-100 pt-6">
                        <Text className="text-gray-800 text-lg font-bold mb-4">Seller</Text>
                        <View className="flex-row items-center">
                            <View className="h-12 w-12 bg-gray-300 rounded-full mr-4 items-center justify-center overflow-hidden">
                                {seller?.avatar_url ? (
                                    <Image source={{ uri: seller.avatar_url }} className="h-full w-full" />
                                ) : (
                                    <Text className="text-xl font-bold text-gray-500">{seller?.full_name?.charAt(0) || '?'}</Text>
                                )}
                            </View>
                            <View>
                                <Text className="font-bold text-gray-800 text-base">{seller?.full_name || 'Unknown Seller'}</Text>
                                <Text className="text-gray-500 text-sm">@{seller?.username || 'user'}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View className="p-4 bg-white border-t border-gray-100 safe-area-bottom flex-row gap-3">
                <TouchableOpacity
                    className="flex-1 bg-gray-100 py-4 rounded-xl flex-row justify-center items-center"
                    onPress={async () => {
                        if (!session) return router.push('/(auth)/login');
                        if (session.user.id === product.seller_id) return Alert.alert("It's your product!");

                        // Check if conversation exists or create new
                        const { data, error } = await supabase.from('conversations')
                            .select('id')
                            .eq('product_id', product.id)
                            .eq('buyer_id', session.user.id)
                            .eq('seller_id', product.seller_id)
                            .single();

                        if (data) {
                            router.push(`/chat/${data.id}`);
                        } else {
                            const { data: newConv, error: createError } = await supabase.from('conversations').insert({
                                product_id: product.id,
                                buyer_id: session.user.id,
                                seller_id: product.seller_id
                            }).select().single();

                            if (newConv) router.push(`/chat/${newConv.id}`);
                        }
                    }}
                >
                    <FontAwesome name="comment" size={20} color="#4b5563" style={{ marginRight: 8 }} />
                    <Text className="text-gray-700 font-bold text-lg">Chat</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="flex-1 bg-blue-600 py-4 rounded-xl flex-row justify-center items-center"
                    onPress={async () => {
                        if (!session) return router.push('/(auth)/login');
                        if (session.user.id === product.seller_id) return Alert.alert("It's your product!");

                        Alert.alert(
                            'Confirm Purchase',
                            `Buy ${product.title} for $${product.price}? Funds will be held in escrow until you confirm receipt.`,
                            [
                                { text: 'Cancel', style: 'cancel' },
                                {
                                    text: 'Confirm',
                                    onPress: async () => {
                                        setLoading(true);
                                        const { error } = await supabase.from('orders').insert({
                                            product_id: product.id,
                                            buyer_id: session.user.id,
                                            seller_id: product.seller_id,
                                            amount: product.price,
                                            status: 'paid' // Simulating immediate payment success
                                        });
                                        setLoading(false);

                                        if (error) {
                                            Alert.alert('Error', error.message);
                                        } else {
                                            Alert.alert('Success', 'Order placed! Track it in the Orders tab.');
                                            router.push('/(tabs)/orders');
                                        }
                                    }
                                }
                            ]
                        );
                    }}
                >
                    <FontAwesome name="shopping-cart" size={20} color="white" style={{ marginRight: 8 }} />
                    <Text className="text-white font-bold text-lg">Buy Now</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}
