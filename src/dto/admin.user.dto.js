export default class AdminUserDTO {
    constructor(users) {
      this.users = users.map(user => ({
        id: user._id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        age: user.age,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastConnetion: user.last_connection,
        documents: user.documents.map(document => ({
          name: document.name,
          reference: document.reference
        }))
      }));
    }
}