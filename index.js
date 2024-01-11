const express = require("express");
const cors = require("cors");
const blogsRouter = require("./Routers/blogRouter");

const app = express()

app.use(cors())
app.use("/blogs", blogsRouter)

app.listen(8000, () => {
    console.log("Listening on 5000...")
})