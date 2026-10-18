import {Router} from "express"
import { register } from "../controller/user.crontoller.js"

const router = Router()
router.route("/register").post(register)
export default router