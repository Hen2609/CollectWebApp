const express = require('express')
const router = express.Router()
const mongo = require("../util/mongo")
const product = require('./product')



router.use(async (req,res,next) => {
    await mongo()
    next();
})

router.use('/product', product)

module.exports = router;