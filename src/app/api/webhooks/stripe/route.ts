import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const secret = process.env.STRIPE_WEBHOOK_SECRET || "";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_SECRET!
);

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get("stripe-signature");
    const event = stripe.webhooks.constructEvent(body, signature, secret);

    if (event.type === "customer.subscription.deleted") {
      const customerId = event.data.object.customer;
      const { error: updateError } = await supabase
        .from("customers")
        .update({
          stripe_subscription_id: null,
          subscription_status: event.data.object.status.toUpperCase(),
        })
        .eq("stripe_customer_id", customerId);
      if (updateError) {
        console.log(updateError);
      }
    }

    if (event.type === "customer.subscription.updated") {
      const customerId = event.data.object.customer;
      updateSubscriptionStatus(customerId, event.data.object.status.toUpperCase());
    }
    if (event.type === "customer.subscription.paused") {
      const customerId = event.data.object.customer;
      updateSubscriptionStatus(customerId, event.data.object.status.toUpperCase());
    }
    if (event.type === "customer.subscription.resumed") {
      const customerId = event.data.object.customer;
      updateSubscriptionStatus(customerId, event.data.object.status.toUpperCase());
    }

    return Response.json({ result: event, ok: true });
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        message: "something went wrong",
        ok: false,
      },
      { status: 500 }
    );
  }
}

const updateSubscriptionStatus = async (customerId: string, status: string) => {
  console.log(status)
  const { error: updateError } = await supabase
    .from("customers")
    .update({
      subscription_status: status,
    })
    .eq("stripe_customer_id", customerId);
  if (updateError) {
    console.error(updateError);
  }
};
