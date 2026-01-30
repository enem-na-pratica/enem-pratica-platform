import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import { User, makeUserService } from "@/src/web/api";
import { ROLES } from "@/src/web/config";

const AdminDashboard = dynamic(() =>
  import("@/src/web/view").then((mod) => mod.AdminDashboard),
);
const StudentDashboard = dynamic(() =>
  import("@/src/web/view").then((mod) => mod.StudentDashboard),
);
const TeacherDashboard = dynamic(() =>
  import("@/src/web/view").then((mod) => mod.TeacherDashboard),
);
const SuperAdminDashboard = dynamic(() =>
  import("@/src/web/view").then((mod) => mod.SuperAdminDashboard),
);

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  let user: User;
  try {
    user = await makeUserService().getAuthenticated();
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
      const params = await searchParams;
      return <AdminDashboard user={user} params={params} />;
    case ROLES.SUPER_ADMIN:
      return <SuperAdminDashboard user={user} />;
    default:
      redirect("/access-denied");
  }
}
