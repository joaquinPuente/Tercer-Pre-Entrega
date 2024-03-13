import TicketService from "../service/ticket.service.js";
import EmailService from '../service/mails.service.js'
import PaymentService from "../service/payment.service.js";
import config from "../config.js";

export default class TicketController {
    static async getTicketsByPurchaser(req, res) {
        try {
            const email = req.session.user.email;
            const tickets = await TicketService.findByPurchaserEmail(email).populate('productsAdded productsNotAdded'); 
            const ticketsJSON = tickets.map(ticket => {
                if (ticket.toJSON && typeof ticket.toJSON === 'function') {
                    return ticket.toJSON();
                } else {
                    return ticket;
                }
            });
            res.render('ticket', { tickets: ticketsJSON });
        } catch (error) {
            console.error('Error al obtener tickets por comprador:', error.message);
            res.status(500).json({ error: 'Error al obtener tickets por comprador' });
        }
    }

    static async sendEmail(req, res, next) {
        try {
            const email = req.session.user.email;
            const tickets = await TicketService.findByPurchaserEmail(email).populate('productsAdded productsNotAdded');
            if (tickets.length > 0) {
                const ticket = tickets[0];
                const emailContent = `
                <div>
                    <h1>Detalles del ticket de compra</h1>
                    <p><strong>Código:</strong> ${ticket.code}</p>
                    <p><strong>Fecha de compra:</strong> ${ticket.purchase_datetime}</p>
                    <p><strong>Monto:</strong> ${ticket.amount}</p>
                    <h2>Productos Agregados:</h2>
                    <ul>
                        ${ticket.productsAdded.map(product => `<li>${product.title}: $${product.price}</li>`).join('')}
                    </ul>
                    <h2>Productos No Agregados:</h2>
                    <ul>
                        ${ticket.productsNotAdded.map(product => `<li>${product.title}: $${product.price}</li>`).join('')}
                    </ul>
                </div>
            `;
                await EmailService.sendEmail(
                    email,
                    'Detalles de tu compra',
                    emailContent,
                    []
                );

                await TicketService.deleteByPurchaserEmail(email)

                res.status(200).render('compraFinalizada')
            } else {
                res.status(404).json({ error: 'No se encontraron tickets para este usuario' });
            }
        } catch (error) {
            next(error);
        }
    }

    static async getCheckout (req,res) {
        try {
            const stripe_key_public = config.stripe_key_public;
            res.render('checkout', { stripe_key_public });
        } catch (error) {
            res.status(404).json({ error: 'No se pudo ingresar a la vista checkout'} );
        }
    }

    static async payment(req, res) {
        const { token } = req.body;
        try {
            const tickets = await TicketService.findByPurchaserEmail(req.session.user.email);
            if (!tickets || tickets.length === 0) {
                return res.status(404).json({ error: 'No se encontró el ticket para este usuario' });
            }
            const ticket = tickets[0]; 
            const amount = ticket.amount *100;
            const paymentIntentInfo = {
                amount: amount,
                currency: 'usd',
                payment_method_types: ['card'],
                payment_method_data: {
                    type: 'card',
                    card: {
                        token: token
                    }
                },
                metadata: {
                    user_email: req.session.user.email,
                }
            };
            
            const service = new PaymentService();
            let result = await service.createPaymentIntent(paymentIntentInfo);
            res.json('Pago aceptado');
            
        } catch (error) {
            console.error(error);
            res.status(500).send('Error en el pago');
        }
    };
    
    
    
}