import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const secret = process.env.STRIPE_WEBHOOK_SECRET || "";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req: Request) {
  // req.headers.append()

  try {
    const body = await req.text();
    const signature = headers().get("stripe-signature");
    const event = stripe.webhooks.constructEvent(body, signature, secret);
    
    if (event.type === "setup_intent.succeeded") {
      const customerId = event.data.object.customer
      await updateSubscriptionStatus("COMPLETED", customerId);
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

async function updateSubscriptionStatus(status: "INCOMPLETE" | "COMPLETED" | null | undefined, customerId: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_SECRET!
  );

  const { error: updateError } = await supabase
    .from('customers')
    .update({ subscription_status: status })
    .eq('stripe_customer_id', customerId)
  if (updateError) {
    console.log(updateError);
  }
}