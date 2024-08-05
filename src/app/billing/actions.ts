"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function createCustomer() {
  const supabase = createClient();
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("customers")
    .select()
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) {
    console.error(error);
    redirect("/error");
  }

  if (!data?.stripe_customer_id) {
    const customer = await stripe.customers.create({
      email: user.email,
    });

    const { error } = await supabase.from("customers").upsert({
      user_id: user.id,
      stripe_customer_id: customer.id,
      subscription_status: "INCOMPLETE",
    });
    if (error) {
      console.error(error);
      redirect("/error");
    }

    return customer.id;
  } else {
    return data.stripe_customer_id;
  }
}

export async function createSubscription() {
  const supabase = createClient();
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("customers")
    .select()
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) {
    console.error(error);
    redirect("/error");
  }

  if (
    data?.stripe_subscription_id &&
    data.subscription_status === "INCOMPLETE"
  ) {
    const subscription = await stripe.subscriptions.retrieve(
      data.stripe_subscription_id
    )

    if (!subscription.pending_setup_intent) {
      redirect("/error");
    }

    const setupIntent = await stripe.setupIntents.retrieve(
      subscription.pending_setup_intent
    )

    redirect(
      `/billing/payment-setup/${setupIntent.client_secret}`
    );
  } else if (!data?.stripe_subscription_id) {
    const subscription = await stripe.subscriptions.create({
      customer: data?.stripe_customer_id,
      items: [
        {
          price: "price_1PhghOCPvTaRk10FFbfOEqFt",
        },
      ],
      expand: ["pending_setup_intent"],
      payment_settings: {
        save_default_payment_method: "on_subscription"
      }
    });

    const { error: updateSubscriptionError } = await supabase
      .from("customers")
      .update({
        stripe_subscription_id: subscription.id,
      })
      .eq("user_id", user.id);
    if (updateSubscriptionError) {
      console.error(updateSubscriptionError);
      redirect("/error");
    }

    redirect(
      `/billing/payment-setup/${subscription.pending_setup_intent.client_secret}`
    );
  } else {
    redirect("/billing");
  }
}
