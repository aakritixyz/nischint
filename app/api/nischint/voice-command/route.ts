import { detectVoiceIntentWithAi } from "../../../../lib/nischintProviders";

const allowedLanguages = new Set(["en", "hi"]);

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as {
    audioBase64?: string;
    mimeType?: string;
    language?: "en" | "hi";
  } | null;

  if (!payload?.audioBase64) {
    return Response.json(
      { error: "audioBase64 is required" },
      { status: 400 }
    );
  }

  const language = allowedLanguages.has(payload.language ?? "")
    ? payload.language
    : "en";

  const result = await detectVoiceIntentWithAi({
    audioBase64: payload.audioBase64,
    mimeType: payload.mimeType ?? "audio/webm",
    language: language ?? "en",
  });

  return Response.json(result);
}
