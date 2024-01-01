import TicketService from "../service/ticket.service.js";


export default class TicketController {
    static async getTicketsByPurchaser(req, res) {
        try {
            const email = req.session.user.email;
            const tickets = await TicketService.findByPurchaserEmail(email); 
            console.log('tickets desde controller: ', tickets);
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

    
}
