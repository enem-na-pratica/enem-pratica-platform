import { cookies } from "next/headers";

export default async function MyReview() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")!;

  return (
    <div>
      <div>Course Review Page / MyReview</div>
      <div>Token: {token.value}</div>
    </div>
  );
}
