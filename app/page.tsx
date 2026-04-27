import { WatchlistDashboard } from "@/components/WatchlistDashboard";
import { NewsList } from "@/components/NewsList";
import { SectorsPanel } from "@/components/SectorsPanel";
import { SmallCapsPanel } from "@/components/SmallCapsPanel";
import { ReportsPanel } from "@/components/ReportsPanel";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="max-w-page mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col gap-12">
      <WatchlistDashboard />
      <SectorsPanel />
      <NewsList />
      <SmallCapsPanel />
      <ReportsPanel />
      <Footer />
    </main>
  );
}
