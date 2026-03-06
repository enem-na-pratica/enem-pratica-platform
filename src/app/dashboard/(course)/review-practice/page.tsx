import { cookies } from "next/headers";

export default async function MyToBeReviewed() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")!;

  return (
    <div>
      <div>Course To Be Reviewed Page / MyToBeReviewed</div>
      <div>Token: {token.value}</div>
    </div>
  );
}
