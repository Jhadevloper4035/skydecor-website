const router = require("express").Router();
const { getProducts , getSingleProduct , getAllCategoryProduct } = require("../controllers/product.controller.js");

router.get("/", getProducts);

router.get("/:productCode" , getSingleProduct)

router.get("/page/:productType" , getAllCategoryProduct)



module.exports = router;
