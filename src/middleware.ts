import { defineMiddleware } from "astro:middleware";

import { SELF_INTRO } from "./consts";

export const onRequest = defineMiddleware(({ request, url }, next) => {
  const userAgent = request.headers.get("user-agent") ?? "";
  const isCurl = /curl\//i.test(userAgent);

  if (url.pathname === "/" && isCurl) {
    return new Response(SELF_INTRO, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }

  return next();
});
