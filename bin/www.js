require('dotenv').config();
const app = require('../app');
const http = require('http');

const PORT = process.env.PORT || 3000;
app.set('port', PORT);

const server = http.createServer(app);

server.listen(PORT);
server.on('error', (error) => {
    if (error.syscall !== 'listen') throw error;
    switch (error.code) {
        case 'EACCES':
            console.error(`Port ${PORT} requires elevated privileges`);
            process.exit(1);
        case 'EADDRINUSE':
            console.error(`Port ${PORT} is already in use`);
            process.exit(1);
        default:
            throw error;
    }
});
server.on('listening', () => {
    console.log(`✅ Server listening on port ${PORT}`);
});