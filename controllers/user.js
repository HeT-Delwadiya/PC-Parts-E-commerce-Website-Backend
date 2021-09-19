const User = require("../models/user");
const {Order} = require("../models/order");

exports.getUserById = (req, res, next, id) => {
     User.findById(id).exec((err, user) => {
          if(err)
               return res.status(400).json({error:err})
          else if(!user)
               return res.status(400).json({error:"User not found!"})
          else {
               req.profile = user;
               next();
          }
     });
}

exports.getUser = (req,res) => {
     req.profile.salt = undefined;
     req.profile.encry_password = undefined;
     req.profile.createdAt = undefined;
     req.profile.updatedAt = undefined;
     return res.json(req.profile);
}

exports.updateUser = (req,res) => {
     User.findByIdAndUpdate(
          {_id: req.profile._id},
          {$set: req.body},
          {new: true, useFindAndModify: false},
          (err, user) => {
               if(err)
                    return res.status(400).json({error:"You are not authorized to update the info!"});
               user.salt = undefined;
               user.encry_password = undefined;
               user.createdAt = undefined;
               user.updatedAt = undefined;
               res.json(user);
     })
}

exports.getPurchases = (req,res) => {

     Order.find({user: req.profile._id})
          .exec((err,order) => {
               if(err)
                    return res.status(400).json({error:"No purchases found in your account"});
               return res.json(order);
          });

     // User.find({_id: req.profile._id})
     //      .populate("user","_id name")
     //      .exec((err,order) => {
     //           if(err)
     //                return res.status(400).json({error:"No purchases found in your account"});
     //           return res.json(order);
     //      });
}

exports.pushOrderInPurchaseList = (req, res, next) => {
     let purchases = [];

     req.body.order.products.forEach((product) => {
          purchases.push({
               _id: product._id,
               name: product.name,
               description: product.description,
               category: product.category,
               quantity: product.count,
               amount: req.body.order.amount,
               transaction_id: req.body.order.transaction_id
          });
     });

     User.findOneAndUpdate(
          {_id: req.profile._id},
          {$push: {purchases: purchases}},
          {new: true},
          (err, purchases) => {
               if(err)
                    res.status(400).json({error:"Unable to save purchase list!"})
          });

     next();
}