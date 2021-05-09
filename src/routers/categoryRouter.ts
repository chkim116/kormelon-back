import express from "express"
import {
    createCategory,
    delCategory,
    editCategory,
    getCategory,
} from "../controller/categoryController"

const categoryRouter = express.Router()

//  /category ~~

// create

categoryRouter.post("/create", createCategory)

// read

categoryRouter.get("/", getCategory)

// edit

categoryRouter.post("/edit", editCategory)

// delete

categoryRouter.delete("/del/:id", delCategory)

export default categoryRouter
