const {Order, ProductsInCart} = require("../models/order");

exports.getOrderById = (req, res, next, id) => {
     Order.findById(id)
          .populate("products.product", "name price")
          .exec((err, order) => {
               if(err)
                    return res.status(400).json({error:"No order found"});
               req.order = order;
               next();
          });
          
}

exports.createOrder = (req, res) => {
     req.body.order.user = req.profile;
     const order = new Order(req.body.order);
     order.save((err,order) => {
          if(err)
               return res.status(400).json({error:"Failed to save order in DB"});
          res.json({order});
     });
}

exports.getAllOrders = (req, res) => {
     Order.find()
          .populate("user","_id name email")
          .exec((err,orders) => {
               if(err)
                    return res.status(400).json({error:"No orders found"});
               return res.json(orders);
          });
}

exports.getOrderStatus = (req, res) => {
     res.json(Order.schema.path("status").enumValues);
}

exports.updateOrderStatus = (req, res) => {
     Order.updateOne(
          {_id: req.order.id},
          {$set: {status: req.body.status}},
          (err, order) => {
               if(err)
                    return res.status(400).json({error:"Failed to update status of order"});
               return res.json(order);
          });
}

exports.getOrder = (req, res) => {
     return res.json(req.order);
}
