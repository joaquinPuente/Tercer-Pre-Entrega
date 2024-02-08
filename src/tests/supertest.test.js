import {expect} from 'chai';
import supertest from 'supertest';

const requester = supertest('http://localhost:8080')

describe('E-commerce Testing', () => {
    
    describe('Testing of sessions', () => {

        let emailUser;
        let passwordUser;
        
        it('Debe registrar correctamente un usuario', async function () {
            this.timeout(5000);
            const user = {
                first_name: 'JoaquinTesting',
                last_name: 'PuenteTesting',
                email: 'joaquintesting@gmail.com',
                age: 18,
                password: 'qwerty',
                role: 'ADMIN'
            }
            emailUser = user.email;
            passwordUser = user.password;
            const response = await requester.post('/sessions').send(user);  
            const { _data } = response.request;
            const { first_name, last_name, email, age, role } = _data;
            expect(response.statusCode).to.equal(302);
            expect(first_name).to.equal('JoaquinTesting');
            expect(last_name).to.equal('PuenteTesting');
            expect(email).to.equal('joaquintesting@gmail.com');
            expect(age).to.equal(18);
            expect(role).to.equal('ADMIN');
        });

        it('Debe logear correctamente un usuario', async function () {
            this.timeout(5000);
            const user = {
                email: emailUser,
                password: passwordUser
            }
            const response = await requester.post('/login').send(user);     

            expect(response.statusCode).to.equal(302);
            expect(response.redirect).to.be.true
            expect(response.error).to.be.not.true
        });

        it('Debería devolver un error 401 si no hay sesión activa', async () => {
            const response = await requester.get('/api/session/current');

            expect(response.status).to.equal(401);
            expect(response.body).to.have.property('error').that.equals('No hay sesión activa');
        });

    });

    describe('Testing of products', () => {

        it('Debe traer todos los productos luego de haber iniciado sesion.', async function () {
            this.timeout(5000);
            const user = {
                email: 'joaquintesting@gmail.com',
                password: 'qwerty',
            };
            const loginResponse = await requester.post('/login').send(user)
            const redirectedPath = loginResponse.headers.location;

            expect(loginResponse.statusCode).to.equal(302);
            expect(redirectedPath).to.equal('/api/products'); 
        });

        it('Debe buscar por id el producto y mostrar la vista en pantalla', async function () {
            this.timeout(5000);
            const user = {
                email: 'joaquintesting@gmail.com',
                password: 'qwerty',
            };
            const loginResponse = await requester.post('/login').send(user)

            const productIdResponse = await requester.get('/api/products/654167a7a4115462a38ead6b')

            expect(loginResponse.statusCode).to.equal(302);
            expect(productIdResponse.statusCode).to.equal(200);
            expect(productIdResponse.ok).to.be.ok
        });

        it('Debe buscar por id el producto no existente y retornar 500', async function () {
            this.timeout(5000);
            const user = {
                email: 'joaquintesting@gmail.com',
                password: 'qwerty',
            };
            const loginResponse = await requester.post('/login').send(user)

            const productIdResponse = await requester.get('/api/products/idfalso')
            const error = productIdResponse.error

            expect(loginResponse.statusCode).to.equal(302);
            expect(productIdResponse.statusCode).to.equal(500);
            expect(error).to.be.has.property('text','Error al obtener producto por ID')
        });

    });
    
    describe('Testing of carts', () => {
        let cookies; 

        async function loginUser() {
            const user = {
                email: 'joaquintesting@gmail.com',
                password: 'qwerty',
            };
            const response = await requester.post('/login').send(user);
            cookies = response.headers['set-cookie'];
            return cookies; 
        }
    
        beforeEach( async function() {
            this.timeout(10000); 
            await loginUser();
        });
    
        it('Debe agregar un producto al carrito correctamente', async function () {
            this.timeout(5000);
            const productId = '654167a7a4115462a38ead6b'; 
            const response = await requester
                .post('/api/addToCart')
                .set('Cookie', cookies)
                .send({ productId });
    
            expect(response.statusCode).to.equal(302);
            expect(response.redirect).to.be.true
            expect(response.error).to.be.not.true
        });
    
        it('Debe eliminar un producto del carrito correctamente', async function () {
            this.timeout(5000);
            const productId = '654167a7a4115462a38ead6b'; 
            const response = await requester
                .post('/api/removeFromCart')
                .set('Cookie', cookies)
                .send({ productId });
    
            expect(response.statusCode).to.equal(302);
            expect(response.redirect).to.be.true
            expect(response.error).to.be.not.true
        });

        it('Debe traer los detalles del carrito', async function(){
            this.timeout(5000);
        
            const response = await requester
                .get('/api/cart')
                .set('Cookie', cookies);
        
            expect(response.status).to.equal(200);
            expect(response.error).to.be.not.true
            expect(response.text).to.be.exist
        });
    });
    
    
});
