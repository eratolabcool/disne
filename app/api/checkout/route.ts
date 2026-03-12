import { getUserEmail, getUserUuid } from "@/services/user";
import { insertOrder, updateOrderSession } from "@/models/order";
import { respData, respErr } from "@/lib/resp";

import { Order } from "@/types/order";
import { findUserByUuid } from "@/models/user";
import { getSnowId } from "@/lib/hash";
import type StripeType from "stripe";

export async function POST(req: Request) {
  try {
    const {
      credits,
      currency,
      amount,
      interval,
      product_id,
      product_name,
      valid_months,
      cancel_url,
    } = await req.json();

    const finalCancelUrl =
      cancel_url ||
      `${process.env.NEXT_PUBLIC_PAY_CANCEL_URL || process.env.NEXT_PUBLIC_WEB_URL}`;

    if (!amount || !interval || !currency || !product_id) {
      return respErr("invalid params");
    }

    if (!["year", "month", "one-time"].includes(interval)) {
      return respErr("invalid interval");
    }

    const is_subscription = interval === "month" || interval === "year";

    if (interval === "year" && valid_months !== 12) {
      return respErr("invalid valid_months");
    }

    if (interval === "month" && valid_months !== 1) {
      return respErr("invalid valid_months");
    }

    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return respErr("no auth, please sign-in");
    }

    let user_email = await getUserEmail();
    if (!user_email) {
      const user = await findUserByUuid(user_uuid);
      if (user) {
        user_email = user.email;
      }
    }
    if (!user_email) {
      return respErr("invalid user");
    }

    const order_no = getSnowId();

    const currentDate = new Date();
    const created_at = currentDate.toISOString();

    let expired_at = "";

    const timePeriod = new Date(currentDate);
    timePeriod.setMonth(currentDate.getMonth() + valid_months);

    const timePeriodMillis = timePeriod.getTime();
    let delayTimeMillis = 0;

    // subscription
    if (is_subscription) {
      delayTimeMillis = 24 * 60 * 60 * 1000; // delay 24 hours expired
    }

    const newTimeMillis = timePeriodMillis + delayTimeMillis;
    const newDate = new Date(newTimeMillis);

    expired_at = newDate.toISOString();

    const order: Order = {
      order_no,
      created_at,
      user_uuid,
      user_email,
      amount,
      interval,
      expired_at,
      status: "created",
      credits,
      currency,
      product_id,
      product_name,
      valid_months,
    };
    await insertOrder(order);

    // Lazy load Stripe to avoid bundling issues
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || "");

    const options: StripeType.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: product_name,
            },
            unit_amount: amount,
            recurring: is_subscription
              ? {
                  interval: interval as "month" | "year",
                }
              : undefined,
          },
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
      metadata: {
        project: process.env.NEXT_PUBLIC_PROJECT_NAME || "",
        product_name: product_name,
        order_no: order_no.toString(),
        user_email: user_email,
        credits: credits,
        user_uuid: user_uuid,
      },
      mode: is_subscription ? "subscription" : "payment",
      success_url: `${process.env.NEXT_PUBLIC_WEB_URL}/pay-success/{CHECKOUT_SESSION_ID}`,
      cancel_url: finalCancelUrl,
    };

    if (user_email) {
      options.customer_email = user_email;
    }

    if (is_subscription) {
      options.subscription_data = {
        metadata: options.metadata,
      };
    }

    if (currency === "cny") {
      options.payment_method_types = ["wechat_pay", "alipay", "card"];
      options.payment_method_options = {
        wechat_pay: {
          client: "web",
        },
        alipay: {},
      };
    }

    const order_detail = JSON.stringify(options);

    const session = await stripe.checkout.sessions.create(options);

    const stripe_session_id = session.id;
    await updateOrderSession(order_no, stripe_session_id, order_detail);

    return respData({
      public_key: process.env.STRIPE_PUBLIC_KEY,
      order_no: order_no,
      session_id: stripe_session_id,
    });
  } catch (e: unknown) {
    if (e instanceof Error) {
      return respErr("checkout failed: " + e.message);
    }
    return respErr("checkout failed");
  }
}
