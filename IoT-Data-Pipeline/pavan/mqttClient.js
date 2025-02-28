// mqttClient.js (Version 3)

const mqtt = require('mqtt');
const { MongoClient } = require('mongodb');

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'iot_database';
const collectionName = 'sensor_data';

let dbCollection;

async function connectMongoDB() {
    try {
        const client = new MongoClient(mongoUrl);
        await client.connect();
        console.log('[DB] Connected to MongoDB');
        dbCollection = client.db(dbName).collection(collectionName);
    } catch (error) {
        console.error('[DB] Connection error:', error);
    }
}

async function handleIncomingMessage(topic, message) {
    try {
        const payload = JSON.parse(message.toString());

        const document = {
            sensor: payload.sensor,
            temperature: parseFloat(payload.temperature),
            timestamp: new Date(payload.timestamp),
        };

        await dbCollection.insertOne(document);
        console.log(`[MQTT] Stored in MongoDB -> ${topic}:`, document);
    } catch (error) {
        console.error('[MQTT] Error processing message:', error);
    }
}

function initializeMQTT() {
    const client = mqtt.connect('mqtt://test.mosquitto.org');

    client.on('connect', () => {
        console.log('[MQTT] Connected to broker');
        client.subscribe(['/home/sensor1', '/home/sensor2'], (err) => {
            if (err) console.error('[MQTT] Subscription error:', err);
        });
    });

    client.on('message', handleIncomingMessage);
    client.on('error', (err) => console.error('[MQTT] Client error:', err));
}

async function main() {
    await connectMongoDB();
    initializeMQTT();
}

main().catch(console.error);

