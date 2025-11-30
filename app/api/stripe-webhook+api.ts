/**
 * API Route: Stripe Webhook Handler
 * POST /api/stripe-webhook
 */

import { verifyWebhookSignature } from '@/services/stripe';
import { supabase } from '@/services/supabase';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: Request) {
    try {
        const body = await request.text();
        const signature = request.headers.get('stripe-signature');

        if (!signature) {
            return Response.json({ error: 'Missing signature' }, { status: 400 });
        }

        // Verify webhook signature
        let event: Stripe.Event;
        try {
            event = verifyWebhookSignature(body, signature, webhookSecret);
        } catch (error) {
            console.error('Webhook signature verification failed:', error);
            return Response.json({ error: 'Invalid signature' }, { status: 400 });
        }

        // Handle different event types
        switch (event.type) {
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                await handlePaymentSuccess(paymentIntent);
                break;
            }

            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                await handlePaymentFailed(paymentIntent);
                break;
            }

            case 'charge.refunded': {
                const charge = event.data.object as Stripe.Charge;
                await handleRefund(charge);
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return Response.json({ received: true });
    } catch (error) {
        console.error('Error in stripe-webhook:', error);
        return Response.json({ error: 'Webhook error' }, { status: 500 });
    }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    const orderId = paymentIntent.metadata.orderId;

    if (!orderId) {
        console.error('Missing orderId in payment intent metadata');
        return;
    }

    // Update order status to paid
    const { error } = await supabase
        .from('orders')
        .update({
            status: 'paid',
            stripe_payment_intent_id: paymentIntent.id,
        })
        .eq('id', orderId);

    if (error) {
        console.error('Error updating order status:', error);
    } else {
        console.log(`Order ${orderId} marked as paid`);

        // Also update product status to sold
        const { data: order } = await supabase
            .from('orders')
            .select('product_id')
            .eq('id', orderId)
            .single();

        if (order) {
            await supabase
                .from('products')
                .update({ status: 'sold' })
                .eq('id', order.product_id);
        }
    }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    const orderId = paymentIntent.metadata.orderId;

    if (!orderId) {
        console.error('Missing orderId in payment intent metadata');
        return;
    }

    // Update order status to cancelled
    const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId);

    if (error) {
        console.error('Error updating order status:', error);
    } else {
        console.log(`Order ${orderId} marked as cancelled due to payment failure`);
    }
}

async function handleRefund(charge: Stripe.Charge) {
    const paymentIntentId = charge.payment_intent as string;

    if (!paymentIntentId) {
        console.error('Missing payment intent ID in charge');
        return;
    }

    // Find and update order
    const { data: order, error: findError } = await supabase
        .from('orders')
        .select('*')
        .eq('stripe_payment_intent_id', paymentIntentId)
        .single();

    if (findError || !order) {
        console.error('Order not found for refund');
        return;
    }

    // Update order status
    const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', order.id);

    if (error) {
        console.error('Error updating order after refund:', error);
    } else {
        console.log(`Order ${order.id} marked as cancelled due to refund`);

        // Reactivate product
        await supabase
            .from('products')
            .update({ status: 'active' })
            .eq('id', order.product_id);
    }
}
