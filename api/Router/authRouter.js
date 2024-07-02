import express from "express"
import { login, register,logout,checkAuth } from "../controller/authh.js"

const router =express.Router()
router .post("/register",register)
router. post("/login",login)
router.post("/logout",logout)
router.get("/checkAuth",checkAuth)

export default router