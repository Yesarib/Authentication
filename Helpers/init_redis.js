const redis = require('redis');

const client = redis.createClient({
    socket: {
        port: 6379,
        host: "127.0.0.1"
    }
});

(async () => { 
    await client.connect(); 
})(); 


client.on('ready', () => {
    console.log("Client connected to redis and ready to use...");
});

client.on('error', (err) => {
    console.error("Redis error:", err.message);
});

client.on('end', () => {
    console.log("Client disconnected from redis");
});

process.on('SIGINT', () => {
    client.quit();
});

module.exports = client;
