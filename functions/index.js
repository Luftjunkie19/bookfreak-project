/* eslint-disable no-unused-expressions */
/* eslint-disable max-len */
/* eslint-disable new-cap */
require("dotenv").config();
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {initializeApp} = require("firebase-admin/app");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
initializeApp();
app.use(express.static("./bookfreak-project/public"));
app.use(cors({origin: true}));
// eslint-disable-next-line max-len
const stripe = require("stripe")(`${process.env.REACT_APP_STRIPE_SEC_KEY}`);
app.use(express.json());
app.use(bodyParser.json());
const {increment} = require("firebase/database");
const {Convert} = require("easy-currencies");


const convertToYourCurrenct = async (amount, yourCurrency) => {
  return await Convert()
      .amount(amount)
      .from("USD")
      .to(yourCurrency.toUpperCase());
};

const convertMoneyFromTo = async (amount, yourCurrency, winnersCurrency) => {
  return await Convert().amount(amount)
      .from(yourCurrency.toUpperCase())
      .to(winnersCurrency.toUpperCase());
};

exports.getBalance=functions.https.onCall(async (req)=>{
  const balance = await stripe.balance.retrieve({
    stripeAccount: req.accountId,
  });
  return balance;
});


exports.createStripeCheckout=functions.https.onCall(async (req)=>{
  try {
    const {price, quantity, customerCurrency, destinationId, customer} = req;
    console.log("Customer Object");
    console.log(customer);
    console.log("Customer Object");
    const createdCustomer = await stripe.customers.create({
      name: req.customer.id,
      metadata: {...req.customer, customerCurrency},
    });
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      mode: "payment",
      line_items: [{price, quantity}],
      customer: createdCustomer.id,
      invoice_creation: {
        enabled: true,
      },
      return_url: "https://bookfreak.org",
      payment_method_configuration: "pmc_1OH8UDL8z1e5mvb6pg8zlaau",
      payment_intent_data: {
        transfer_data: {
          destination: destinationId,
          amount: customer.boughtOption - (25 + Math.round(customer.boughtOption * 0.075)),
        },
      },
    });
    console.log("Created Session:", session);
    return {
      clientSecret: session.client_secret,
      sessioned: session,
      error: null,
    };
  } catch (error) {
    console.log(error);
    console.error("Error creating checkout session:", error.message);
    return {clientSecret: null, sessioned: null, error: error};
  }
});


const whAcc = "whsec_wnV9tFgI5eNSjw6OX3Aj3anVioGqTdLV";

exports.createAccount= functions.https.onCall(async (req)=>{
  try {
    const account = await stripe.accounts.create({
      type: "express",
      settings: {
        payouts: {
          schedule: {
            interval: "manual",
          },
        },
      },
      metadata: req.accountData,
    });
    console.log("stripeObject", account);
    return account;
  } catch (err) {
    console.log(err);
    console.log("secret key", `${process.env.REACT_APP_STRIPE_SEC_KEY}`);
    return err;
  }
});

exports.createAccountLink=functions.https.onCall(async (req)=>{
  try {
    console.log(req);
    const {accountId} = req;
    const accountLinkObject = await stripe.accountLinks.create({
      account: accountId,
      type: "account_onboarding",
      refresh_url: `https://bookfreak.org`,
      return_url: "https://bookfreak.org",
    });
    console.log("accountLinkObject", accountLinkObject);
    return {accountLinkObject};
  } catch (error) {
    console.log(error);
    return {error};
  }
});

exports.payCompetitionCharge=functions.https.onCall(async (req)=>{
  try {
    const {currency, payerId, amount, organizatorObject} = req;
    const charge = await stripe.charges.create({
      amount: amount,
      currency: currency,
      source: payerId,
    });
    console.log(charge);
    await admin
        .database()
        .ref(`users/${organizatorObject.id}/creditsAvailable`)
        .update({
          ...organizatorObject.creditsAvailable,
          valueInMoney: increment(-amount),
          balance: {
            0: {
              amount: increment(-amount),
              currency: currency,
            },
          },
        });
    return {chargeObject: charge, error: null};
  } catch (err) {
    console.log(err);
    return {error: err.message, chargeObject: null};
  }
});

