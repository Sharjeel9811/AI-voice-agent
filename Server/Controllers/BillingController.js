import Stripe from 'stripe';
import dotenv from 'dotenv';
import UserModel from '../Models/UserModels.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const ENTERPRISE_PRICE = 'price_1TxRTuRl0idLvq4iSregsnBw';

function getPlanFromPriceId(priceId) {
  if (priceId === ENTERPRISE_PRICE) return 'enterprise';
  return 'premium';
}

export const CreateCheckout = async (req, res) => {
  try {
    const { priceId } = req.body;

    if (!priceId) {
      return res.status(400).json({ message: "Price ID is required" });
    }

    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      metadata: {
        userId: user._id.toString(),
        priceId: priceId,
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return res.status(500).json({ message: error.message || "Failed to create checkout session" });
  }
};

export const WebhookHandler = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody || req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;
    const priceId = session.metadata.priceId;

    if (userId) {
      var planName = getPlanFromPriceId(priceId);
      await UserModel.findByIdAndUpdate(userId, { plan: planName });
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object;
    const customer = await stripe.customers.retrieve(subscription.customer);
    const user = await UserModel.findOne({ email: customer.email });
    if (user) {
      await UserModel.findByIdAndUpdate(user._id, { plan: 'free' });
    }
  }

  res.status(200).json({ received: true });
};

export const VerifySession = async (req, res) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId) {
      return res.status(400).json({ message: "Session ID is required" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid' && session.metadata?.userId) {
      var planName = getPlanFromPriceId(session.metadata?.priceId);
      await UserModel.findByIdAndUpdate(session.metadata.userId, { plan: planName });
      const updatedUser = await UserModel.findById(session.metadata.userId);
      return res.status(200).json({ success: true, user: updatedUser });
    }

    return res.status(200).json({ success: false, message: "Payment not completed" });
  } catch (error) {
    console.error("Verify session error:", error);
    return res.status(500).json({ message: "Failed to verify payment" });
  }
};

export const GetSubscription = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const customers = await stripe.customers.list({ email: user.email });
    if (customers.data.length === 0) {
      return res.status(200).json({ subscription: null, plan: user.plan });
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customers.data[0].id,
      status: 'active',
    });

    if (subscriptions.data.length === 0) {
      return res.status(200).json({ subscription: null, plan: user.plan });
    }

    const sub = subscriptions.data[0];
    return res.status(200).json({
      subscription: {
        id: sub.id,
        status: sub.status,
        current_period_end: sub.current_period_end,
        plan: sub.items.data[0].price.id,
      },
      plan: user.plan,
    });
  } catch (error) {
    console.error("Get subscription error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
