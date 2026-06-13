const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const dotenv     = require('dotenv');
const helmet     = require('helmet');
const rateLimit  = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss        = require('xss-clean');
const hpp        = require('hpp');

dotenv.config();
const app = express();

// ── 1. HELMET — sets secure HTTP headers ─────────────────────
app.use(helmet());

// ── 2. RATE LIMITING — blocks brute force attacks ────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                    // max 100 requests per IP
  message: { message: 'Too many requests, please try again later.' }
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,                     // only 10 login attempts per 15 min
  message: { message: 'Too many login attempts. Try after 15 minutes.' }
});

app.use('/api/', limiter);
app.use('/api/auth/login', loginLimiter);  // extra strict on login

// ── 3. CORS ───────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:3000',
  'https://cme-jet.vercel.app',    
  'https://cmebase.vercel.app',    
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true
}));

// ── 4. BODY PARSER ────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));

// ── 5. MONGO SANITIZE — blocks NoSQL injection ────────────────
app.use(mongoSanitize());

// ── 6. XSS CLEAN — blocks script injection attacks ───────────
app.use(xss());

// ── 7. HPP — blocks HTTP parameter pollution ─────────────────
app.use(hpp());

// ── DB ────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => { console.error('❌ MongoDB error:', err.message); process.exit(1); });

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/employees',  require('./routes/employees'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/salary',     require('./routes/salary'));
app.use('/api/character',  require('./routes/character'));
app.use('/api/payment',    require('./routes/payment'));
app.use('/api/worksites',  require('./routes/worksites'));
app.use('/api/settings',   require('./routes/settings'));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// ── Global Error Handler ──────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ 
    message: err.message || 'Internal Server Error' 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 CME server running on port ${PORT}`));