import { getChatGPTUser } from "../../../chatgpt-auth";

export async function GET() {
  const user = await getChatGPTUser();

  return Response.json({
    authenticated: Boolean(user),
    user,
    authModel:
      "Identity endpoint placeholder. Connect Vercel Auth, Clerk, Auth.js, or Supabase Auth for production role checks.",
  });
}
