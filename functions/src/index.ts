import { onRequest } from "firebase-functions/v2/https";
import * as functions from "firebase-functions/v2";
import { logger } from "firebase-functions";
import Razorpay from "razorpay";
import cors from "cors";

// Initialize CORS (allow calls from your app’s origin)
const corsHandler = cors({ origin: true });

export const createRazorpayOrder = onRequest({ secrets: ["RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET"] }, async (req, res) => {
    return corsHandler(req, res, async () => {
        try {
            // Read amount and currency from request body
            const { amount, currency = "INR", receipt } = req.body;
            if (!amount || typeof amount !== "number") {
                return res.status(400).json({ error: "Invalid amount" });
            }

            // Initialize Razorpay client using env config
            const razorpay = new Razorpay({
                key_id: process.env.RAZORPAY_KEY_ID || functions.config().razorpay.key_id,
                key_secret: process.env.RAZORPAY_KEY_SECRET || functions.config().razorpay.key_secret,
            });

            // Create order
            const order = await razorpay.orders.create({
                amount: amount * 100, // amount in paise
                currency,
                receipt: receipt || `rcpt_${Date.now()}`,
            });

            logger.info("Razorpay order created", order);
            return res.status(200).json({ orderId: order.id, ...order });
        } catch (err: any) {
            logger.error("Error creating Razorpay order", err);
            return res.status(500).json({ error: err.message });
        }
    });
});
