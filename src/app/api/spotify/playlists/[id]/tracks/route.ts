import { NextResponse } from "next/server";
import { listPlaylistTracks } from "@/lib/spotify/api";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const tracks = await listPlaylistTracks(id);
  return NextResponse.json({ tracks });
}
