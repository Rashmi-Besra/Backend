import {Router} from "express";
import {loginuser, registerUser,loggedoutUser,refreshAccessToken} from "../controllers/user.controller.js"
import {upload} from "../middleware/multer.js"
import { verifyjwt } from "../middleware/auth.middleware.js";

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

router.route("/login").post(loginuser)
//secured routes
router.route("/logout").post(verifyjwt,loggedoutUser)
router.route("/refresh-token").post(refreshAccessToken)



export default router