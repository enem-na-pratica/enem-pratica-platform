import { cookies } from "next/headers";

export default async function UserToBeReviewed({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")!;

  const { username } = await params;

  return (
    <div>
      <div>Course To Be Reviewed Page / MyToBeReviewed</div>
      <div>Token: {token.value}</div>
      <div>Username: {username}</div>
    </div>
  );
}
