export default class UserDTO {
    constructor(user) {
      this._id = user._id;
      this.firstName = user.first_name;
      this.lastName = user.last_name;
      this.email = user.email;
      this.age = user.age;
      this.role = user.role;
      this.createdAt = user.createdAt;
      this.updatedAt = user.updatedAt;
    }
  }