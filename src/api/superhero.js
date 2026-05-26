// Клиент для SuperheroAPI
// Все компоненты обращаются к API только через эти функции.
// Внутри они ходят на наш прокси (/api/superhero), который добавляет токен.

const PROXY_URL = "/api/superhero";

/**
 * Базовая функция запроса к API.
 * Принимает путь типа "/70" или "/search/batman" и возвращает JSON.
 * Кидает ошибку, если API вернуло response: "error".
 */
async function request(path) {
  const url = `${PROXY_URL}?path=${encodeURIComponent(path)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();

  // SuperheroAPI всегда возвращает 200, но в теле может быть { response: "error" }
  if (data.response === "error") {
    throw new Error(data.error || "API error");
  }

  return data;
}

/**
 * Получить полные данные героя по ID.
 * Пример: getHeroById("70") → { id, name, powerstats, biography, ... }
 */
export function getHeroById(id) {
  return request(`/${id}`);
}

/**
 * Поиск героев по имени.
 * Возвращает массив героев (или пустой массив, если ничего не найдено).
 * Пример: searchHeroes("batman") → [{ id: "69", name: "Batman", ... }, ...]
 */
export async function searchHeroes(name) {
  try {
    const data = await request(`/search/${encodeURIComponent(name)}`);
    return data.results || [];
  } catch (error) {
    // API возвращает ошибку "character with given name not found" — это не баг,
    // просто пустой результат поиска. Возвращаем пустой массив.
    if (String(error.message).toLowerCase().includes("not found")) {
      return [];
    }
    throw error;
  }
}

/**
 * Получить несколько героев по их ID параллельно.
 * Используется на главной для рядов категорий.
 * Игнорирует индивидуальные ошибки — возвращает только успешно загруженных.
 */
export async function getHeroesByIds(ids) {
  const results = await Promise.allSettled(ids.map((id) => getHeroById(id)));
  return results
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value);
}

/**
 * Превращает прямую ссылку на картинку героя в ссылку на наш прокси.
 * Используем во всех <img src={...}> — никогда не подставляем прямую ссылку из API.
 *
 * Пример:
 *   imageUrl("https://www.superherodb.com/pictures2/portraits/10/100/639.jpg")
 *   → "/api/image?url=https%3A%2F%2Fwww.superherodb.com%2F..."
 */
export function imageUrl(originalUrl) {
  if (!originalUrl) return "";
  return `/api/image?url=${encodeURIComponent(originalUrl)}`;
}