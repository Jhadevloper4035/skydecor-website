const mongoose = require("mongoose");
const Product = require("./models/product.model.js"); // your schema
const products = require("./data/products.json"); // import JSON file

const events = require("./data/event.json");
const Event = require("./models/event.model.js");


const blogs = require("./data/blog.json");
const Blog = require("./models/blog.model.js");



const jobs = require("./data/jobData.json");
const Job = require("./models/job.model.js");



const { ConnectDB } = require("./config/db.js");

ConnectDB();

async function seedDB() {
  try {


    // Remove old data
   await Product.deleteMany({});
  console.log("🗑 Old products removed");

    //await Event.deleteMany({})
    // console.log("🗑 Old events removed");

    //await Blog.deleteMany({})
    //console.log("🗑 Old Blogs removed");



    // Insert new data product
    await Product.insertMany(products);
    console.log(`✅ ${products.length} products inserted successfully!`);


    // Insert new Event data product
    // await Event.insertMany(events)
    // console.log(`✅ ${events.length} events inserted successfully!`);

    //await Blog.insertMany(blogs)
    //console.log(`✅ ${blogs.length} blogs inserted successfully!`);


    // await Job.insertMany(jobs)
    // console.log(`✅ ${jobs.length} jobs inserted successfully!`);

    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error seeding database:", err);
    mongoose.connection.close();
  }
}

seedDB();
