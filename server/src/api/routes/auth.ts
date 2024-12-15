import AuthController from "@/controller/AuthController";
import upload from "@/util/ImageUpload";
import express, { Express } from "express"


const AuthRoute: Express = express();



AuthRoute.post("/register", upload.single("image"), AuthController.AuthRegister)


export default AuthRoute