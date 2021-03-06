import dotenv from 'dotenv';
import fs from 'fs';
import http from 'http';
import https from 'https';
import path from 'path';

dotenv.config();

// this require is necessary for server HMR to recover from error
let server = require('./app/server').server;

if (module.hot) {
  module.hot.accept('./app/server', () => {
    console.info('🔁  HMR Reloading `./app/server`...');
    try {
      server = require('./app/server').server;
    } catch (error) {
      console.error(error);
    }
  });
  console.info('✅  Server-side HMR Enabled!');
}

const PORT = Number.parseInt(process.env.PORT ?? '3005', 10);

function createServer() {
  if (process.env.NODE_ENV === 'development') {
    const CRT = path.resolve(__dirname, '..', 'tls', 'cardbox.crt');
    const KEY = path.resolve(__dirname, '..', 'tls', 'cardbox.key');

    console.info('Create local HTTPS server with certificate and key:');
    console.info(`Cert: ${CRT}`);
    console.info(`Key: ${KEY}`);

    const options = {
      cert: fs.readFileSync(CRT),
      key: fs.readFileSync(KEY),
    };

    return https.createServer(options, server);
  }

  // http on prod, because we have nginx reverse proxy
  return http.createServer({}, server);
}

const httpServer = createServer().listen(PORT, () => {
  console.info(`> Started on`, httpServer.address());
});

export default httpServer;
