import { generateGuidanceWithAi } from "../../../../lib/nischintProviders";
import { getCareState } from "../../../../lib/nischintStore";
import { getGuidance } from "../../../../lib/nischintStore";

export async function GET() {
  const state = getCareState();
  return Response.json({
    guidance: getGuidance(),
    ai:
      (await generateGuidanceWithAi(
        `Write a very short, calm, safe instruction for ${state.patient.name}, who may feel confused near ${state.location.label}. Do not give medical advice.`
      )) ??
      "Rules-based guidance active. Add OPENAI_API_KEY for model-generated calming text.",
  });
}
