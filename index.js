const express = require("express");
const path = require("path");
const productRoute = require("./routes/product.js");
const blogRoute = require("./routes/blog.js");
const eventRoute = require("./routes/event.js");
const careerRoute = require("./routes/career.js");

const Blog = require("./models/blog.model.js");
const Testimonial =  require("./models/testimonial.model.js");
const Product =   require("./models/product.model.js");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/product", productRoute);
app.use("/blogs", blogRoute);
app.use("/events", eventRoute);
app.use("/career", careerRoute);

// Routes

app.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }).limit(3);
    const testimonials = await Testimonial.find();

    const categories = ["PVC", "Acrylish", "1mm", "0.8mm", "SOFFITTO", "Liner"];

    // Run all category queries in parallel
    const productsByCategory = await Promise.all(
      categories.map(async (cat) => {
        const products = await Product.find({ productType: cat })
          .sort({ createdAt: -1 })
          .limit(4);
        return { category: cat, products };

      })
    );

    res.render("index", {
      title: "Home Page",
      blogs,
      testimonials,
      productsByCategory,
      message: "Welcome to EJS with Static Files!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});





app.get("/contact-us", (req, res) => {
  res.render("contact", {
    title: "conatct Page",
    message: "Welcome to EJS with Static Files!",
  });
});

app.get("/about-us", (req, res) => {
  res.render("about", {
    title: "conatct Page",
    message: "Welcome to EJS with Static Files!",
  });
});

app.get("/customer-review", (req, res) => {
  res.render("customer-review", {
    title: "conatct Page",
    message: "Welcome to EJS with Static Files!",
  });
});







module.exports = app;
