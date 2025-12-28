import {Router} from "express";
import {registerUser} from "../controllers/user.controller.js"
import {upload} from "../middleware/multer.js"
const router=Router()

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxcount:1
        },
        {
            name:"coverimage",
            maxcount:1

        }
    ]),
    registerUser
)


export default router