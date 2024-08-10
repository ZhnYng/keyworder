"use client"

import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { useState, useTransition } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function Page({
  params
}: {
  params: { secret: string }
}) {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-4xl flex-col justify-center items-center h-full">
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret: params.secret,
        }}
      >
        <div className="mx-auto space-y-8 mb-2">
          <h1 className="text-2xl font-bold mb-4">Billing</h1>
          <div className="space-y-2">
            <h1 className="text-lg mb-1">Focus on photography and leave the menial jobs to us.</h1>
            <p className="text-muted-foreground">Fill in your preferred transaction method.</p>
          </div>
        </div>
        <SetupForm />
      </Elements>
    </div>
  );
};

const SetupForm = () => {
  const [isPending, startTransition] = useTransition();
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return
    }

    const { error } = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_URL}/billing/payment-setup/complete`,
      },
    });

    if (error) {
      setErrorMessage(error.message!);
    }
  };

  return (
    <form onSubmit={(event) => startTransition(() => handleSubmit(event))} className="space-y-4">
      <PaymentElement />
      {errorMessage &&
        <p className="mt-2 text-sm font-medium text-red-500" key={errorMessage}>
          {errorMessage}
        </p>
      }
      {isPending ?
        <Button disabled={true} className="w-20">
          <Loader2 className="animate-spin" size={24} />
        </Button>
        :
        <Button disabled={!stripe} className="w-20">Submit</Button>
      }
    </form>
  )
};