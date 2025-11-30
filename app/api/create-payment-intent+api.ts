/**
 * API Route: Create Payment Intent
 * POST /api/create-payment-intent
 */

import { calculateCommission } from '@/services/commission';
import { amountToCents, createPaymentIntent } from '@/services/stripe';
import { supabase } from '@/services/supabase';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { productId, buyerId } = body;

        if (!productId || !buyerId) {
            return Response.json(
                { error: 'Missing required fields: productId, buyerId' },
                { status: 400 }
            );
        }

        // Fetch product details
        const { data: product, error: productError } = await supabase
            .from('products')
            .select('*, seller:profiles!seller_id(*)')
            .eq('id', productId)
            .single();

        if (productError || !product) {
            return Response.json({ error: 'Product not found' }, { status: 404 });
        }

        // Calculate commission
        const commission = calculateCommission(
            product.price,
            product.seller.seller_type
        );

        // Create order in database
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                product_id: productId,
                buyer_id: buyerId,
                seller_id: product.seller_id,
                amount: product.price,
                commission_rate: commission.commissionRate,
                commission_amount: commission.commissionAmount,
                platform_fee: commission.platformFee,
                seller_payout: commission.sellerPayout,
                status: 'pending',
            })
            .select()
            .single();

        if (orderError || !order) {
            return Response.json(
                { error: 'Failed to create order' },
                { status: 500 }
            );
        }

        // Create Stripe payment intent
        const paymentIntent = await createPaymentIntent({
            amount: amountToCents(product.price),
            currency: product.currency || 'ARS',
            orderId: order.id,
            buyerId,
            sellerId: product.seller_id,
            productId,
            metadata: {
                productTitle: product.title,
                commissionAmount: commission.commissionAmount.toString(),
            },
        });

        // Update order with payment intent ID
        await supabase
            .from('orders')
            .update({ stripe_payment_intent_id: paymentIntent.paymentIntentId })
            .eq('id', order.id);

        return Response.json({
            clientSecret: paymentIntent.clientSecret,
            orderId: order.id,
            amount: product.price,
            commissionAmount: commission.commissionAmount,
            sellerPayout: commission.sellerPayout,
        });
    } catch (error) {
        console.error('Error in create-payment-intent:', error);
        return Response.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
