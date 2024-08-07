import express from "express";
import cors from "cors";
import UserRoute from "./src/routes/UserRoute.js"
import BannerRoute from "./src/routes/BannerRoute.js"
import PromoRoute from "./src/routes/PromoRoute.js"
import ImageRoute from "./src/routes/ImageRoute.js"
import CategoryRoute from "./src/routes/CategoryRoute.js"
import ActivityRoute from "./src/routes/ActivityRoute.js"
import PaymentMethodRoute from "./src/routes/PaymentMethodRoute.js"
import CartRoute from "./src/routes/CartRoute.js"
import TransactionRoute from "./src/routes/TransactionRoute.js"
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";

const app = express();
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.use(bodyParser.json())

app.use(
    fileUpload({
        abortOnLimit: true,
    })
);

app.use(UserRoute)
app.use(BannerRoute)
app.use(PromoRoute)
app.use(CategoryRoute)
app.use(ImageRoute)
app.use(ActivityRoute)
app.use(PaymentMethodRoute)
app.use(CartRoute)
app.use(TransactionRoute)


app.listen(4000, () => console.log('Server up and running at http://localhost:4000'));