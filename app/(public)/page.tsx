import { createMetadata } from "@/lib/metadata";

import { HomeView } from "./_components/home-view";

export const metadata = createMetadata({ route: "home" });

export default function HomePage() {
  return <HomeView />;
}
