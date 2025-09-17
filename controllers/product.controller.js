const Product = require("../models/product.model.js");

exports.getProducts = async (req, res) => {
  try {
    let { category, subCategory, texture, page, limit, sort } = req.query;

    // Helper: convert query param to array
    const parseArray = (param) => {
      if (!param) return [];
      return Array.isArray(param) ? param : param.split(",").map((v) => v.trim());
    };

    // Build filters
    const query = {};
    if (category?.length) query.category = { $in: parseArray(category) };
    if (subCategory?.length) query.subCategory = { $in: parseArray(subCategory) };
    if (texture?.length) query.texture = { $in: parseArray(texture) };

    // Pagination
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 50;
    const skip = (page - 1) * limit;

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort) {
      sortOption = {};
      sort.split(",").map((s) => s.trim()).forEach((field) => {
        if (field.startsWith("-")) sortOption[field.substring(1)] = -1;
        else sortOption[field] = 1;
      });
    }

    // Execute queries in parallel
    const [products, total, categories, subCategories, textures , designs] = await Promise.all([
      Product.find(query).sort(sortOption).skip(skip).limit(limit),
      Product.countDocuments(query),
      Product.distinct("category"),
      Product.distinct("subCategory"),
      Product.distinct("texture"),
      Product.distinct("designName"),
    ]);

    // Current selected filters
    const filters = {
      category: parseArray(category),
      subCategory: parseArray(subCategory),
      texture: parseArray(texture),
    };

    // Pagination pages
    const pages = Math.ceil(total / limit);

    // AJAX request → render only partial (for shop-area)
    if (req.xhr || req.headers["x-requested-with"] === "XMLHttpRequest") {
      return res.render(
        "partials/product-card", // this partial includes #shop-area content
        { products, total, page, pages, categories, subCategories, textures, filters, count: products.length },
        (err, html) => {
          if (err) return res.status(500).send("Error rendering partial");
          res.send(html);
        }
      );
    }

    // Full page load
    res.render("product", {
      title: "Shop - SkyDecor",
      products,
      total,
      page,
      pages,
      categories,
      subCategories,
      textures,
      filters,
      count: products.length,
    });
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



exports.getSingleProduct = async (req, res) => {
  try {
    const { productCode } = req.params; 

    // 1. Find the product by productCode (case-insensitive match for safety)
    const product = await Product.findOne({ 
      productCode: { $regex: new RegExp("^" + productCode + "$", "i") } 
    });

    if (!product) {
      return res.status(404).render("error", {
        title: "Product Not Found - SkyDecor",
        message: "Sorry, the requested product does not exist."
      });
    }

    // 2. Find related products in the same category (exclude the current product)
    const relatedProducts = await Product.find({ 
      category: product.category,
      _id: { $ne: product._id }
    }).limit(20); // you can adjust the limit

    // 3. Render the product page with product + related products
    res.render("single-product", {
      title: `${product.productCode} - SkyDecor`,
      product,
      relatedProducts
    });

  } catch (error) {
    console.error("❌ Error fetching product:", error);
    res.status(500).render("error", {
      title: "Server Error - SkyDecor",
      message: "Something went wrong. Please try again later."
    });
  }
};







exports.getAllCategoryProduct = async (req, res) => {
  try {
    const { productType } = req.params;
    const { category } = req.query;

    console.log("➡️ Params:", productType, "➡️ Query:", category);

    // Build query dynamically
    const query = { productType };
    if (category) query.category = category;

    const products = await Product.find(query);

    if (!products || products.length === 0) {
      return res.status(404).render("error", {
        title: "Product Not Found - SkyDecor",
        message: "Sorry, no products were found for this category."
      });
    }

    res.render("category-product.ejs", {
      title: `${category || productType} - SkyDecor`,
      products
    });

  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).render("error", {
      title: "Server Error - SkyDecor",
      message: "Something went wrong. Please try again later."
    });
  }
};
