import { redirect } from "next/navigation";

export default function AppReportPage() {
  redirect("/dashboard/report?tab=app-report");
}
