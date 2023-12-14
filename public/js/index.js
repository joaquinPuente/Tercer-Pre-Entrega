(async function () {
    console.log('inicia socket.io');
    const socket = io();
    const messages = document.getElementById('messages');
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');

    async function getUsername() {
        const { value: username } = await Swal.fire({
            title: 'Ingresar Nombre de Usuario',
            input: 'text',
            inputPlaceholder: 'Escribe tu nombre de usuario',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Aceptar',
            inputValidator: (value) => {
                if (!value) {
                    return 'Debes ingresar un nombre de usuario';
                }
            }
        });
        
        if (username) {
            socket.emit('setUsername', username);
            return username; 
        }
        return null; 
    }
    const username = await getUsername();

    if (username) {
        messageForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const messageText = messageInput.value;
            if (messageText.trim() !== '') {
                socket.emit('chat message', { text: messageText, user: username });
                messageInput.value = '';
            }
        });

        socket.on('chat message', function (data) {
            var message = document.createElement('p');
            message.innerHTML = `<strong>${data.user}:</strong> ${data.text}`;
            messages.appendChild(message);
        });
    }
})();
