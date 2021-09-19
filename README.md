# PC-Parts-E-commerce-Website-Frontend
 An e commerce website created in MERN stack. Frontend is of React JS, Backend is of Node, Express JS and MongoDB is used for database.

## Description

An ecommerce store built with MERN stack, and utilizes third party API's. This ecommerce store enable two main different flows or implementations:

1. Buyers browse the store categories, products and brands
2. Admins manage and control the entire store components 


* features:
  * Node provides the backend environment for this application
  * Express middleware is used to handle requests, routes
  * Mongoose schemas to model the application data
  * React for displaying UI components

## Note 

  * This repo is just backend of website. You need frontend also. Go here for frontend -> https://github.com/HeT-Delwadiya/PC-Parts-E-commerce-Website-Frontend.

## Demo

This application is deployed on Heroku. Please check it out :smile: https://pcparts-shop.herokuapp.com/.

* Admin:      Email- admin@admin.net  |  password- admin123
* User:         Email- user@test.com  |  password- user123

## Install

Some basic Git commands are:

```
$ git clone https://github.com/HeT-Delwadiya/PC-Parts-E-commerce-Website-Backend.git
$ cd project
$ npm install
```

## Setup

```
 Create .env file that include:

  * DB_URL=YOUR_MONGO_DB_URL
  * PORT=8000
  * SECRET=Token Secret for jsonwebtoken
  * BRAINTREE_MERCHANTID=wfk38vzhkz6ypwd7
  * BRAINTREE_PUBLIC_KEY=6q7n7t4qb76kfpyh
  * BRAINTREE_PRIVATE_KEY=f5b9e302a68d6dbff67d8b649aecb6d9
```

## Heroku Deployment

```
> Create a Procfile in the root directory of your application with the following command **web: npm run start:production**
```


## Simple build for production

```
$ npm run production
```

## Run the application for development

```
$ npm start
```

## Run the application for production

```
$ npm run start:production
```

## Languages & tools

- [Node](https://nodejs.org/en/)

- [Express](https://expressjs.com/)

- [Mongoose](https://mongoosejs.com/)

- [React](https://reactjs.org/)


