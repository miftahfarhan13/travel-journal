import db from "../config/Database.js";
// import "./FoodModel.js";
// import "./LikeModel.js";
import "./UserModel.js";

(async () => {
    await db.sync({ alter: true });
})();

