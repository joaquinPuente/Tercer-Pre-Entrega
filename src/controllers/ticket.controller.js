import TicketService from "../service/ticket.service.js";


export default class TicketController {
    static async getTicketsByPurchaser(req, res) {
        try {
            console.log('req.session.user desde ticketcontroller: ', req.session.user);
            const email = req.session.user.email;
            const tickets = await TicketService.findByPurchaserEmail(email); 
            console.log('tickets desde controller: ', tickets);

            // Mapear cada ticket y aplicar toJSON() a cada uno de ellos si es posible
            const ticketsJSON = tickets.map(ticket => {
                if (ticket.toJSON && typeof ticket.toJSON === 'function') {
                    return ticket.toJSON();
                } else {
                    return ticket; // Si el método toJSON() no está definido, se devuelve el ticket sin cambios
                }
            });

            console.log('ticketsJSON', ticketsJSON);
            res.render('ticket', { tickets: ticketsJSON });
        } catch (error) {
            console.error('Error al obtener tickets por comprador:', error.message);
            res.status(500).json({ error: 'Error al obtener tickets por comprador' });
        }
    }

}
