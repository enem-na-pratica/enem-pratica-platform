import { cookies } from "next/headers";
import { LogoutButton } from "@/src/ui/components/logout-button";
import { redirect } from "next/navigation";
import {
  AdminDashboard,
  StudentDashboard,
  SuperAdminDashboard,
  TeacherDashboard,
} from "@/src/ui/pages/dashboard";
import { makeGetUser } from "@/src/ui/application/fatories/user/get-user.factory";

export default async function Dashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token");

  if (!token) redirect("/login"); // This should never need to run.

  const user = await makeGetUser().getUser(token.value);

  if (!user) redirect("/login");

  const renderDashboard = () => {
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
        return redirect("/access-denied");
    }
  };

  return (
    <main className="container-center">
      <header className="w-full flex justify-between items-center p-4 border-b">
        <h1>Bem-vindo, {user.name}</h1>
        <LogoutButton />
      </header>
      <div className="mt-4">{renderDashboard()}</div>
    </main>
  );
}
