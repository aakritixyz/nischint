import { getAiCapabilityMap } from "../../../../lib/nischintProviders";

export async function GET() {
  const capabilities = getAiCapabilityMap();
  return Response.json({
    readyCount: capabilities.filter((capability) => capability.ready).length,
    totalCount: capabilities.length,
    capabilities,
  });
}
