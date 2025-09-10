import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ApiError from '../error/ApiError.js';
import User from '../models/user.js';

async function registration(req, res, next) {
    try {
        const { email, password, userType, username } = req.body;

        if (!email || !password) {
            return next(ApiError.badRequest('incorrect email or password -_-'));
        }

        const candidate = await User.findOne({ where: { email } });
        if (candidate) {
            return next(ApiError.badRequest('user with this email is already exist.'));
        }

        const avatarImage = `/static/${req.file.filename}`;

        const hashPassword = await bcrypt.hash(password, 5);

        const user = await User.create({
            email,
            userType,
            username,
            avatar: avatarImage,
            password: hashPassword
        });

        res.json({
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                avatarUrl: user.avatar,
                isPro: user.userType === 'pro'
            }
        });

    } catch (error) {
        next(ApiError.internal(`registration error: ${error}`))
    }
};

async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(ApiError.badRequest('email and password is required'));
        }

        const user = await User.findOne({ where: { email } });
        if (!user) return next(ApiError.badRequest('user not found.'))

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) return next(ApiError.badRequest('wrong password.'));

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.json({ token });
    } catch (error) {
        next(ApiError.internal('authorization error: ' + error))
    }
}

async function checkAuth(req, res) {
    const user = req.user;

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            username: user.username,
            userType: user.userType,
            avatar: user.avatar
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    return res.json({
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        isPro: user.userType === 'pro',
        token
    });
}

async function logout(req, res) {
    res.status(204).send();
}

export { registration, login, checkAuth, logout };