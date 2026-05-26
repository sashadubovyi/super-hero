import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import "./Header.css";

/**
 * Шапка сайта.
 * - Логотип слева (ссылка на главную)
 * - Поле поиска справа
 * - При вводе в поиск — переходит на /search?q=...
 */
function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Локальное значение поля. Инициализируем из URL, если мы уже на /search?q=...
  const [query, setQuery] = useState(() => searchParams.get("q") || "");

  // Если пользователь переходит на другую страницу через клик по логотипу — очищаем поле
  useEffect(() => {
    if (location.pathname !== "/search") {
      setQuery("");
    }
  }, [location.pathname]);

  // При изменении в поле — обновляем URL и перебрасываем на /search
  function handleChange(e) {
    const value = e.target.value;
    setQuery(value);

    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value)}`, { replace: location.pathname === "/search" });
    } else if (location.pathname === "/search") {
      // Если очистили поле и были на /search — остаёмся на /search, но без query
      navigate("/search", { replace: true });
    }
  }

  return (
    <header className="header">
      <Link to="/" className="header__logo">
        SUPER<span className="header__logo-accent">HERO</span>
      </Link>
      <div className="header__search">
        <input
          type="text"
          className="header__search-input"
          placeholder="Search heroes..."
          value={query}
          onChange={handleChange}
          autoComplete="off"
        />
      </div>
    </header>
  );
}

export default Header;