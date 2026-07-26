import { getProductionAudit } from "../../../../lib/nischintProduction";

export async function GET() {
  return Response.json({ audit: getProductionAudit() });
}
