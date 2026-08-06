import { HomeView } from "@/components/HomeView";
import { getManifest } from "@/lib/issues";

export default function HomePage() {
  const manifest = getManifest();
  return <HomeView manifest={manifest} />;
}
