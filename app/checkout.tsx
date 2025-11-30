import { calculateCommission } from '@/services/commission';
import { supabase } from '@/services/supabase';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function CheckoutScreen() {
    const params = useLocalSearchParams();
    const { productId } = params;

    const [product, setProduct] = React.useState<any>(null);
    const [commission, setCommission] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);
    const [processing, setProcessing] = React.useState(false);

    React.useEffect(() => {
        loadProduct();
    }, [productId]);

    async function loadProduct() {
        try {
            const { data, error } = await supabase
                .from('products')
                .select(`
          *,
          seller:profiles!seller_id(*)
        `)
                .eq('id', productId)
                .single();

            if (error) throw error;

            setProduct(data);

            // Calculate commission
            const calc = calculateCommission(data.price, data.seller.seller_type);
            setCommission(calc);
        } catch (error) {
            console.error('Error loading product:', error);
            Alert.alert('Error', 'No se pudo cargar el producto');
        } finally {
            setLoading(false);
        }
    }

    async function handleCheckout() {
        setProcessing(true);

        try {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                Alert.alert('Error', 'Debes iniciar sesión para comprar');
                router.push('/(auth)/sign-in');
                return;
            }

            // Create payment intent
            const response = await fetch('http://localhost:8081/api/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: productId,
                    buyerId: user.id,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert(
                    'Demo de Pago',
                    `En producción, aquí se mostraría el formulario de Stripe.\n\n` +
                    `Monto total: $${data.amount}\n` +
                    `Comisión plataforma: $${data.commissionAmount}\n` +
                    `Pago al vendedor: $${data.sellerPayout}\n\n` +
                    `Order ID: ${data.orderId}\n\n` +
                    `Usa la tarjeta de prueba: 4242 4242 4242 4242`,
                    [
                        {
                            text: 'Simular Pago Exitoso',
                            onPress: () => simulatePaymentSuccess(data.orderId),
                        },
                        {
                            text: 'Cancelar',
                            style: 'cancel',
                        },
                    ]
                );
            } else {
                Alert.alert('Error', data.error || 'No se pudo crear el pago');
            }
        } catch (error) {
            console.error('Error creating payment:', error);
            Alert.alert('Error', 'Hubo un problema al procesar el pago');
        } finally {
            setProcessing(false);
        }
    }

    async function simulatePaymentSuccess(orderId: string) {
        // In production, this would be handled by Stripe webhooks
        // For demo purposes, we'll manually update the order
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: 'paid' })
                .eq('id', orderId);

            if (error) throw error;

            // Update product status
            await supabase
                .from('products')
                .update({ status: 'sold' })
                .eq('id', productId);

            Alert.alert(
                '¡Compra Exitosa!',
                'El pago se procesó correctamente. En producción, recibirías un email de confirmación.',
                [
                    {
                        text: 'Ver Mis Compras',
                        onPress: () => router.push('/(tabs)/profile'),
                    },
                ]
            );
        } catch (error) {
            console.error('Error simulating payment:', error);
            Alert.alert('Error', 'No se pudo completar la simulación');
        }
    }

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <Text className="text-lg">Cargando...</Text>
            </View>
        );
    }

    if (!product || !commission) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <Text className="text-lg">Producto no encontrado</Text>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <View className="p-6">
                <Text className="text-2xl font-bold mb-6">Confirmar Compra</Text>

                {/* Product Summary */}
                <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                    <Text className="text-lg font-semibold mb-2">{product.title}</Text>
                    <Text className="text-gray-600 mb-2">
                        Vendedor: {product.seller.full_name}
                    </Text>
                    <Text className="text-gray-600">
                        Tipo: {product.seller.seller_type}
                    </Text>
                </View>

                {/* Price Breakdown */}
                <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                    <Text className="text-lg font-semibold mb-3">Desglose de Precio</Text>

                    <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-600">Precio del producto</Text>
                        <Text className="font-medium">
                            ${product.price.toLocaleString()} {product.currency}
                        </Text>
                    </View>

                    <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-600">
                            Comisión plataforma (10%)
                        </Text>
                        <Text className="font-medium">
                            ${commission.commissionAmount.toLocaleString()} {product.currency}
                        </Text>
                    </View>

                    <View className="border-t border-gray-200 mt-2 pt-2">
                        <View className="flex-row justify-between">
                            <Text className="text-lg font-bold">Total</Text>
                            <Text className="text-lg font-bold">
                                ${product.price.toLocaleString()} {product.currency}
                            </Text>
                        </View>
                    </View>

                    <View className="mt-3 bg-blue-50 p-3 rounded">
                        <Text className="text-sm text-gray-600">
                            El vendedor recibirá: ${commission.sellerPayout.toLocaleString()} {product.currency}
                        </Text>
                    </View>
                </View>

                {/* Payment Info */}
                <View className="bg-yellow-50 rounded-lg p-4 mb-4 border border-yellow-200">
                    <Text className="font-semibold mb-2">🧪 Modo de Prueba</Text>
                    <Text className="text-sm text-gray-700">
                        Esta es una demostración. En producción, aquí aparecería el formulario
                        de pago de Stripe.
                    </Text>
                    <Text className="text-sm text-gray-700 mt-2">
                        Tarjeta de prueba: 4242 4242 4242 4242
                    </Text>
                </View>

                {/* Checkout Button */}
                <TouchableOpacity
                    onPress={handleCheckout}
                    disabled={processing}
                    className={`rounded-lg p-4 ${processing ? 'bg-gray-400' : 'bg-blue-600'
                        }`}
                >
                    <Text className="text-white text-center font-semibold text-lg">
                        {processing ? 'Procesando...' : 'Proceder al Pago'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.back()}
                    className="mt-4 p-4"
                >
                    <Text className="text-center text-gray-600">Cancelar</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
