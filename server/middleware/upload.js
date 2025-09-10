import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log("fdsf");

// Путь к папке для изображений
const staticDir = path.resolve(__dirname, "..", "static");

// Если папки нет — она создается
if (!fs.existsSync(staticDir)) {
	fs.mkdirSync(staticDir);
}

// Настройка хранилища файлов
const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, staticDir),
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname) || ".jpg";
		cb(null, `${uuidv4()}${ext}`);
	},
});

const upload = multer({ storage });
export default upload;
