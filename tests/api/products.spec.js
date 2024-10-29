const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../../src/app');
const Product = require('../../src/models/products.model');

describe('Api de productos', () => {

    beforeAll(async () => {
        // Conexión a la base de datos
        await mongoose.connect('mongodb://127.0.0.1:27017/online-shop');
    });

    afterAll(async () => {
        // Desconexión de la base de datos
        await mongoose.disconnect();
    });

    describe('GET /api/products', () => {

        let response;
        beforeAll(async () => {
            response = await request(app).get('/api/products').send();
        });

        it('debería responder con status 200', () => {
            expect(response.statusCode).toBe(200);
        });

        it('debería responder con un JSON', () => {
            expect(response.headers['content-type']).toContain('application/json');
        });

        it('debería responder con un array', () => {
            expect(response.body).toBeInstanceOf(Array);
        });

    });

    describe('POST /api/products', () => {

        let response;
        const body = { name: 'Lápiz verde', description: 'Pinta en verde', department: 'test', price: 14, stock: 200, available: true };
        beforeAll(async () => {
            response = await request(app).post('/api/products').send(body);
        });

        afterAll(async () => {
            // Borrar los productos con department test
            await Product.deleteMany({ department: 'test' });
        });

        it('debería funcionar la URL', () => {
            expect(response.statusCode).toBe(201);
            expect(response.headers['content-type']).toContain('application/json');
        });

        it('debería devolver un _id correcto', () => {
            expect(response.body._id).toBeDefined();
        });

        it('los valores enviados son los mismos que se guardan', () => {
            expect(response.body.name).toBe(body.name);
            expect(response.body.description).toBe(body.description);
            expect(response.body.department).toBe(body.department);
            expect(response.body.price).toBe(body.price);
            expect(response.body.stock).toBe(body.stock);
            expect(response.body.available).toBe(body.available);
        });

    });

    describe('PUT /api/products/<PRODUCTID>', () => {

        let product;
        let response;
        const body = { name: 'Lápiz verde', description: 'Pinta en verde', department: 'test', price: 14, stock: 200, available: true };
        beforeAll(async () => {
            // 1. Crear el producto que vamos a actualizar
            product = await Product.create(body);

            // 2. Lanzar la petición PUT sobre el producto anterior
            response = await request(app)
                .put(`/api/products/${product._id}`)
                .send({
                    price: 30, stock: 300
                });
        });

        afterAll(async () => {
            // Borrar el producto creado para las pruebas
            await Product.findByIdAndDelete(product._id);
        });

        it('debería funcionar la URL', () => {
            expect(response.statusCode).toBe(200);
            expect(response.headers['content-type']).toContain('application/json');
        });

        it('debería tener los campos actualizados en la BD', () => {
            expect(response.body.price).toBe(30);
            expect(response.body.stock).toBe(300);
        });

    });

    describe('DELETE /api/products/<PRODUCTID>', () => {

        let product;
        let response;
        const body = { name: 'Lápiz verde', description: 'Pinta en verde', department: 'test', price: 14, stock: 200, available: true };
        beforeAll(async () => {
            // 1. Crear el producto que vamos a borrar
            product = await Product.create(body);

            // 2. Lanzamos la petición
            response = await request(app)
                .delete(`/api/products/${product._id}`)
                .send();
        });

        afterAll(async () => {
            // Borrar el producto creado para las pruebas
            await Product.findByIdAndDelete(product._id);
        });

        it('debería funcionar la URL', () => {
            expect(response.statusCode).toBe(200);
            expect(response.headers['content-type']).toContain('application/json');
        });

        it('el producto no debería existir en la BD', async () => {
            const productDeleted = await Product.findById(product._id);
            expect(productDeleted).toBeNull();
        });

    });

});