exports.sendRefund=functions.https.onCall(async (req)=>{
  try {
    const {chargeId} = req;
    console.log(chargeId);
    await stripe.refunds.create({
      charge: chargeId,
    });
    return {error: null};
  } catch (err) {
    console.log(err);
    return {error: err.message};
  }
});

exports.createTransferToWinner=functions.https.onCall(async (req)=>{
  try {
    const {
      destinationId,
      amount,
      currency,
      winnerCurrency,
      winnerObject,
      chargeId,
      communityObject,
    } = req;
    const transfer = await stripe.transfers.create({
      amount: amount - Math.round(amount * 0.016),
      currency: currency,
      source_transaction: chargeId,
      destination: destinationId,
    });
    const money = await convertMoneyFromTo(amount - Math.round(amount * 0.016), currency, winnerCurrency);
    const convertedMoney = Math.round(money);
    await admin
        .database()
        .ref(`users/${winnerObject.id}/creditsAvailable`)
        .update({
          ...winnerObject.creditsAvailable,
          valueInMoney: increment(convertedMoney),
          balance: {
            0: {
              amount: increment(convertedMoney),
              currency: winnerCurrency,
            },
          },
        });
    console.log(transfer);
    await admin
        .database()
        .ref(`competitions/${communityObject.id}`)
        .update({...communityObject, prizeHandedIn: true});
    return true;
  } catch (err) {
    return {error: err.message};
  }
});

exports.createPayout=functions.https.onCall(async (req)=>{
  try {
    const {amount, currency, destinationAccount, userId, currentUserId} =
      req;
    console.log(destinationAccount, userId);
    const payout = await stripe.payouts.create(
        {
          amount: amount,
          currency: currency,
        },
        {
          stripeAccount: userId,
        },
    );

    console.log(payout);
    await admin
        .database()
        .ref(`users/${currentUserId}/creditsAvailable/balance/0`)
        .update({amount: increment(-amount)});
    await admin
        .database()
        .ref(`users/${currentUserId}/creditsAvailable`)
        .update({valueInMoney: increment(-amount)});
    return {payout};
  } catch (error) {
    return {error: error.raw.message};
  }
});


exports.removeAccount=functions.https.onCall(async (req)=>{
  try {
    await stripe.accounts.del(req.accountId);
    return true;
  } catch (err) {
    console.log(err);
  }
});


exports.createStripePaymentMobile=functions.https.onCall(async (req)=>{
  try {
    const {price, customerCurrency, destinationId, customer} = req;
    const createdCustomer = await stripe.customers.create({
      name: req.customer.id,
      metadata: {...req.customer, customerCurrency},
    });
    const empheralKeys= await stripe.ephemeralKeys.create(
        {customer: createdCustomer.id},
        {apiVersion: "2023-10-16"},
    );
    const paymentIntent= await stripe.paymentIntents.create({
      amount: price,
      currency: "USD",
      payment_method_configuration: "pmc_1OH8UDL8z1e5mvb6pg8zlaau",
      customer: createdCustomer.id,
      transfer_data: {
        destination: destinationId,
        amount: price - (25 + Math.round(price * 0.075)),
      },

    });

    return {paymentIntent: paymentIntent.client_secret, empheral: empheralKeys.secret, customer: createdCustomer.id, publishableKey: process.env.REACT_APP_STRIPE_PUBLIC_KEY, buyer: customer};
  } catch (error) {
    console.log(error);
    console.error("Error creating checkout session:", error.message);
    return {clientSecret: null, sessioned: null, error: error};
  }
});

exports.accountWebhook=functions.https.onRequest(async (req, res)=>{
  let event;
  try {
    event = stripe.webhooks.constructEvent(
        req.rawBody,
        req.headers["stripe-signature"],
        whAcc,
    );
    if (event.type === "account.updated") {
      const loginLink = await stripe.accounts.createLoginLink(
          event.data.object.id,
      );
      await admin
          .database()
          .ref(`users/${event.data.object.metadata.id}`)
          .update({linkToExpress: loginLink.url});
      await admin
          .database()
          .ref(`users/${event.data.object.metadata.id}/stripeAccountData`)
          .update(event.data.object);
      await admin
          .database()
          .ref(`users/${event.data.object.metadata.id}/accountLinkObject`)
          .remove();
    }
    return res.sendStatus(200).end();
  } catch (err) {
    console.log("webhook account failed");
    console.log(err);
    return res.status(err).end();
  }
});

