import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchHeroes } from "../api/superhero";
import { useDebounce } from "../hooks/useDebounce";
import HeroCard from "../components/HeroCard";
import "./Search.css";

function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const debouncedQuery = useDebounce(query, 350);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = debouncedQuery.trim();

    // Пустой запрос — ничего не показываем, не дёргаем API
    if (!q) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    // Защита от race-condition: если пользователь быстро поменяет запрос,
    // старый ответ не должен затереть новый. Через флаг `cancelled` игнорируем.
    let cancelled = false;

    setLoading(true);
    setError(null);

    searchHeroes(q)
      .then((data) => {
        if (cancelled) return;
        setResults(data);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
        setResults([]);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  return (
    <div className="search-page">
      {!query.trim() && (
        <p className="search-page__hint">Start typing to search heroes</p>
      )}

      {query.trim() && (
        <>
          <h2 className="search-page__title">
            {loading ? "Searching" : "Results for"} <em>"{query}"</em>
            {!loading && results.length > 0 && (
              <span className="search-page__count">— {results.length}</span>
            )}
          </h2>

          {error && <p className="search-page__error">{error}</p>}

          {loading && (
            <div className="search-grid">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="search-skeleton" />
              ))}
            </div>
          )}

          {!loading && !error && results.length === 0 && (
            <p className="search-page__hint">No heroes found</p>
          )}

          {!loading && results.length > 0 && (
            <div className="search-grid">
              {results.map((hero) => (
                <HeroCard key={hero.id} hero={hero} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Search;