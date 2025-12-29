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
    case "STUDENT":
      return <StudentDashboard user={user} />;
    case "TEACHER":
      return <TeacherDashboard user={user} />;
    case "ADMIN":
      return <AdminDashboard user={user} />;
    case "SUPERADMIN":
      return <SuperAdminDashboard user={user} />;
    default:
      redirect("/access-denied");
  }
}
