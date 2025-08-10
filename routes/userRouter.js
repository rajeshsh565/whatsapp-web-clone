import { Router } from "express";
const router = Router();

import { getCurrentUser, getAllUsers } from "../controllers/userController.js";

router.route("/current-user").get(getCurrentUser);
router.route("/all-users").get(getAllUsers);

export default router;