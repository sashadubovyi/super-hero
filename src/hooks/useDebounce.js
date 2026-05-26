import { useEffect, useState } from "react";

/**
 * Возвращает значение с задержкой.
 * Если value меняется чаще чем раз в `delay` мс — возвращает последнее.
 *
 * Пример:
 *   const [query, setQuery] = useState("");
 *   const debouncedQuery = useDebounce(query, 300);
 *   // debouncedQuery обновится только когда пользователь перестанет печатать на 300мс
 */
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    // Запускаем таймер на delay мс
    const timer = setTimeout(() => setDebounced(value), delay);

    // Если value изменилось до того как таймер сработал — отменяем его
    // и запускаем заново. Это и есть суть дебаунса.
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}