import { createCaregiverAccount } from "../../../../lib/nischintAuth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const result = await createCaregiverAccount({
    name: String(body.name ?? ""),
    identifier: String(body.identifier ?? ""),
    phone: String(body.phone ?? ""),
    password: String(body.password ?? ""),
  });

  if (!result.ok) {
    return Response.json(
      { authenticated: false, error: result.error },
      { status: 400 }
    );
  }

  return Response.json({ authenticated: true, session: result.session });
}
