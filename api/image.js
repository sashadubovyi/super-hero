// Vercel Serverless Function — прокси для картинок героев.
// Нужен потому, что superherodb банит дата-центровые IP (Codespaces, и т.д.).
// Кроме того — даёт нам контроль над кешем и фолбэком при ошибках.

const ALLOWED_HOST = "www.superherodb.com";

export default async function handler(request, response) {
  const { url } = request.query;

  if (!url) {
    return response.status(400).json({ error: "Missing 'url' query param" });
  }

  // ВАЖНО: разрешаем только картинки с superherodb,
  // чтобы наш прокси не превратили в открытый прокси для всего интернета.
  let target;
  try {
    target = new URL(url);
  } catch {
    return response.status(400).json({ error: "Invalid URL" });
  }

  if (target.hostname !== ALLOWED_HOST) {
    return response.status(400).json({ error: "Host not allowed" });
  }

  try {
    // Притворяемся обычным браузером — некоторые серверы блокируют
    // запросы без User-Agent или с подозрительным
    const imageResponse = await fetch(target.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://www.superherodb.com/",
      },
    });

    if (!imageResponse.ok) {
      return response
        .status(imageResponse.status)
        .json({ error: `Upstream ${imageResponse.status}` });
    }

    // Передаём байты картинки клиенту как есть
    const buffer = Buffer.from(await imageResponse.arrayBuffer());
    const contentType =
      imageResponse.headers.get("content-type") || "image/jpeg";

    response.setHeader("Content-Type", contentType);
    // Картинки не меняются — кешируем агрессивно
    response.setHeader(
      "Cache-Control",
      "public, s-maxage=2592000, max-age=86400, immutable"
    );

    return response.status(200).send(buffer);
  } catch (error) {
    return response
      .status(500)
      .json({ error: "Failed to fetch image", details: error.message });
  }
}