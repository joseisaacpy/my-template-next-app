import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({ route: "dashboard" });

export default function DashboardPage() {
  return (
    <div>
      <h1>Private Page</h1>
      <p>This page is only accessible to authenticated users.</p>
    </div>
  );
}
