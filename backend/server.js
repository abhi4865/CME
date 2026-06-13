const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const dotenv     = require('dotenv');

dotenv.config();

const app = express();

// ── CORS ──────────────────────────────────────────────────────────
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

// ── Middleware ────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));

// ── DB Connection ─────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅  MongoDB connected'))
  .catch(err => { console.error('❌  MongoDB error:', err.message); process.exit(1); });

// ── Routes ────────────────────────────────────────────────────────
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/employees',  require('./routes/employees'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/salary',     require('./routes/salary'));
app.use('/api/character',  require('./routes/character'));
app.use('/api/payment',    require('./routes/payment'));
app.use('/api/worksites',  require('./routes/worksites'));
app.use('/api/settings',   require('./routes/settings'));

// ── Health Check ──────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok', app: 'CME Backend' }));

// ── Global Error Handler ──────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// ── Start Server ──────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀  CME server running on port ${PORT}`));