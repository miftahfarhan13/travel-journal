import db from "../config/Database.js";
import "./ActivityModel.js";
import "./CategoryModel.js";
import "./UserModel.js";
import "./BannerModel.js"
import "./PromoModel.js"

(async () => {
    await db.sync({ alter: true });
})();

