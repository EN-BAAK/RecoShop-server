import express from "express";
import cors from "cors"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"

import dotenv from "dotenv"
dotenv.config()

import { error, RouteNotFound } from "./src/middlewares/error";
import db from "./src/models"
import AuthRouter from "./src/routers/auth"
import SubCategoryRouter from "./src/routers/subCategory"
import CategoryRouter from "./src/routers/category"
import ProductRouter from "./src/routers/product"
import BrandRouter from "./src/routers/brand"
import UserRouter from "./src/routers/user"

const app = express()

app.use(cors({
  origin: [process.env.FRONTEND_URL!],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}))

app.use(cookieParser())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/api/v0/auth", AuthRouter)
app.use("/api/v0/users", UserRouter)
app.use("/api/v0/sub-categories", SubCategoryRouter)
app.use("/api/v0/categories", CategoryRouter)
app.use("/api/v0/products", ProductRouter)
app.use("/api/v0/brands", BrandRouter)
app.use("/api", RouteNotFound)


app.use(error)

const port = process.env.PORT

db.sequelize!.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on ${port}`)
  })
})