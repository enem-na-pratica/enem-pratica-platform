import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  AdminDashboard,
  StudentDashboard,
  TeacherDashboard,
  SuperAdminDashboard,
} from "@/src/ui/pages/dashboard";
import { makeGetUser } from "@/src/ui/application/fatories/user/get-user.factory";
import { UserModel } from "@/src/ui/application/models";
import { ROLES } from "@/src/ui/constants";

export default async function Dashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token");

  if (!token) redirect("/login");

  let user: UserModel | null;
  try {
    user = await makeGetUser().getUser(token.value);
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

  if (!user) redirect("/login");

  switch (user.role) {
    case ROLES.STUDENT:
      return <StudentDashboard user={user} />;
    case ROLES.TEACHER:
      return <TeacherDashboard user={user} />;
    case ROLES.ADMIN:
      return <AdminDashboard user={user} />;
    case ROLES.SUPERADMIN:
      return <SuperAdminDashboard user={user} />;
    default:
      redirect("/access-denied");
  }
}
