/**
 * v0 by Vercel.
 * @see https://v0.dev/t/uPDCdPuGAix
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Check } from "lucide-react"

export default function Component() {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Billing</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Metered Billing</h2>
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Usage-Based Plan</h3>
              <span className="text-primary-500 font-medium">$0.05/unit</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Your current metered billing plan charges you based on your usage:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Check className="w-5 h-5 inline-block mr-2 text-primary-500" />
                Pay-as-you-go pricing
              </li>
              <li>
                <Check className="w-5 h-5 inline-block mr-2 text-primary-500" />
                No fixed monthly fees
              </li>
              <li>
                <Check className="w-5 h-5 inline-block mr-2 text-primary-500" />
                Detailed usage reports
              </li>
            </ul>
            <div className="mt-6">
              <Button>View Usage</Button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Payment Method</h2>
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium">Visa Card</h3>
                <p className="text-muted-foreground">Ending in 4532</p>
              </div>
              <Button variant="outline">Update</Button>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 mt-4">
            <h2 className="text-xl font-bold mb-4">Payment History</h2>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-muted text-muted-foreground">
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Amount</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-2">June 15, 2023</td>
                    <td className="px-4 py-2">$42.50</td>
                    <td className="px-4 py-2">
                      <Badge variant="success">Paid</Badge>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2">May 15, 2023</td>
                    <td className="px-4 py-2">$37.80</td>
                    <td className="px-4 py-2">
                      <Badge variant="success">Paid</Badge>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2">April 15, 2023</td>
                    <td className="px-4 py-2">$29.15</td>
                    <td className="px-4 py-2">
                      <Badge variant="success">Paid</Badge>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2">March 15, 2023</td>
                    <td className="px-4 py-2">$33.90</td>
                    <td className="px-4 py-2">
                      <Badge variant="success">Paid</Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Update Payment Method</h2>
        <div className="bg-white shadow-md rounded-lg p-6">
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="card-number">Card Number</Label>
                <Input id="card-number" type="text" placeholder="Enter your card number" />
              </div>
              <div>
                <Label htmlFor="expiration-date">Expiration Date</Label>
                <div className="flex gap-4">
                  <Select>
                    <SelectTrigger id="expiration-month">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="01">January</SelectItem>
                      <SelectItem value="02">February</SelectItem>
                      <SelectItem value="03">March</SelectItem>
                      <SelectItem value="04">April</SelectItem>
                      <SelectItem value="05">May</SelectItem>
                      <SelectItem value="06">June</SelectItem>
                      <SelectItem value="07">July</SelectItem>
                      <SelectItem value="08">August</SelectItem>
                      <SelectItem value="09">September</SelectItem>
                      <SelectItem value="10">October</SelectItem>
                      <SelectItem value="11">November</SelectItem>
                      <SelectItem value="12">December</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger id="expiration-year">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                      <SelectItem value="2027">2027</SelectItem>
                      <SelectItem value="2028">2028</SelectItem>
                      <SelectItem value="2029">2029</SelectItem>
                      <SelectItem value="2030">2030</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" type="text" placeholder="Enter your CVC" />
              </div>
            </div>
            <div className="mt-6">
              <Button type="submit">Update Payment Method</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}