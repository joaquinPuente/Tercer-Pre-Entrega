import Stripe from 'stripe'

export default class PaymentService {
    constructor() {
        this.stripe = new Stripe('sk_test_51OsUw7Rto3QfZ1JmNE9yW6wSPmg3faIjrc0nf8W7kS0WopozLEo2ysxolDQPJfL0TDuc6HmcPRHjhCiXEkxrBkfq00bwbFE8wj')
    }

    createPaymentIntent(data) {
        return this.stripe.paymentIntents.create(data);
    }
    
}