import db from "../config/Database.js";
// import "./FoodModel.js";
// import "./LikeModel.js";
import "./UserModel.js";
import "./BannerModel.js"
import "./PromoModel.js"

(async () => {
    await db.sync({ alter: true });
})();

