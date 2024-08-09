import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <Alert variant="destructive" className="max-w-lg">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Contact us!</AlertTitle>
        <AlertDescription>
          Something went wrong 🥲
        </AlertDescription>
      </Alert>
    </div>
  )
}