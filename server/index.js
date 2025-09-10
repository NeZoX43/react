import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import sequelize from "./config/database.js";
import errorMiddleware from "./middleware/ErrorHandlingMiddleware.js";
import { Offer } from "./models/offer.js";
import { Review } from "./models/review.js";
import { User } from "./models/user.js";
import { router } from "./routers/index.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use("/static", express.static(path.resolve(__dirname, "static")));
app.use("/", router);
app.use(errorMiddleware);

app.get("/", (req, res) => {
	res.status(200).json({ message: "Ура!" });
});

const start = async () => {
	try {
		await sequelize.authenticate();
		await sequelize.sync();
		app.listen(PORT, () => console.log(`server${PORT}`));
		Offer;
		Review;
		User;
	} catch (e) {
		console.log(e);
	}
};
start();
