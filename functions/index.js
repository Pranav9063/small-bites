const functions = require("firebase-functions");
const Razorpay = require("razorpay");
const dotenv = require("dotenv");

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createRazorpayOrder = functions.https.onCall(async (data, context) => {
  try {
    const {amount, currency, receipt, notes} = data;

    const order = await razorpay.orders.create({
      amount: amount,
      currency: currency,
      receipt: receipt,
      notes: notes,
    });

    console.log("Razorpay Order Created:", order);
    return {orderId: order.id};
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw new functions.https.HttpsError(
        "internal",
        "Failed to create Razorpay order",
        error,
    );
  }
});
