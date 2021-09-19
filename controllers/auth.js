const User = require("../models/user");
const { check, validationResult, Result } = require('express-validator');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const { OAuth2Client } = require("google-auth-library");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const client = new OAuth2Client("1029735325088-vq3mag7vo7kp6kr0lsi0cvbgb1v0puno.apps.googleusercontent.com")

exports.signup = (req,res) => {

     const errors = validationResult(req);

     if(!errors.isEmpty()) {
          return res.json({error: errors.array()[0].msg});
     }

     const newUser = new User(req.body);
     newUser.save((err, user) => {
          if(err)
               return res.json({"Message":err});
          else
               return res.json(user);
     });
};

exports.signin = (req,res) => {

     const errors = validationResult(req);
     const {email, password} = req.body;

     if(!errors.isEmpty()) {
          return res.json({error: errors.array()[0].msg});
     }

     User.findOne({email}, (err, user) => {
          if(err)
               return res.status(422).json({"Error":err});
          else if(!user) 
               return res.status(422).json({"Message":"User with email or password not found!"});
          else {
               if(!user.authenticate(password)) {
                    return res.status(422).json({"Message":"Email and password does not match!"})
               }

               const authtoken = jwt.sign({ _id: user._id }, process.env.SECRET);
               res.cookie("token", authtoken, { expiresIn: 60 * 60 * 9999});

               const {_id, name, email, role} = user;
               return res.json({authtoken,user: {_id, name, email, role}});
          }
     })
};

exports.signout = (req, res) => {
     res.clearCookie("token");
     res.json({
       message: "User signout successfully"
     });
};
   
//protected routes
exports.isSignedIn = expressJwt({
     secret: process.env.SECRET,
     userProperty: "auth"
});
   
//custom middlewares
exports.isAuthenticated = (req, res, next) => {
     let checker = req.profile && req.auth && req.profile._id == req.auth._id;
     if (!checker) {
       return res.status(403).json({
         error: "ACCESS DENIED"
       });
     }
     next();
};
   
exports.isAdmin = (req, res, next) => {
     if (req.profile.role === 0) {
       return res.status(403).json({
         error: "You are not ADMIN, Access denied"
       });
     }
     next();
};

exports.googleAuth = (req, res) => {
     const tokenId = req.body.tokenId;

     client.verifyIdToken({idToken: tokenId, audience: "1029735325088-vq3mag7vo7kp6kr0lsi0cvbgb1v0puno.apps.googleusercontent.com"})
          .then(response => {
               const {email, name} = response.payload;

               User.findOne({email}).exec((err, user) => {
                    if(err)
                         return res.status(400).json({error: "Something went wrong!"});
                    else {
                         if(user) {
                              const authtoken = jwt.sign({ _id: user._id }, process.env.SECRET);
                              res.cookie("token", authtoken, { expiresIn: 60 * 60 * 9999});

                              const {_id, name, email, role} = user;
                              return res.json({authtoken,user: {_id, name, email, role}});
                         } else {
                              let password = email+process.env.SECRET;
                              let newUser = new User({name, email, password});
                              newUser.save((err, data) => {
                                   if(err)
                                        return res.status(400).json({error: "Something went wrong!"});

                                   const authtoken = jwt.sign({ _id: data._id }, process.env.SECRET);
                                   res.cookie("token", authtoken, { expiresIn: 60 * 60 * 9999});
          
                                   const {_id, name, email, role} = data;
                                   return res.json({authtoken,user: {_id, name, email, role}});
                              })
                         }
                    }
               })
          })
}

exports.facebookAuth = (req, res) => {
     const {accessToken,userID} = req.body;

     let urlGraphFB = `https://graph.facebook.com/v12.0/${userID}/?fields=id,name,email&access_token=${accessToken}`;

     fetch(urlGraphFB, {
          method: "GET"
     }).then(response => response.json())
     .then(response => {
          const {name, email} = response;
          
          User.findOne({email}).exec((err, user) => {
               if(err)
                    return res.status(400).json({error: "Something went wrong!"});
               else {
                    if(user) {
                         const authtoken = jwt.sign({ _id: user._id }, process.env.SECRET);
                         res.cookie("token", authtoken, { expiresIn: 60 * 60 * 9999});

                         const {_id, name, email, role} = user;
                         return res.json({authtoken,user: {_id, name, email, role}});
                    } else {
                         let password = email+process.env.SECRET;
                         let newUser = new User({name, email, password});
                         newUser.save((err, data) => {
                              if(err)
                                   return res.status(400).json({error: "Something went wrong!"});

                              const authtoken = jwt.sign({ _id: data._id }, process.env.SECRET);
                              res.cookie("token", authtoken, { expiresIn: 60 * 60 * 9999});
     
                              const {_id, name, email, role} = data;
                              return res.json({authtoken,user: {_id, name, email, role}});
                         })
                    }
               }
          })
          
     })
}