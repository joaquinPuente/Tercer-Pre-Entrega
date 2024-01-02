import TicketService from "../service/ticket.service.js";
import EmailService from '../service/mails.service.js'
import ticketModel from "../models/ticket.model.js";


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
                    </div>
                `;
                await EmailService.sendEmail(
                    email,
                    'Detalles de tu compra',
                    emailContent,
                    []
                );
                 res.status(200).render('compraFinalizada')
            } else {
                res.status(404).json({ error: 'No se encontraron tickets para este usuario' });
            }
        } catch (error) {
            next(error);
        }
    }


    static async deleteTicket(req, res, next) {
        try{
            const email = req.session.user.email;
            const ticket = await TicketService.findByPurchaserEmail(email)
            if (!ticket) {
                return res.status(404).json({ error: 'Ticket no encontrado' });
            }
            if (ticket.purchaser !== email) {
                return res.status(403).json({ error: 'No tienes permiso para eliminar este ticket' });
            }
            await ticketModel.deleteOne({ purchaser : email })
            res.status(200).json({ message: 'Ticket eliminado exitosamente' });
        } catch (error) {
            next(error);
        }
    }



}