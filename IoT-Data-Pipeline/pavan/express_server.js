// expressServer.js (Version 3)

const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3000;
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'iot_database';

let collection;

async function connectMongoDB() {
    try {
        const client = new MongoClient(mongoUrl);
        await client.connect();
        console.log('[DB] Connected to MongoDB');
        collection = client.db(dbName).collection('sensor_data');
    } catch (error) {
        console.error('[DB] Connection error:', error);
    }
}
app.get('/', (req, res) => {
    res.send(`
        <html>
        <head>
            <title>IoT Sensor Data API</title>
        </head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1>Welcome to the IoT Sensor Data API</h1>
            <p>Use <a href="/data">/data</a> to retrieve sensor readings.</p>
        </body>
        </html>
    `);
});

// GET /data endpoint with filtering options
app.get('/data', async (req, res) => {
    try {
        if (!collection) {
            return res.status(500).json({ error: 'Database not initialized' });
        }

        let query = {};
        if (req.query.sensor) {
            query.sensor = req.query.sensor;
        }
        if (req.query.startTime && req.query.endTime) {
            query.timestamp = {
                $gte: new Date(req.query.startTime),
                $lte: new Date(req.query.endTime),
            };
        }

        const data = await collection.find(query).toArray();
        res.json(data);
    } catch (error) {
        console.error('[API] Error fetching data:', error);
        res.status(500).json({ error: 'Failed to retrieve sensor data' });
    }
});

// Start the server after connecting to MongoDB
connectMongoDB().then(() => {
    app.listen(PORT, () => {
        console.log(`[SERVER] Running on http://localhost:${PORT}`);
    });
});

