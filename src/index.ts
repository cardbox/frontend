import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import http from 'http';
import https from 'https';
import path from 'path';

dotenv.config();

// this require is necessary for server HMR to recover from error
let app = require('./server').server;

if (module.hot) {
  module.hot.accept('./server', () => {
    console.info('🔁  HMR Reloading `./server`...');
    try {
      app = require('./server').server;
    } catch (error) {
      console.error(error);
    }
  });
  console.info('✅  Server-side HMR Enabled!');
}

const PORT = Number.parseInt(process.env.PORT ?? '3000', 10);

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

    return https.createServer(options, app);
  }

  // http on prod, because we have nginx reverse proxy
  return http.createServer({}, app);
}

const server = createServer().listen(PORT, () => {
  console.info(`> Started on`, server.address());
});

export default server;
