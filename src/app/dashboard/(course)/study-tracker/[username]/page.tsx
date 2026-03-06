import { cookies } from "next/headers";

export default async function UserContent({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")!;

  const { username } = await params;

  return (
    <div>
      <div>Course Content Page / UserContent</div>
      <div>Token: {token.value}</div>
      <div>Username: {username}</div>
    </div>
  );
}
