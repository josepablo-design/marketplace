import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../services/AuthContext';
import { supabase } from '../services/supabase';

export default function AddProductScreen() {
    const { session } = useAuth();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [condition, setCondition] = useState('new');
    const [category, setCategory] = useState('');

    async function createProduct() {
        if (!title || !price || !session?.user) {
            Alert.alert('Error', 'Please fill in all required fields.');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.from('products').insert({
                seller_id: session.user.id,
                title,
                description,
                price: parseFloat(price),
                condition,
                category,
                images: [] // TODO: Implement image upload
            });

            if (error) throw error;

            Alert.alert('Success', 'Product listed successfully!');
            router.back();
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert('Error', error.message);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <ScrollView className="flex-1 bg-gray-50 p-4">
            <Text className="text-2xl font-bold text-gray-800 mb-6">List a New Item</Text>

            <View className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                <View>
                    <Text className="text-gray-600 mb-1 font-medium">Title *</Text>
                    <TextInput
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50"
                        value={title}
                        onChangeText={setTitle}
                        placeholder="What are you selling?"
                    />
                </View>

                <View>
                    <Text className="text-gray-600 mb-1 font-medium">Price *</Text>
                    <TextInput
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50"
                        value={price}
                        onChangeText={setPrice}
                        placeholder="0.00"
                        keyboardType="numeric"
                    />
                </View>

                <View>
                    <Text className="text-gray-600 mb-1 font-medium">Category</Text>
                    <TextInput
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50"
                        value={category}
                        onChangeText={setCategory}
                        placeholder="Electronics, Clothing, etc."
                    />
                </View>

                <View>
                    <Text className="text-gray-600 mb-1 font-medium">Condition</Text>
                    <View className="flex-row flex-wrap gap-2">
                        {['new', 'like_new', 'good', 'fair'].map((c) => (
                            <TouchableOpacity
                                key={c}
                                onPress={() => setCondition(c)}
                                className={`px-4 py-2 rounded-lg border ${condition === c ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}
                            >
                                <Text className={`${condition === c ? 'text-white' : 'text-gray-600'} capitalize`}>
                                    {c.replace('_', ' ')}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View>
                    <Text className="text-gray-600 mb-1 font-medium">Description</Text>
                    <TextInput
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 h-32"
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Describe your item..."
                        multiline
                        textAlignVertical="top"
                    />
                </View>

                <TouchableOpacity
                    className={`w-full py-4 rounded-xl bg-blue-600 mt-4 ${loading ? 'opacity-70' : ''}`}
                    onPress={createProduct}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text className="text-white text-center font-bold text-lg">List Item</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
