/**
 * Возвращает случайный элемент массива.
 * Опционально можно передать массив, который надо исключить —
 * чтобы кнопка "Random" не давала тот же элемент два раза подряд.
 */
export function randomItem(array, exclude = []) {
  if (!array || array.length === 0) return null;
  const filtered = array.filter((item) => !exclude.includes(item));
  // Если после фильтра ничего не осталось — берём из полного массива
  const pool = filtered.length > 0 ? filtered : array;
  return pool[Math.floor(Math.random() * pool.length)];
}