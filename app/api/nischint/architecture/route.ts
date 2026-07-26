import { productionArchitecture } from "../../../../lib/nischintArchitecture";

export async function GET() {
  return Response.json(productionArchitecture);
}
