import { Router } from 'express';
import { createReview, getReviewsByOfferId } from '../controllers/reviewController.js'
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = new Router();

router.post('/:offerId', authenticateToken, createReview);
router.get('/:offerId', getReviewsByOfferId);

export default router;