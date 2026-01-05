import {Router} from "express";
import {loginuser, registerUser,loggedoutUser,refreshAccessToken, updatecoverimage, getuserchannelprofile, getwatchhistory,changeCurrentPassword,getcurrentuser,updateAccountdetails,updateuseravatar} from "../controllers/user.controller.js"
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
router.route("/changepassword").post(verifyjwt,changeCurrentPassword)
router.route("/current-user").get(verifyjwt,getcurrentuser)
router.route("/update-acciunt").patch(verifyjwt,updateAccountdetails)
router.route("/avatar").patch(verifyjwt,upload.single("avatar"),updateuseravatar)
router.route("/coverimage").patch(verifyjwt,upload.single("coverimage"),updatecoverimage)
router.route("/c/:username").get(verifyjwt,getuserchannelprofile)
router.route("/history").get(verifyjwt,getwatchhistory)




export default router