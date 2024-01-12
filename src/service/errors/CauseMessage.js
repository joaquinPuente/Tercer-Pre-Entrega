export const generatorRegisterError = ( user ) => {
    return `Todos los campos son requeridos y deben ser validos. Lista de campos recibidos en la solicitud:
    - first_name: ${user.first_name}
    - last_name: ${user.last_name}
    - email: ${user.email}
    - number: ${user.number}
    - password: ${user.password}
    `;
};

export const generatorProductError = (product) => {
    const { title, description, price, thumbnail, code, stock } = product;
    let errorMessage = "Se requieren y deben ser válidos los siguientes campos para el producto: \n";

    if (!title || typeof title !== "string") {
        errorMessage += "- El campo 'title' es requerido y debe ser una cadena de caracteres.\n";
    }

    if (!description || typeof description !== "string") {
        errorMessage += "- El campo 'description' es requerido y debe ser una cadena de caracteres.\n";
    }

    if (isNaN(price) || price <= 0) {
        errorMessage += "- El campo 'price' es requerido y debe ser un número mayor que cero.\n";
    }

    if (!thumbnail || typeof thumbnail !== "string") {
        errorMessage += "- El campo 'thumbnail' es requerido y debe ser una cadena de caracteres.\n";
    }

    if (!code || typeof code !== "string") {
        errorMessage += "- El campo 'code' es requerido y debe ser una cadena de caracteres.\n";
    }

    if (isNaN(stock) || stock < 0) {
        errorMessage += "- El campo 'stock' es requerido y debe ser un número entero mayor o igual que cero.\n";
    }

    return errorMessage;
};

export const generatorProductIdError = (id) => {
    if (typeof id !== 'string') {
        return `Se debe enviar un identificador válido 😱. El valor recibido no es un string: ${id}`;
    }
    return `Se debe enviar un identificador válido 😱. Valor recibido: ${id}`;
};

