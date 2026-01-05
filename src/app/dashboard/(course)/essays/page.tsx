import { cookies } from "next/headers";

export default async function MyEssays() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")!;

  return (
    <div>
      <div>Course Essays Page / MyEssays</div>
      <div>Token: {token.value}</div>
    </div>
  );
}
