const net = require('net');
const colors = require('colors-console');

async function portIsOccupied(port: number, log = true) {
    const server = net.createServer().listen(port);
    return new Promise((resolve, reject) => {
        server.on('listening', () => {
            log && console.log(colors('green', `您可以使用该端口： ${port}`));
            server.close();
            resolve(port);
        });

        server.on('error', async (err: any) => {
            if (err.code === 'EADDRINUSE') {
                resolve(await portIsOccupied(port + 1, log));
                // 占用端口号+1
                log && console.log(colors('red', `端口已被占用： ${port}`));
            } else {
                reject(err);
            }
        });
    });
}

export = portIsOccupied;
