import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/error';
import multer from 'multer';


// Initialize express app
const app: Application = express();

// ============================================
// MIDDLEWARE
// ============================================

// Security headers
app.use(helmet());

// CORS - Allow requests from frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads (voice audio)
// Store files in memory as buffers (not on disk)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: (req, file, cb) => {
    // Accept audio files only
    if (
      file.mimetype.startsWith('audio/') ||
      file.mimetype === 'application/octet-stream'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'));
    }
  },
});

// Make upload middleware available globally for voice routes
app.set('upload', upload);

// Request logging (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    // Don't log sensitive data like passwords
    const sanitizedBody = req.body ? { ...req.body } : {};
    if (sanitizedBody.password) {
      sanitizedBody.password = '[REDACTED]';
    }
    if (sanitizedBody.confirmPassword) {
      sanitizedBody.confirmPassword = '[REDACTED]';
    }
    
    console.log(`${req.method} ${req.path}`, {
      body: sanitizedBody,
      query: req.query,
    });
    next();
  });
}

// ============================================
// ROUTES
// ============================================

// Health check (no auth required)
app.get('/', (req, res) => {
  res.json({
    message: 'FinSense API',
    version: '1.0.0',
    status: 'healthy',
  });
});

// API routes
app.use('/api', routes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;