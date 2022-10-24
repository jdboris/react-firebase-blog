export default {
  async fetch(request, env) {
    return await handleRequest(request, env).catch(
      (err) => new Response(err.stack, { status: 500 })
    );
  },
};

/**
 * Many more examples available at:
 *   https://developers.cloudflare.com/workers/examples
 * @param {Request} request
 * @returns {Promise<Response>}
 */
async function handleRequest(request, env) {
  try {
    const { pathname } = new URL(request.url);

    if (pathname.startsWith("/image")) {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_IMAGES_ACCOUNT_ID}/images/v1`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.CLOUDFLARE_IMAGES_API_TOKEN}`,
            // NOTE: Through trial and error, these headers were revealed to be required
            Host: "api.cloudflare.com",
            "Content-Type": request.headers.get("Content-Type"),
            "Content-Length": request.headers.get("Content-Length"),
          },
          body: request.body,
        }
      );

      return cors(request, response);
    }
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return fetch("https://welcome.developers.workers.dev");
}

async function cors(request, original, origin = "*") {
  const response = new Response(original.body, original);

  if (request.method === "OPTIONS") {
    if (
      request.headers.get("Origin") !== null &&
      request.headers.get("Access-Control-Request-Method") !== null &&
      request.headers.get("Access-Control-Request-Headers") !== null
    ) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Methods", "POST,OPTIONS");
      response.headers.set("Access-Control-Max-Age", "86400");
      response.headers.set(
        "Access-Control-Allow-Headers",
        request.headers.get("Access-Control-Request-Headers")
      );
    }
  }

  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");

  return response;
}
