import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export default function ErrorPage() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Alert variant="destructive" className="max-w-lg">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Contact us!</AlertTitle>
        <AlertDescription>
          Something went wrong 🥲 email: zzhenyyang@gmail.com
        </AlertDescription>
      </Alert>
    </div>
  )
}