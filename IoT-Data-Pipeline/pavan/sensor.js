// sensor.js (Version 2)

const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://test.mosquitto.org');  // Adjust as per your broker URL

// Generate random temperature for each sensor
function getSensor1Data() {
    const temp = (Math.random() * 12 + 20).toFixed(2); // Temp between 20 and 32
    return {
        sensor: 'sensor1',
        temperature: temp,
        timestamp: new Date().toISOString(),
    };
}

function getSensor2Data() {
    const temp = (Math.random() * 8 + 22).toFixed(2); // Temp between 22 and 30
    return {
        sensor: 'sensor2',
        temperature: temp,
        timestamp: new Date().toISOString(),
    };
}

// Function to send data to MQTT
function publishData() {
    const sensor1 = getSensor1Data();
    const sensor2 = getSensor2Data();

    client.publish('/home/sensor1', JSON.stringify(sensor1));
    client.publish('/home/sensor2', JSON.stringify(sensor2));

    console.log(`Sensor1 data sent: ${JSON.stringify(sensor1)}`);
    console.log(`Sensor2 data sent: ${JSON.stringify(sensor2)}`);
}

// On successful connection, start publishing data
client.on('connect', () => {
    console.log('Connected to MQTT broker');
    setInterval(publishData, 2000);  // Publish data every 2 seconds
});

// Log any MQTT connection issues
client.on('error', (err) => {
    console.log('MQTT connection error:', err);
});

