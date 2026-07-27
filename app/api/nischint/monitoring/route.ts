import { getProviderHealth } from "../../../../lib/nischintProviders";
import { getProductionAudit } from "../../../../lib/nischintProduction";
import { getMonitoringSnapshot } from "../../../../lib/nischintStore";

export async function GET() {
  const snapshot = getMonitoringSnapshot();
  const providers = getProviderHealth();
  const audit = getProductionAudit();

  return Response.json({
    status:
      snapshot.deliveryFailures === 0 && snapshot.networkStatus !== "offline"
        ? "healthy"
        : "needs-attention",
    snapshot,
    providers,
    production: audit,
  });
}
