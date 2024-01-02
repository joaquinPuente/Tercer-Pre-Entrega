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
  }

  getRouter() {
    return this.router;
  }
}
