const express = require('express')
const router = express.Router()
const mongo = require("../util/mongo")

const api = require("./api")
const pages = require("./pages")

router.use(async (req,res,next) => {
    await mongo()
    next();
})

router.use("/api", api)
router.use("/", pages)

module.exports = router;