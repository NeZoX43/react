import jwt from 'jsonwebtoken';
import ApiError from '../error/ApiError.js';
import User from '../models/user.js';

async function authenticateToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith('Bearer')) {
            return next(ApiError.unauthorized('unauthorized. please use token.'));
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByPk(decoded.id);
        if (!user) {
            return next(ApiError.unauthorized('user not found.'));
        }

        req.user = user;
        next();
    } catch (error) {
        next(ApiError.unauthorized('invalid token.'));
    }
}

export { authenticateToken };