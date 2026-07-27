import { getChannels } from "@/lib/legacy/channels";
import { getNavigation } from "@/lib/legacy/navigation";
import { getSession } from "@/lib/legacy/session";
import { getSuppliers } from "@/lib/legacy/suppliers";
import { CommandPalette } from "@/components/search/CommandPalette";
import { MainHeader } from "./MainHeader";
import { MegaMenu } from "./MegaMenu";

export async function SiteHeader() {
  const [navigation, session, channels, suppliers] = await Promise.all([
    getNavigation(),
    getSession(),
    getChannels(),
    getSuppliers(),
  ]);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <MainHeader navigation={navigation} session={session} />
      <MegaMenu navigation={navigation} channels={channels} />
      <CommandPalette navigation={navigation} suppliers={suppliers} />
    </header>
  );
}
