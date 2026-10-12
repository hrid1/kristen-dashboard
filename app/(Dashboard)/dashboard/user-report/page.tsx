import { redirect } from "next/navigation";

export default function UserReportPage() {
  redirect("/dashboard/report?tab=user-report");
}
