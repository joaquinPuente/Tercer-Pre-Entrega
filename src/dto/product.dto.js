export default class ProductDTO {
  constructor(title, description, price, thumbnail, code, stock, ownerInfo = {}) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
    this.owner = {
      role: ownerInfo.role,
      email: ownerInfo.email,
    };
  }
}