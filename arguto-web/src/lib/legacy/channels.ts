import { channelsFixture } from "@/lib/fixtures/channels";
import { channelSchema, type Channel } from "@/lib/schemas/channel";
import { z } from "zod";
import { fetchLegacyJson, isFixtureMode } from "./client";

/** Fachada: GET /v1/api/canais.aspx — endpoint ainda a confirmar no discovery. */
export async function getChannels(): Promise<Channel[]> {
  if (isFixtureMode()) return channelsFixture;
  return fetchLegacyJson("/v1/api/canais.aspx", z.array(channelSchema), { revalidate: 3600 });
}
