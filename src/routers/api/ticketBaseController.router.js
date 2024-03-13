import RouterBase from "./RouterBase.js";
import TicketController from "../../controllers/ticket.controller.js";

export default class CartBaseController extends RouterBase {
  constructor() {
    super();
    this.init();
  }

  init() {
    this.get('/ticket',['PUBLIC', 'usuario'], TicketController.getTicketsByPurchaser);
    this.get('/sendEmail', ['PUBLIC', 'usuario'], TicketController.sendEmail)
    this.get('/checkout', ['PUBLIC', 'usuario'], TicketController.getCheckout)
    this.post('/payment', ['PUBLIC', 'usuario'], TicketController.payment )
  }

  getRouter() {
    return this.router;
  }
}
