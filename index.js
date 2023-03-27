import express from "express";
import cors from "cors";
import UserRoute from "./src/routes/UserRoute.js"
import BannerRoute from "./src/routes/BannerRoute.js"
import PromoRoute from "./src/routes/PromoRoute.js"
import ImageRoute from "./src/routes/ImageRoute.js"
import CategoryRoute from "./src/routes/CategoryRoute.js"
import multer from "multer";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' || 
        file.mimetype === 'image/svg+xml' ||
        file.mimetype === 'image/webp') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

app.use(bodyParser.json())
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'))

app.use(UserRoute)
app.use(BannerRoute)
app.use(PromoRoute)
app.use(CategoryRoute)
app.use(ImageRoute)

app.listen(4000, () => console.log('Server up and running at http://localhost:4000'));