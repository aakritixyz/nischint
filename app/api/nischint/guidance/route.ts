import {
  generateGuidanceWithAi,
  getAiCapabilityMap,
  getAiProviderSummary,
} from "../../../../lib/nischintProviders";
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
      getAiProviderSummary(),
    capabilities: getAiCapabilityMap(),
  });
}
