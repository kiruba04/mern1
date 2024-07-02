import express from "express"
import {deleteeUser, getUser, getUsers, updateUser } from "../controller/user.js";
import { checkAuth} from "../controller/authh.js";

const router =express.Router()



/*router.get("/checkauthentication",verifyToken,(req,res,next)=>{
    res.send("Hello user,you are logged in")
})

router.get("/checkuser/:id",verifyUser,(req,res,next)=>{
    res.send("Hello user,you are logged in and delete your account")
})

router.get("/checkadmin/:id", verifyAdmin, (req, res, next) => {
    res.send("Hello admin, you are logged in and can delete all the accounts");
  });*/


 //update
router.put('/:id',updateUser);
//delete
router.delete('/:id',deleteeUser);
 //get
router.get('/:id',getUser);
 //getall
router.get("/",getUsers);
 

export default router