const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const blogsRouter = require("./Routers/blogRouter");
const projectsRouter = require("./Routers/projectRouter");
const userRouter = require("./Routers/userRouter");
require("dotenv").config();

const app = express()

mongoose.connect("mongodb://localhost:27017/ecommerce").then(() => {
    console.log("Connected to MongoDB...")
}).catch((e) => {
    console.log(e)
})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use("/projects", projectsRouter)
app.use("/blogs", blogsRouter)
app.use("/user", userRouter)

app.listen(5000, () => {
    console.log("Listening on 5000...")
})