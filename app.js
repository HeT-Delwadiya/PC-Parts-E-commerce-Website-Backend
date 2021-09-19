require('dotenv').config()
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const paymentRoutes = require("./routes/payment");

const app = express();

//Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//Routes
app.use("/api",  authRoutes);
app.use("/api",  userRoutes);
app.use("/api",  categoryRoutes);
app.use("/api",  productRoutes);
app.use("/api",  orderRoutes);
app.use("/api",  paymentRoutes);

//DB connection
mongoose.connect(process.env.DB_URL, 
     {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false})
.then(() => console.log("DB connected successfully"));










































//server starter
app.listen(process.env.PORT, () => console.log("Server started on port: "+process.env.PORT));