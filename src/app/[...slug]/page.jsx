import { ClientOnly } from "../client-only";

export function generateStaticParams() {
  return [{ slug: ["favorites"] }];
}

export default function CatchAllPage() {
  return <ClientOnly />;
}
