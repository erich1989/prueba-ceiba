require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routerApi = require('./routes');
const configureSanitization = require('./middleware/securityMiddleware');
const { globalRateLimiter } = require('./middleware/rateLimiterMiddleware');

const app = express();

app.use(helmet());

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:4000',
  'http://localhost:4001',
  'http://localhost:4002',
];

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
configureSanitization(app);
app.use(globalRateLimiter);

routerApi(app);

app.get('/', (req, res) => {
  res.send('✓ MercadoExpress Inventory API running successfully.');
});

module.exports = app;
