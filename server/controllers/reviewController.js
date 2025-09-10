import { adaptReviewToClient } from '../adapter/reviewAdapter.js';
import ApiError from '../error/ApiError.js';
import Review from '../models/review.js'
import User from '../models/user.js';

async function createReview(req, res, next) {
    try {
        const { comment, rating } = req.body;
        const offerId = req.params.offerId;
        const userId = req.user.id;
        
        if (!offerId || !comment || !rating) {
            return next(ApiError.badRequest('not enough data for comment: comment or rating or offerId'));
        }

        if (comment.length < 5 || comment.length > 1024) {
            return next(ApiError.badRequest('text must be between 5 and 1024'));
        }

        if (rating < 1 || rating > 5) {
            return next(ApiError.badRequest('rating must be a number between 1 and 5'));
        }

        const review = await Review.create({
            text: comment,
            rating,
            OfferId: offerId,
            authorId: userId
        });

        return res.status(201).json(review);
    } catch (error) {
        next(ApiError.badRequest('failed to add the comment: ' + error.message))
    }
}

async function getReviewsByOfferId(req, res, next) {
    try {
        const reviews = await Review.findAll({
            where: { OfferId: req.params.offerId },
            include: { model: User, as: 'author' },
            order:  [['publishDate', 'DESC']]
        });

        const adaptedReviews = reviews.map(adaptReviewToClient);
        res.json(adaptedReviews);
    } catch (error) {
        next(ApiError.internal('failed to receive comments: ' + error))
    }
};

export { createReview, getReviewsByOfferId };