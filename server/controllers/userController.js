import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ApiError from "../error/ApiError.js";
import { User } from "../models/user.js";
export const registration = async (req, res, next) => {
	try {
		const { email, password, userType, username } = req.body;

		if (!email || !password) {
			return next(ApiError.badRequest("Некорректный email или password"));
		}

		const candidate = await User.findOne({ where: { email } });
		if (candidate) {
			return next(
				ApiError.badRequest("Пользователь с таким email уже существует")
			);
		}

		const avatarImage = `/static/${req.file.filename}`;

		const hashPassword = await bcrypt.hash(password, 5);

		const user = await User.create({
			email,
			userType,
			username,
			avatar: avatarImage,
			password: hashPassword,
		});

		res.json({
			user: {
				id: user.id,
				email: user.email,
				username: user.username,
				avatarUrl: user.avatar,
				isPro: user.userType === "pro",
			},
		});
	} catch (error) {
		console.error("Ошибка при регистрации:", error);
		next(ApiError.internal("Ошибка регистрации"));
	}
};
export const login = async (req, res, next) => {
	try {
		console.log(req.body);
		const { email, password } = req.body;

		const user = await User.findOne({ where: { email } });
		if (!user) return next(ApiError.badRequest("Пользователь не найден"));

		const isValid = await bcrypt.compare(password, user.password);
		if (!isValid) return next(ApiError.badRequest("Неверный пароль"));

		console.log("JWT_SECRET:", process.env.JWT_SECRET);

		const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
			expiresIn: "24h",
		});

		res.json({ token });
	} catch (error) {
		console.error("Ошибка при логине:", error);
		next(ApiError.internal("Ошибка авторизации"));
	}
};
export const checkAuth = (req, res) => {
	const user = req.user;

	const token = jwt.sign(
		{
			id: user.id,
			email: user.email,
			username: user.username,
			userType: user.userType,
			avatar: user.avatar,
		},
		process.env.JWT_SECRET,
		{ expiresIn: "24h" }
	);

	return res.json({
		id: user.id,
		email: user.email,
		username: user.username,
		avatar: user.avatar,
		isPro: user.userType === "pro",
		token,
	});
};
export const logout = (req, res) => {
	res.status(204).send();
};
