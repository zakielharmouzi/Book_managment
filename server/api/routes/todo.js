import {Router}  from "express";
import {
    getUsers,
    getUserById,
} from "../controllers/todo.js";

const router = Router();

router.get("/Users", getUsers);
router.get("/UsersbyId", getUserById);

export default router;
