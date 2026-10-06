import UserManagementTable from "@/components/Dashboard/UserManagement/UserManagemet";
import { RenderPortal } from "@/components/Reusable/RenderPortal";
// import { RenderPortal } from "@/components/Reusable/RenderPortal";


export default function UserManagement() {
  return (
    <div>
      <RenderPortal elementId='header-title' >User Management</RenderPortal>
      <UserManagementTable />
    </div>
  )
}
