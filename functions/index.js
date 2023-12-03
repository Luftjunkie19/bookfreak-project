/* eslint-disable prefer-const */
/* eslint-disable new-cap */
/* eslint-disable max-len */
/* eslint-disable indent */
/* eslint-disable quotes */
/* eslint-disable linebreak-style */
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const functions = require("firebase-functions");
const admin = require('firebase-admin');
const { initializeApp } = require("firebase-admin/app");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(bodyParser.urlencoded({
  extended: true,
}));
initializeApp();

app.use(bodyParser.json());
app.use(express.static("./bookfreak-project/public"));
app.use(express.json());
app.use(cors({ origin: true }));
const Stripe = require("stripe");
app.use(express.json());
const stripe = Stripe(process.env.REACT_APP_STRIPE_SEC_CLIENT);


app.post('/createStripeCheckout', async (req, res) => {
  try {
    const { price, quantity } = req.body;

    const createdCustomer = await stripe.customers.create({
      name: req.body.customer.id,
      metadata: req.body.customer,
    });

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      mode: "payment",
      line_items: [{ price, quantity }],
      customer: createdCustomer.id,
       invoice_creation: {
        enabled: true,
      },
      return_url: "http://localhost:3000",
      payment_method_configuration: "pmc_1OH8ZAL8z1e5mvb67NMMunj5",
    });
    res.json({ clientSecret: session.client_secret, sessioned: session });
    console.log(session);
  } catch (error) {
    console.log(req.body);
    console.log(error);
    console.error("Error creating checkout session:", error.message);
  }
});
let whSec;
whSec = process.env.REACT_APP_WEBHOOK_SEC_KEY;
app.post('/webhook', bodyParser.raw({ type: "*/*" }), async (req, res) => {
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      req.headers["stripe-signature"],
      whSec,
    );

    if (event) {
const paymentObject = {
        amount: null,
        paymentId: null,
        paymentIntentId: null,
        customerId: null,
        email: null,
        nickname: null,
        boughtOption: null,
        topUp: 0,
        customerAppId: null,
        receiptURL: null,
      };

      let paymentCustomer;


      if (event.data.object.customer) {
        paymentCustomer = await stripe.customers.retrieve(event.data.object.customer);
      }

      if (paymentCustomer && event.data.object.client_secret !== undefined) {
        console.log(event.data.object.client_secret);
        paymentObject.clientSecret = event.data.object.client_secret;
      }


      if (paymentCustomer) {
        paymentObject.email = paymentCustomer.email;
        paymentObject.nickname = paymentCustomer.metadata.nickname;
        paymentObject.boughtOption = paymentCustomer.metadata.selectedOptionName;
        paymentObject.topUp = parseInt(paymentCustomer.metadata.boughtOption);
        paymentObject.customerAppId = paymentCustomer.metadata.id;
        paymentObject.customerId = paymentCustomer.id;
        paymentObject.amount = +paymentCustomer.metadata.priceInNumber;
      }
      if (event.type === "checkout.session.completed") {
        paymentObject.paymentId = event.data.object.id;
        paymentObject.paymentIntentId = event.data.object.payment_intent;
        const paymentIntentObject = await stripe.paymentIntents.retrieve(event.data.object.payment_intent);

         const invoice = await stripe.invoices.retrieve(event.data.object.invoice);
        console.log(invoice);
        await admin.database().ref(`payments/${paymentObject.customerAppId}`).push({
          ...paymentObject, purchasedAt: event.data.object.created, clientSecret: paymentIntentObject.client_secret, currency: paymentIntentObject.currency, receipt: {
            receiptURL: invoice.hosted_invoice_url,
            receiptPDF: invoice.invoice_pdf,
          } });
      }

      return res.status(200).end();
    }
  } catch (error) {
    console.error(error);
    console.log("Webhook failed");
    return res.status(400).send('Webhook failed');
  }
});


exports.stripeFunctions = functions.https.onRequest(app);

