import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import Link from "next/link"
import PlanSubscription from "./plan-subscription"

export default async function Page() {
  const supabase = createClient();
  const { data: userData, error } = await supabase.auth.getUser()
  if (error || !userData?.user) {
    redirect('/login')
  }

  const { data: customer, error: getCustomerError } = await supabase
    .from("customers")
    .select()
    .eq("user_id", userData.user.id)
    .single()
  if (getCustomerError) {
    console.log(getCustomerError);
  }

  return (
    <div className="bg-background text-foreground p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Billing</h1>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <section className="space-y-6 my-8">
              <div>
                <h2 className="text-xl font-semibold">Pay as you go</h2>
                <div className="mt-2 text-muted-foreground max-w-xl">
                  We will charge your payment method for each image keyword generation completed. This allows you to truly only pay for what you use.
                </div>
              </div>
              {customer?.subscription_status === "ACTIVE" ?
                <div className="flex space-x-4">
                  <Link href={encodeURI(`https://billing.stripe.com/p/login/test_5kA4iOcgk6fAaU8bII?prefilled_email=${userData.user.email}`)}>
                    <Button variant="default">Manage plan</Button>
                  </Link>
                </div>
                :
                <div className="flex space-x-4">
                  <PlanSubscription />
                </div>
              }
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}