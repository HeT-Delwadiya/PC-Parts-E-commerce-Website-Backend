const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANTID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY
});

exports.getToken = (req, res) => {
     gateway.clientToken.generate({}, function(err, response) {
               if(err)
                    return res.status(500).send(err);
               else
                    return res.send(response)
        });
}

exports.processPayment = (req, res) => {
     let amountFromClient = req.body.amount;
     let nonceFromTheClient = req.body.paymentMethodNonce;

     gateway.transaction.sale({
          amount: amountFromClient,
          paymentMethodNonce: nonceFromTheClient,

          options: {
            submitForSettlement: true
          }
        }, function(err, result) {
               if(err)
                    return res.status(500).send(err);
               else
                    return res.send(result);
        });
}