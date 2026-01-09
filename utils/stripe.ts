import Stripe from 'stripe'

let stripeInstance: Stripe | null = null;

export const getStripe = () => {
    if (!stripeInstance) {
        stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_51dummy', {
            typescript: true,
        })
    }
    return stripeInstance
}
