import PackingSlipsClient from "./PackingSlipsClient";

export const dynamic = "force-dynamic";

export default function PackingSlipsPage({ searchParams }) {
  const ids = searchParams?.ids || "";

  return <PackingSlipsClient ids={ids} />;
}