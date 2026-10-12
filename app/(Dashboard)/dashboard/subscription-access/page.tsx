import { redirect } from "next/navigation";

export default function SubscriptionAccessPage() {
  redirect("/dashboard/subscription?tab=subscription-access");
}
