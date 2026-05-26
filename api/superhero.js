// Vercel Serverless Function
// Прокси к SuperheroAPI: скрывает токен и обходит CORS

export default async function handler(request, response) {
  // Достаём параметр path из URL запроса
  // Пример: /api/superhero?path=/id/70  →  path = "/id/70"
  const { path } = request.query;

  // Проверяем, что path передан
  if (!path) {
    return response.status(400).json({
      error: "Missing 'path' query parameter. Example: ?path=/id/70",
    });
  }

  // Защита: разрешаем только эндпоинты SuperheroAPI, а не любые URL
  // Чтобы наш прокси не превратили в открытый прокси для всего интернета
  if (!path.startsWith("/")) {
    return response.status(400).json({
      error: "Path must start with /",
    });
  }

  // Достаём токен из переменных окружения Vercel
  const token = process.env.SUPERHERO_TOKEN;

  if (!token) {
    return response.status(500).json({
      error: "Server is not configured (missing SUPERHERO_TOKEN)",
    });
  }

  // Собираем финальный URL к SuperheroAPI
  const url = `https://superheroapi.com/api/${token}${path}`;

  try {
    const apiResponse = await fetch(url);
    const data = await apiResponse.json();

    // Кешируем ответ в браузере на 1 час, на CDN Vercel на 24 часа
    // Данные о героях не меняются — нет смысла дёргать API каждый раз
    response.setHeader(
      "Cache-Control",
      "public, s-maxage=86400, max-age=3600"
    );

    return response.status(200).json(data);
  } catch (error) {
    return response.status(500).json({
      error: "Failed to fetch from SuperheroAPI",
      details: error.message,
    });
  }
}