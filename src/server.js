const express = require('express');

const { db, config } = require('./config/default');
const logging = require('./lib/Logging');

const apiRouter = require('./routes');

const server = express();

const StartServer = () => {
  server.use((req, res, next) => {
    logging.info(
      `Incoming -> Method: [${req.method}] - url: [${req.url}] - IP: [${req.socket.remoteAddress}]`
    );

    res.on('finish', () => {
      logging.info(
        `Incoming -> Method: [${req.method}] - url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`
      );
    });

    next();
  });

  server.use(express.urlencoded({ extended: true }));
  server.use(express.json());

  // Rules of our API
  server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method == 'OPTIONS') {
      res.header(
        'Access-Control-Allow-Methods',
        'PUT, POST, PATCH, DELETE, GET'
      );
      return res.status(200).json({});
    }

    next();
  });

  /** Routes */
  server.use('/api', apiRouter);

  /** Health Check */
  server.get('/ping', (req, res, next) =>
    res.status(200).json({ message: 'Hello Server' })
  );

  /** Error handling */
  server.use((req, res, next) => {
    const error = new Error('Not found');

    logging.error(error);

    return res.status(404).json({
      message: error.message,
    });
  });

  server.listen(config.server.port, () =>
    logging.info(`Server is running on port ${config.server.port}`)
  );
};

db.connect()
  .then(() => {
    logging.info('Connected to Postgres');
    StartServer();
  })
  .catch(error => {
    logging.error('Unable to connect: ');
    logging.error(error);
  });
