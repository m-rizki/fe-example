import { getProducts } from "~/lib/products.server";

import type { Route } from "./+types/api.products";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const skip = Number(url.searchParams.get("skip") ?? 0);
  const data = await getProducts({ skip });

  return data;
}
