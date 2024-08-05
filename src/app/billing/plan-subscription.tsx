"use client"

import { Button } from "@/components/ui/button"
import { createCustomer, createSubscription } from "./actions"
import { useTransition } from "react"
import { Loader2 } from "lucide-react"

export default function PlanSubscription() {
  const [isPending, startTransition] = useTransition()

  return (
    <form action={() => {
      startTransition(async () => {
        await createCustomer()
        await createSubscription()
      })
    }}>
      {isPending ?
        <Button variant="default" disabled={true} className="w-36">
          <Loader2 className="animate-spin" />
        </Button>
        :
        <Button variant="default" className="w-36">
          Start Keywording
        </Button>
      }
    </form>
  )
}