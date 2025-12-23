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

  if (!token) redirect("/login");

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
    <main className="min-h-screen w-full pb-20">
      <header className="w-full bg-(--card-background) shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
          <h1 className="text-xl font-bold tracking-tight text-(--accent)">
            ENEM <span className="text-(--foreground)">na Prática</span>
          </h1>
          <LogoutButton />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4">{renderDashboard()}</div>
    </main>
  );
}
