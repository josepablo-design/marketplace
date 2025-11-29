import { Link } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

type ProductCardProps = {
    product: {
        id: string;
        title: string;
        price: number;
        images: string[];
        condition: string;
    };
};

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <Link href={`/product/${product.id}`} asChild>
            <TouchableOpacity className="flex-1 m-2 bg-white rounded-xl shadow-sm overflow-hidden">
                <View className="h-40 bg-gray-200 w-full">
                    {product.images && product.images.length > 0 ? (
                        <Image source={{ uri: product.images[0] }} className="h-full w-full" resizeMode="cover" />
                    ) : (
                        <View className="flex-1 items-center justify-center">
                            <Text className="text-gray-400 text-4xl">📦</Text>
                        </View>
                    )}
                </View>
                <View className="p-3">
                    <Text className="font-bold text-gray-800 text-base mb-1" numberOfLines={1}>{product.title}</Text>
                    <Text className="text-blue-600 font-bold text-lg">${product.price}</Text>
                    <Text className="text-gray-500 text-xs capitalize mt-1">{product.condition.replace('_', ' ')}</Text>
                </View>
            </TouchableOpacity>
        </Link>
    );
}
