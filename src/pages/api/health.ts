/*
  Feat: Check connection of the server
  Export Const: {status: "ok"},{status: 200}

*/

import type { APIRoute } from "astro";

export const GET = (() => {
  return Response.json(
    {
      status: "ok",
    },
    {
      status: 200,
    },
  );
}) satisfies APIRoute;