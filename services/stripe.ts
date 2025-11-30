/**
 * Stripe payment service for marketplace
 * Handles payment intents, checkout, and webhooks
 */

import Stripe from 'stripe';

// Initialize Stripe with test mode secret key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY_TEST || '';

if (!stripeSecretKey) {
    console.warn('Warning: STRIPE_SECRET_KEY_TEST not set in environment variables');
}

export const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2024-12-18.acacia',
    typescript: true,
});

export interface CreatePaymentIntentParams {
    amount: number; // in cents
    currency: string;
    orderId: string;
    buyerId: string;
    sellerId: string;
    productId: string;
    metadata?: Record<string, string>;
}

export interface PaymentIntentResult {
    clientSecret: string;
    paymentIntentId: string;
    amount: number;
    currency: string;
}

/**
 * Create a payment intent for order checkout
 */
export async function createPaymentIntent(
    params: CreatePaymentIntentParams
): Promise<PaymentIntentResult> {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: params.amount,
            currency: params.currency.toLowerCase(),
            metadata: {
                orderId: params.orderId,
                buyerId: params.buyerId,
                sellerId: params.sellerId,
                productId: params.productId,
                ...params.metadata,
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return {
            clientSecret: paymentIntent.client_secret!,
            paymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
        };
    } catch (error) {
        console.error('Error creating payment intent:', error);
        throw new Error('Failed to create payment intent');
    }
}

/**
 * Retrieve payment intent by ID
 */
export async function getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
        return await stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
        console.error('Error retrieving payment intent:', error);
        throw new Error('Failed to retrieve payment intent');
    }
}

/**
 * Cancel a payment intent
 */
export async function cancelPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
        return await stripe.paymentIntents.cancel(paymentIntentId);
    } catch (error) {
        console.error('Error canceling payment intent:', error);
        throw new Error('Failed to cancel payment intent');
    }
}

/**
 * Create a refund for a payment
 */
export async function createRefund(
    paymentIntentId: string,
    amount?: number
): Promise<Stripe.Refund> {
    try {
        const refundParams: Stripe.RefundCreateParams = {
            payment_intent: paymentIntentId,
        };

        if (amount) {
            refundParams.amount = amount;
        }

        return await stripe.refunds.create(refundParams);
    } catch (error) {
        console.error('Error creating refund:', error);
        throw new Error('Failed to create refund');
    }
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
    payload: string | Buffer,
    signature: string,
    secret: string
): Stripe.Event {
    try {
        return stripe.webhooks.constructEvent(payload, signature, secret);
    } catch (error) {
        console.error('Error verifying webhook signature:', error);
        throw new Error('Invalid webhook signature');
    }
}

/**
 * Convert amount to cents for Stripe
 */
export function amountToCents(amount: number): number {
    return Math.round(amount * 100);
}

/**
 * Convert cents to amount
 */
export function centsToAmount(cents: number): number {
    return cents / 100;
}
