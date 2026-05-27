// Akabab Superhero API — альтернативный источник картинок
// Данные хостятся на GitHub Pages, картинки на jsDelivr CDN
// Никаких CORS-проблем, никакого токена, никакого бана по IP

const BASE_URL = "https://akabab.github.io/superhero-api/api";

/**
 * Получить данные героя по ID из Akabab API.
 * Используем только поле images — остальные данные берём из SuperheroAPI.
 */
export async function getAkababHero(id) {
  const response = await fetch(`${BASE_URL}/id/${id}.json`);
  if (!response.ok) throw new Error(`Akabab: ${response.status}`);
  return response.json();
}

/**
 * Получить URL картинки героя по ID.
 * Возвращает md (medium) картинку — оптимальный размер для карточек.
 * При ошибке возвращает null (компонент покажет плейсхолдер).
 */
export async function getHeroImageUrl(id) {
  try {
    const data = await getAkababHero(id);
    return data?.images?.md || null;
  } catch {
    return null;
  }
}