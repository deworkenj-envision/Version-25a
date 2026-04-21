import PackingSlipsClient from "./PackingSlipsClient";

export const dynamic = "force-dynamic";

export default async function PackingSlipsPage({ searchParams }) {
  const params = await searchParams;
  const ids = typeof params?.ids === "string" ? params.ids : "";

  return <PackingSlipsClient ids={ids} />;
}