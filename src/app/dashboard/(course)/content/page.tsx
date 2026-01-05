import { cookies } from "next/headers";

export default async function MyContent() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")!;

  return (
    <div>
      <div>Course Content Page / MyContent</div>
      <div>Token: {token.value}</div>
    </div>
  );
}
