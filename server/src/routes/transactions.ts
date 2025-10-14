import { Router } from 'express';
import * as transactionController from '../controllers/transactions';
import { authenticate } from '../middleware/auth';
import multer from 'multer';

const router = Router();

// Configure multer for voice uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (req, file, cb) => {
    // Accept audio files only
    if (
      file.mimetype.startsWith('audio/') ||
      file.mimetype === 'application/octet-stream' ||
      file.mimetype === 'video/webm' // Some browsers send webm for audio
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'));
    }
  },
});

// All routes require authentication
router.use(authenticate);

// GET /api/transactions - Get all transactions for user
router.get('/', transactionController.getTransactions);

// GET /api/transactions/:id - Get single transaction
router.get('/:id', transactionController.getTransaction);

// POST /api/transactions - Create new transaction
router.post('/', transactionController.createTransaction);

// POST /api/transactions/parse - Parse natural language to transaction
router.post('/parse', transactionController.parseTransactionText);

// POST /api/transactions/voice - Transcribe audio and parse to transaction
// Use multer to handle audio file upload
router.post(
  '/voice',
  upload.single('audio'), // Expects field name 'audio'
  transactionController.transcribeAndParse
);

// PUT /api/transactions/:id - Update transaction
router.put('/:id', transactionController.updateTransaction);

// DELETE /api/transactions/:id - Delete transaction
router.delete('/:id', transactionController.deleteTransaction);

export default router;