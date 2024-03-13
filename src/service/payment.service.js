import Stripe from 'stripe'
import config from '../config.js';

export default class PaymentService {
    constructor() {
        this.stripe = new Stripe(config.stripe_key_secret)
    }

    createPaymentIntent(data) {
        return this.stripe.paymentIntents.create(data);
    }
    
}