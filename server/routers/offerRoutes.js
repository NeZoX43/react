import { Router } from "express";
import {
	createOffer,
	getAllOffers,
	getFavoriteOffers,
	getFullOffer,
	toggleFavorite,
} from "../controllers/offerController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const offerRouter = new Router();

offerRouter.get("/offers", getAllOffers);
offerRouter.post(
	"/offers",
	upload.fields([
		{ name: "previewImage", maxCount: 1 },
		{ name: "photos", maxCount: 6 },
	]),
	createOffer
);

offerRouter.post(
	"/favorite/:offerId/:status",
	authenticateToken,
	toggleFavorite
);

offerRouter.get("/offers/favorite", getFavoriteOffers);

offerRouter.get("/offers/:id", getFullOffer);

export default offerRouter;
