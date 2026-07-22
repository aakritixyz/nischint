import { getChatGPTUser } from "../../../chatgpt-auth";

export async function GET() {
  const user = await getChatGPTUser();

  return Response.json({
    authenticated: Boolean(user),
    user,
    authModel:
      "Uses ChatGPT/Sites authenticated-user headers when deployed behind a signed-in workspace route. Add role checks before production use.",
  });
}
