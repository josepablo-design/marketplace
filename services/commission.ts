/**
 * Commission calculation service for marketplace platform
 * Handles commission rates and calculations for different seller types
 */

export interface CommissionConfig {
    defaultRate: number;
    artistRate?: number;
    storeRate?: number;
    individualRate?: number;
}

export interface CommissionCalculation {
    orderAmount: number;
    commissionRate: number;
    commissionAmount: number;
    platformFee: number;
    sellerPayout: number;
}

/**
 * Default commission configuration
 * All rates are 10% (0.10) by default
 */
const DEFAULT_COMMISSION_CONFIG: CommissionConfig = {
    defaultRate: 0.10, // 10% platform commission
    artistRate: 0.10,
    storeRate: 0.10,
    individualRate: 0.10,
};

/**
 * Get commission rate for a specific seller type
 */
export function getCommissionRate(
    sellerType: 'artist' | 'store' | 'individual',
    config: CommissionConfig = DEFAULT_COMMISSION_CONFIG
): number {
    switch (sellerType) {
        case 'artist':
            return config.artistRate ?? config.defaultRate;
        case 'store':
            return config.storeRate ?? config.defaultRate;
        case 'individual':
            return config.individualRate ?? config.defaultRate;
        default:
            return config.defaultRate;
    }
}

/**
 * Calculate commission breakdown for an order
 */
export function calculateCommission(
    orderAmount: number,
    sellerType: 'artist' | 'store' | 'individual',
    config: CommissionConfig = DEFAULT_COMMISSION_CONFIG
): CommissionCalculation {
    const commissionRate = getCommissionRate(sellerType, config);
    const commissionAmount = orderAmount * commissionRate;
    const platformFee = commissionAmount; // Same as commission for now
    const sellerPayout = orderAmount - platformFee;

    return {
        orderAmount,
        commissionRate,
        commissionAmount: Number(commissionAmount.toFixed(2)),
        platformFee: Number(platformFee.toFixed(2)),
        sellerPayout: Number(sellerPayout.toFixed(2)),
    };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: currency,
    }).format(amount);
}

/**
 * Calculate total commission from multiple orders
 */
export function calculateTotalCommission(orders: Array<{ amount: number; commission_amount: number }>): number {
    return orders.reduce((total, order) => total + order.commission_amount, 0);
}
