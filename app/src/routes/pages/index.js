const express = require('express');
const router = express.Router();

const {handleHomepage} = require("../../controllers/pages/homepage");

const categoryRoutes = require("./category")
const productRoutes = require("./product");
const cartRoutes = require("./cart");
const privacyRoutes = require("./privacy");
const statsRoutes = require("./stats");
const orderRoutes = require("./orders");


router.use("/category",categoryRoutes)
router.use("/product",productRoutes)
router.use("/cart",cartRoutes)
router.use("/privacy",privacyRoutes)
router.use("/stats",statsRoutes)
router.use("/orders",orderRoutes)

router.get("/", async (req, res) => {
    const categories = await categoriesController.getCategories()
    let categories_filter = []
    if(req.query.categories){
        categories_filter = Array.isArray(req.query.categories) ? req.query.categories : [req.query.categories]
    }
    categoriesFilter = categories_filter.map(cat => mongoose.Types.ObjectId.createFromHexString(cat))
    const search = req.query.search ? req.query.search : undefined
    const products = await productsController.getProducts(search,categoriesFilter)

    render(req,res,'homepage','קודש SQUAD', {
        categories,
        products
    })
})
module.exports = router;
