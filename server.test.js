require('dotenv').config();
const request = require('supertest');
const app = require('./app');
const redisClient = require('./config/redis');
const { MongoClient, ObjectId } = require('mongodb');

const username = encodeURIComponent(process.env.MONGODB_USERNAME);
const password = encodeURIComponent(process.env.MONGODB_PASSWORD);
const dbName = process.env.MONGODB_DATABASE;
const host = process.env.MONGODB_HOST;
const port = process.env.MONGODB_PORT;
const uri = `mongodb://${username}:${password}@${host}:${port}/${dbName}?authSource=${dbName}`;

let db;
let collection;
let server;
let token;
let insertedItemIds = [];

describe('Get Token from /api/jwt and CRUD operations for /api/users', () => {
    beforeAll(async () => {
        const client = await MongoClient.connect(uri);
        db = client.db(dbName);
        collection = db.collection('users');
        server = app.listen(4000);
    });
    
    afterAll(async () => {
        if (insertedItemIds.length > 0) {
            for (const id of insertedItemIds) {
                try {
                    await collection.deleteOne({ _id: new ObjectId(id) });
                } catch (err) {
                    console.error(`Error deleting data with _id: ${id}`, err);
                }
            }
        }
        await server.close();
        redisClient.flushAll();
        redisClient.quit();
    });
    
    test('Get JWT token (GET /jwt)', async () => {
        const response = await request(server)
            .get('/api/jwt')
            .expect(201);
        
        token = response.body.token;
        expect(token).toBeDefined();
        expect(response.body.status).toBe('success');
        expect(response.body.message).toBe('Token generated successfully.');
    });
    
    test('Create an user (POST /api/users)', async () => {
        const response = await request(server)
            .post('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .send({ 
                userName: "createData", 
                accountNumber: "500111", 
                emailAddress: "createData@email.com", 
                identityNumber: "600111" 
            })
            .expect(201);
        
        expect(response.body.status).toBe('success');
        expect(response.body.message).toBe('User created successfully.');
        expect(response.body.data).toHaveProperty('userName');
        expect(response.body.data).toHaveProperty('accountNumber');
        expect(response.body.data).toHaveProperty('emailAddress');
        expect(response.body.data).toHaveProperty('identityNumber');
        insertedItemIds.push(response.body.data._id);
    });
    
    test('Get all users (GET /api/users)', async () => {
        const result = await collection.insertOne({ 
            userName: "getAllData", 
            accountNumber: "500222", 
            emailAddress: "getAllData@email.com", 
            identityNumber: "600222" 
        });
        
        const response = await request(server)
            .get('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        
        expect(response.body.status).toBe('success');
        expect(response.body.message).toBe('All users data fetched successfully.');
        expect(response.body.data.length).toBeGreaterThan(0);
        insertedItemIds.push(result.insertedId);
    });
    
    test('Get an user by user name (GET /api/users/userName/:userName)', async () => {
        const result = await collection.insertOne({ 
            userName: "getByUserName", 
            accountNumber: "500333", 
            emailAddress: "getByUserName@email.com", 
            identityNumber: "600333" 
        });
        
        const response = await request(server)
            .get(`/api/users/userName/getByUserName`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        
        expect(response.body.status).toBe('success');
        expect(response.body.message).toBe('User data by username fetched successfully.');
        expect(response.body.data).toHaveProperty('userName');
        expect(response.body.data).toHaveProperty('accountNumber');
        expect(response.body.data).toHaveProperty('emailAddress');
        expect(response.body.data).toHaveProperty('identityNumber');
        insertedItemIds.push(result.insertedId);
    });

    test('Get an user by account number (GET /api/users/accountNumber/:accountNumber)', async () => {
        const result = await collection.insertOne({ 
            userName: "getByAccountNumber", 
            accountNumber: "500444", 
            emailAddress: "getByAccountNumber@email.com", 
            identityNumber: "600444" 
        });
        
        const response = await request(server)
            .get(`/api/users/accountNumber/500444`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        
        expect(response.body.status).toBe('success');
        expect(response.body.message).toBe('User data by account number fetched successfully.');
        expect(response.body.data).toHaveProperty('userName');
        expect(response.body.data).toHaveProperty('accountNumber');
        expect(response.body.data).toHaveProperty('emailAddress');
        expect(response.body.data).toHaveProperty('identityNumber');
        insertedItemIds.push(result.insertedId);
    });

    test('Get an user by email address (GET /api/users/emailAddress/:emailAddress)', async () => {
        const result = await collection.insertOne({ 
            userName: "getByEmailAddress", 
            accountNumber: "500555", 
            emailAddress: "getByEmailAddress@email.com", 
            identityNumber: "600555" 
        });
        
        const response = await request(server)
            .get(`/api/users/emailAddress/getByEmailAddress@email.com`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        
        expect(response.body.status).toBe('success');
        expect(response.body.message).toBe('User data by email address fetched successfully.');
        expect(response.body.data).toHaveProperty('userName');
        expect(response.body.data).toHaveProperty('accountNumber');
        expect(response.body.data).toHaveProperty('emailAddress');
        expect(response.body.data).toHaveProperty('identityNumber');
        insertedItemIds.push(result.insertedId);
    });

    test('Get an user by identity number (GET /api/users/identityNumber/:identityNumber)', async () => {
        const result = await collection.insertOne({ 
            userName: "getByIdentityNumber", 
            accountNumber: "500666", 
            emailAddress: "getByIdentityNumber@email.com", 
            identityNumber: "600666" 
        });
        
        const response = await request(server)
            .get(`/api/users/identityNumber/600666`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        
        expect(response.body.status).toBe('success');
        expect(response.body.message).toBe('User data by identity number fetched successfully.');
        expect(response.body.data).toHaveProperty('userName');
        expect(response.body.data).toHaveProperty('accountNumber');
        expect(response.body.data).toHaveProperty('emailAddress');
        expect(response.body.data).toHaveProperty('identityNumber');
        insertedItemIds.push(result.insertedId);
    });
    
    test('Update an user (PUT /api/users/:userId)', async () => {
        const { insertedId } = await collection.insertOne({ 
            userName: "updateData", 
            accountNumber: "500777", 
            emailAddress: "updateData@email.com", 
            identityNumber: "600777" 
        });
        
        const response = await request(server)
            .put(`/api/users/${insertedId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ 
                userName: "updateData2", 
                accountNumber: "500888", 
                emailAddress: "updateData2@email.com", 
                identityNumber: "600888" 
            })
            .expect(200);
        
        expect(response.body.status).toBe('success');
        expect(response.body.message).toBe('User updated successfully.');
        expect(response.body.data).toHaveProperty('userName');
        expect(response.body.data).toHaveProperty('accountNumber');
        expect(response.body.data).toHaveProperty('emailAddress');
        expect(response.body.data).toHaveProperty('identityNumber');
        insertedItemIds.push(insertedId);
    });
    
    test('Delete an user (DELETE /api/users/:userId)', async () => {
        const { insertedId } = await collection.insertOne({ 
            userName: "deleteData", 
            accountNumber: "500999", 
            emailAddress: "deleteData@email.com", 
            identityNumber: "600999" 
        });
        
        const response = await request(server)
            .delete(`/api/users/${insertedId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        
        expect(response.body.status).toBe('success');
        expect(response.body.message).toBe('User deleted successfully.');
    });
});