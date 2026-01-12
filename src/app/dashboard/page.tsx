import { redirect } from "next/navigation";
import {
  AdminDashboard,
  StudentDashboard,
  TeacherDashboard,
  SuperAdminDashboard,
} from "@/src/ui/pages/dashboard";
import { UserModel } from "@/src/services/api/models";
import { ROLES } from "@/src/ui/constants";
import { makeUserService } from "@/src/services/api/factories";

export default async function Dashboard() {
  let user: UserModel;
  try {
    user = await makeUserService().getMe();
  } catch {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-xl">
          O sistema está temporariamente indisponível. Por favor, tente mais
          tarde.
        </h1>
      </div>
    );
  }

  switch (user.role) {
    case ROLES.STUDENT:
      return <StudentDashboard user={user} />;
    case ROLES.TEACHER:
      return <TeacherDashboard user={user} />;
    case ROLES.ADMIN:
      return <AdminDashboard user={user} />;
    case ROLES.SUPER_ADMIN:
      return <SuperAdminDashboard user={user} />;
    default:
      redirect("/access-denied");
  }
}
