import Stripe from 'stripe'

export default class PaymentService {
    constructor(stripe_key_secret) {
        this.stripe = new Stripe(stripe_key_secret)
    }

    createPaymentIntent(data) {
        return this.stripe.paymentIntents.create(data);
    }
    
}