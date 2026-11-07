import { getStore } from "@netlify/blobs";
import { handle } from "../lib/core.mjs";

export default async (req) =>
  handle(req, getStore({ name: "youre-doomed", consistency: "strong" }), Netlify.env.get("CODE_SYNC"));

export const config = { path: "/api/sync" };