exports.webhook=functions.https.onRequest(async (req, res)=>{
  let event;
  try {
    event = stripe.webhooks.constructEvent(
        req.rawBody,
        req.headers["stripe-signature"],
        "whsec_GNRrLYHmYwGfrjnF9j8L5On8Fzwl9ccU",
    );


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
      invoice: null,
    };
    let paymentCustomer;
    if (event.data.object.customer) {
      paymentCustomer = await stripe.customers.retrieve(
          event.data.object.customer,
      );
      console.log("Customer:", paymentCustomer);
    }
    if (paymentCustomer && event.data.object.client_secret !== undefined) {
      paymentObject.clientSecret = event.data.object.client_secret;
      paymentObject.paymentId = event.data.object.id;
      paymentObject.paymentIntentId = event.data.object.id;
      console.log(event.data.object.client_secret);
      console.log(event.data.object.id);
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

    if (event.data.object.invoice) {
      paymentObject.invoice=event.data.object.invoice;
    }

    if (event.type === "checkout.session.completed" || event.type === "payment_intent.succeeded") {
      console.log(event.data.object);
      const paymentIntentObject = await stripe.paymentIntents.retrieve(
          paymentObject.paymentId,
      );
      console.log("paymentObject", paymentObject);
      console.log("paymentIntentObject", paymentIntentObject);
      const paymentAmountConverted =
            (await convertToYourCurrenct(
                paymentObject.amount,
                paymentCustomer.metadata.customerCurrency,
            )) * 100;
      const balance = await stripe.balance.retrieve({
        stripeAccount: paymentCustomer.metadata.destinationId,
      });
      console.log(balance.available);
      console.log(
          "converted",
          Math.round(paymentAmountConverted),
          "converted",
      );

      await admin.database().ref(`payments/${paymentObject.customerAppId}`).push({
        ...paymentObject,
        purchasedAt: event.data.object.created,
        clientSecret: paymentIntentObject.client_secret,
        currency: paymentIntentObject.currency,
      });

      await admin
          .database()
          .ref(`users/${paymentObject.customerAppId}`)
          .update({
            creditsAvailable: {
              balance: balance.available,
              valueInMoney: Math.round(balance.available[0].amount),
              currency: paymentCustomer.metadata.customerCurrency,
            },
          });
    }
    console.log("Event finished");

    return res.sendStatus(200).end();
  } catch (error) {
    console.error(error);
    console.log("Webhook failed");
    return res.status(400).send(`Webhook failed ${error}`).end();
  }
});

exports.updateBalanceWebhook = functions.https.onRequest(async (req, res) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(
        req.rawBody,
        req.headers["stripe-signature"],
        "whsec_EpL54HxZ9RqUyFuKyIydwOcHBOa0pyje",
    );

    if (event.type === "balance.available") {
      if (event.type === "balance.available") {
        const snapshot = await admin.database().ref("users").once("value");
        const accounts = snapshot.val();

        const account = Object.values(accounts).find((a) => a.stripeAccountData.id === event.account);

        console.log("accounts", accounts, "accounts");
        console.log("account", account, "account");

        if (account) {
          await admin
              .database()
              .ref(`users/${account.id}`)
              .update({
                creditsAvailable: {
                  balance: event.data.object.available,
                  valueInMoney: Math.round(event.data.object.available[0].amount),
                  currency: event.data.object.available[0].currency,
                },
              });
        } else {
          console.log("Account not found.");
        }
      }
    }
    console.log("EVENT", event, "EVENT");

    return res.sendStatus(200).end();
  } catch (err) {
    console.log(err);
    return res.status(400).send(`Webhook failed ${err}`).end();
  }
});
