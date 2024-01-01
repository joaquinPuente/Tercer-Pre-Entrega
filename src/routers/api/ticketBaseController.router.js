import RouterBase from "./RouterBase.js";
import TicketController from "../../controllers/ticket.controller.js";

export default class CartBaseController extends RouterBase {
  constructor() {
    super();
    this.init();
  }

  init() {
    this.get('/ticket',['PUBLIC', 'usuario'], TicketController.getTicketsByPurchaser);
  }

  getRouter() {
    return this.router;
  }
}
