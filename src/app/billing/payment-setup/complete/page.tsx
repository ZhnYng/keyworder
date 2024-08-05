"use client"
import React, { useState, useEffect } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import { record } from 'zod';
import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { createClient } from '@/utils/supabase/client';
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function Page() {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-6xl flex justify-center items-center">
      <Elements
        stripe={stripePromise}
      >
        <SetupStatus />
      </Elements>
    </div>
  );
};

const SetupStatus = () => {
  const stripe = useStripe();
  const router = useRouter();
  const searchParams = useSearchParams()
  const clientSecret = searchParams.get('setup_intent_client_secret')
  const [status, setStatus] = useState('');

  React.useEffect(() => {
    if (!stripe) {
      return;
    }

    stripe
      .retrieveSetupIntent(clientSecret!)
      .then(({ setupIntent }) => {
        switch (setupIntent!.status) {
          case 'succeeded':
            setStatus('SUCCESS');
            toast({
              variant: "default",
              title: "Success! Your payment method has been saved.",
            });
            router.push('/billing')
            break

          case 'processing':
            setStatus('PROCESSING');
            toast({
              variant: "default",
              title: "Processing payment details. Come back and check in a few minutes for it to complete.",
            });
            router.push('/billing')
            break;

          case 'requires_payment_method':
            setStatus('ERROR');
            toast({
              variant: "destructive",
              title: "Failed to process payment details. Please try another payment method.",
            });
            router.push(`/billing/payment-setup/${clientSecret}`)
            break;
        }
      });
  }, [stripe]);

  return (
    <div className="flex gap-2">
      <Loader2 className='animate-spin'/>
      <p className="text-lg text-gray-700">Redirecting...</p>
    </div>
  )
}