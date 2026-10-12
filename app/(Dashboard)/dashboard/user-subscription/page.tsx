import { redirect } from "next/navigation";

export default function UserSubscriptionPage() {
  redirect("/dashboard/subscription?tab=user-subscription");
}
