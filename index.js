const express = require("express");
const path = require("path");
const productRoute = require("./routes/product.js");
const blogRoute = require("./routes/blog.js");
const eventRoute = require("./routes/event.js");
const careerRoute = require("./routes/career.js");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/product", productRoute);
app.use("/blogs", blogRoute);
app.use("/events", eventRoute);
app.use("/career", careerRoute);

// Routes
app.get("/", (req, res) => {
  res.render("index", {
    title: "Home Page",
    message: "Welcome to EJS with Static Files!",
  });
});

app.get("/contact-us", (req, res) => {
  res.render("contact", {
    title: "conatct Page",
    message: "Welcome to EJS with Static Files!",
  });
});


app.get("/about-us", (req, res) => {
  res.render("contact", {
    title: "conatct Page",
    message: "Welcome to EJS with Static Files!",
  });
});

module.exports = app;
