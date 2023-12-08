/* eslint-disable no-lone-blocks */
/* eslint-disable prefer-const */
/* eslint-disable new-cap */
/* eslint-disable max-len */
/* eslint-disable indent */
/* eslint-disable quotes */
/* eslint-disable linebreak-style */
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { initializeApp } = require("firebase-admin/app");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(
  bodyParser.urlencoded({ extended: true }));
initializeApp();

app.use(bodyParser.json());
app.use(express.static("./bookfreak-project/public"));
app.use(express.json());
app.use(cors({ origin: true }));
const Stripe = require("stripe");
const { increment } = require("firebase/database");
const { Convert } = require("easy-currencies");
app.use(express.json());
const stripe = Stripe(process.env.REACT_APP_STRIPE_SEC_CLIENT);
const convertToYourCurrenct = async (amount, yourCurrency) => {
  return await Convert().amount(amount).from('USD').to((yourCurrency).toUpperCase());
};

app.post('/getBalance', async (req, res) => {
const balance = await stripe.balance.retrieve({
  stripeAccount: req.body.accountId,
});


  res.send(balance);
});
app.post("/createStripeCheckout", async (req, res) => {
  try {
    const { price, quantity, customerCurrency, destinationId } = req.body;

    const createdCustomer = await stripe.customers.create({
      name: req.body.customer.id,
      metadata: { ...req.body.customer, customerCurrency },
    });

    console.log("Created Customer:", createdCustomer);

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
      payment_intent_data: {
        transfer_data: {
          destination: destinationId,
        },
      },
    });

    console.log("Created Session:", session);

    res.json({ clientSecret: session.client_secret, sessioned: session });
  } catch (error) {
    console.log(error);
    console.error("Error creating checkout session:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

let whSec;
whSec = process.env.REACT_APP_WEBHOOK_SEC_KEY;

app.post("/createAccount", async (req, res) => {
  try {
    const account = await stripe.accounts.create({
      type: "express",
      settings: {
      payouts: {
        schedule: {
          interval: 'manual',
        },
      },
    },
      metadata: req.body.accountData,
    });
    res.send(account);
  } catch (err) {
    console.log(err);
  }
});

app.post("/createAccountLink", async (req, res) => {
  try {
    const { accountId } = req.body;
    const accountLinkObject = await stripe.accountLinks.create({
      account: accountId,
      type: "account_onboarding",
      refresh_url: `http://localhost:3000`,
      return_url: "http://localhost:3000",
    });


    res.send({ accountLinkObject });
  } catch (error) {
    console.log(error);
  }
});

app.post('/createTransferToWinner', async (req, res) => {
  try {
  const { destinationId, amount, currency, organizatorId } = req.body;
  console.log(destinationId, currency);

 await stripe.charges.create({
  amount: amount,
  currency: currency,
  source: organizatorId,
});

 const transfer = await stripe.transfers.create(
  {
    amount: amount,
    currency: currency,
    destination: destinationId,
   });

    console.log(transfer);
    res.sendStatus(200).end();
  } catch (err) {
    res.send(400).end();
    console.log(err);
    }
});

app.post('/createPayout', async (req, res) => {
  try {
const { amount, currency, destinationAccount, userId } = req.body;
    console.log(destinationAccount, userId);
  const payout = await stripe.payouts.create({
    amount: amount,
    currency: currency,
  }, {
    stripeAccount: userId,
  });
    console.log(payout);
  res.send(payout);
} catch (err) {
    console.log(err);
}
});

app.post("/webhook", bodyParser.raw({ type: "*/*" }), async (req, res) => {
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, req.headers["stripe-signature"], whSec);

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
      paymentObject.clientSecret = event.data.object.client_secret;
      }

      if (paymentCustomer) {
        paymentObject.email = paymentCustomer.email;
        paymentObject.nickname = paymentCustomer.metadata.nickname;
        paymentObject.boughtOption =
          paymentCustomer.metadata.selectedOptionName;
        paymentObject.topUp = parseInt(paymentCustomer.metadata.boughtOption);
        paymentObject.customerAppId = paymentCustomer.metadata.id;
        paymentObject.customerId = paymentCustomer.id;
        paymentObject.amount = paymentCustomer.metadata.priceInNumber;
      }
      if (event.type === "checkout.session.completed") {
        paymentObject.paymentId = event.data.object.id;
        paymentObject.paymentIntentId = event.data.object.payment_intent;
        const paymentIntentObject = await stripe.paymentIntents.retrieve(event.data.object.payment_intent);
            const paymentAmountConverted = await convertToYourCurrenct(paymentObject.amount, paymentCustomer.metadata.customerCurrency) * 100;

        console.log("converted", Math.round(paymentAmountConverted), "converted");
        const invoice = await stripe.invoices.retrieve(event.data.object.invoice);

  await admin
          .database()
          .ref(`users/${paymentObject.customerAppId}`)
    .update({ creditsAvailable: { coins: increment(paymentObject.topUp), valueInMoney: increment(Math.round(paymentAmountConverted)), currency: paymentCustomer.metadata.customerCurrency } });

        await admin
          .database()
          .ref(`payments/${paymentObject.customerAppId}`)
          .push({
            ...paymentObject,
            purchasedAt: event.data.object.created,
            clientSecret: paymentIntentObject.client_secret,
            currency: paymentIntentObject.currency,
            receipt: {
              receiptURL: invoice.hosted_invoice_url,
              receiptPDF: invoice.invoice_pdf,
              status: invoice.status,
            },
          });
      }
    }
} catch (error) {
    console.error(error);
    console.log("Webhook failed");
     res.status(400).send("Webhook failed").end();
  }
});


app.post(
  "/accountWebhook",
  bodyParser.raw({ type: "*/*" }),
  async (req, res) => {
    let event;
    try {
      event = stripe.webhooks.constructEvent( req.rawBody, req.headers["stripe-signature"], whSec);

      if (event.type === "account.updated") {
        await admin
          .database()
          .ref(`users/${event.data.object.metadata.id}/stripeAccountData`)
          .update(event.data.object);
         await admin.database().ref(`users/${event.data.object.metadata.id}/accountLinkObject`).remove();
      }
       res.status(200).end();
    } catch (err) {
      console.log(err);
      res.status(400).end();
    }
  },
);

exports.stripeFunctions = functions.runWith({ memory: '4GB', timeoutSeconds: 360 }).https.onRequest(app);
