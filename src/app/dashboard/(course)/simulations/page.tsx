import { cookies } from "next/headers";

export default async function MySimulations() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")!;

  return (
    <div>
      <div>Course Simulations Page / MySimulations</div>
      <div>Token: {token.value}</div>
    </div>
  );
}
