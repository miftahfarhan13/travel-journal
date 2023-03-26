import express from "express";
import cors from "cors";
import UserRoute from "./src/routes/UserRoute.js"
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
        file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

app.use(bodyParser.json())
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'))

app.use(UserRoute)

app.listen(4000, () => console.log('Server up and running at http://localhost:4000'));