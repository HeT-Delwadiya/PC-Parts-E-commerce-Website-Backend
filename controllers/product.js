const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require('fs');

exports.getProductById = (req, res, next, id) => {
     Product.findById(id)
          .exec((err,product) => {
               if(err)
                    return res.status(400).json({error:"Product not found."});
               req.product = product;
               next();
          });
}

exports.createProduct = (req, res) => {
     let form = new formidable.IncomingForm();
     form.keepExtensions = true;

     form.parse(req, (err, fields, file) => {
          if(err)
               return res.status(400).json({error:"Problem with image! "+err});

          const {name, description, price, category, stock} = fields;

          if(!name || !description || !price || !category || !stock) {
               return res.status(400).json({error:"All fields are required!"});
          }
          
          let product = new Product(fields);

          if(file.image) {
               if(file.image.size > 3000000)
                    return res.status(400).json({error:"File is too big"});

               product.image.data = fs.readFileSync(file.image.path);
               product.image.contentType = file.image.type;
          }

          product.save((err, product) => {
               if(err)
                    return res.status(400).json({error:"Couldn't save product to DB "+err});
               return res.json(product);
          });
     });
}

exports.getProduct = (req, res) => {
     req.product.image = undefined;
     return res.json(req.product);
}

exports.getProductImage = (req, res, next) => {
     if(req.product.image.data) {
          res.set("Content-Type", req.product.image.type);
          return res.send(req.product.image.data);
     }
     next(); 
}

exports.updateProduct = (req, res) => {
     let form = new formidable.IncomingForm();
     form.keepExtensions = true;

     form.parse(req, (err, fields, file) => {
          if(err)
               return res.status(400).json({error:"Problem with image!"});
          
          let product = req.product;
          product = _.extend(product, fields);

          if(file.image) {
               if(file.image.size > 3000000)
                    return res.status(400).json({error:"File is too big"});

               product.image.data = fs.readFileSync(file.image.path);
               product.image.contentType = file.image.type;
          }

          product.save((err, product) => {
               if(err)
                    return res.status(400).json({error:"Couldn't update product to DB"});
               return res.json(product);
          });
     });
}

exports.deleteProduct = (req, res) => {
     let product = req.product;
     product.remove((err, deletedProduct) => {
          if(err)
               return res.status(400).json({error:"Failed to delete the product"});
          return res.json(deletedProduct);
     });
}

exports.getAllProducts = (req, res) => {
     Product.find()
          .select("-image")
          .populate("category")
          .limit(req.query.limit ? parseInt(req.query.limit) : 8)
          .sort([[req.query.sortBy ? req.query.sortBy : "_id","asc"]])
          .exec((err, products) => {
               if(err)
                    return res.status(400).json({error:"No products found"});
               return res.json(products);
          });
}

exports.updateStock = (req, res, next) => {
     let myOprations = req.body.order.products.map(product => {
          return {
               updateOne: {
                    filter: {_id: product._id},
                    update: {$inc: {stock: -product.count, sold: +product.count}}
               }
          }
     });

     Product.bulkWrite(myOprations, {}, (err, products) => {
          if(err)
               return res.status(400).json({error:"stock updation failed"});
     });
     next();
}

exports.getAllUniqueCategory = (req, res) => {
     Product.distinct("category", {}, (err, category) => {
          if(err) {
               return res.status(400).json({error:"No categories found"});
          }
          return res.json(category);
     });
}