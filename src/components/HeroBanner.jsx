import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHeroById, imageUrl } from "../api/superhero";
import { FEATURED_IDS } from "../data/categories";
import { randomItem } from "../utils/random";
import "./HeroBanner.css";

function HeroBanner() {
  const [currentId, setCurrentId] = useState(() => randomItem(FEATURED_IDS));
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  // Загружаем героя по выбранному ID
  useEffect(() => {
    if (!currentId) return;

    let cancelled = false;
    setLoading(true);
    setVisible(false); // прячем контент перед сменой

    getHeroById(currentId)
      .then((data) => {
        if (!cancelled) {
          setHero(data);
          // requestAnimationFrame даёт браузеру успеть отрисовать
          // "невидимое" состояние прежде чем мы включим visible —
          // иначе CSS-переход не сработает (нет начального кадра)
          requestAnimationFrame(() => {
            if (!cancelled) setVisible(true);
          });
        }
      })
      .catch(() => {
        // Если конкретный ID не загрузился — пробуем другой
        if (!cancelled) {
          setCurrentId((prev) => randomItem(FEATURED_IDS, [prev]));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [currentId]);

  function handleRandom() {
    setCurrentId((prev) => randomItem(FEATURED_IDS, [prev]));
  }

  if (loading || !hero) {
    return <div className="hero-banner hero-banner--loading" />;
  }

  const bio = hero.biography;
  const stats = hero.powerstats;

  // Краткое описание: алайнмент + издатель + место рождения (если есть)
  const tagline = [
    bio?.alignment === "bad" ? "Villain" : bio?.alignment === "good" ? "Hero" : null,
    bio?.publisher,
    bio?.["first-appearance"] && bio["first-appearance"] !== "-"
      ? `First appeared in ${bio["first-appearance"]}`
      : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <section
      className={`hero-banner ${visible ? "hero-banner--visible" : ""}`}
      style={{
        backgroundImage: hero.image?.url
          ? `url(${imageUrl(hero.image.url)})`
          : "none",
      }}
    >
      <div className="hero-banner__overlay" />
      <div className="hero-banner__content">
        {bio?.publisher && (
          <div className="hero-banner__badge">{bio.publisher}</div>
        )}
        <h1 className="hero-banner__name">{hero.name}</h1>
        {bio?.["full-name"] && bio["full-name"] !== "-" && (
          <p className="hero-banner__fullname">{bio["full-name"]}</p>
        )}
        {tagline && <p className="hero-banner__tagline">{tagline}</p>}

        {stats && (
          <div className="hero-banner__stats">
            {Object.entries(stats).slice(0, 6).map(([key, value]) => (
              <div key={key} className="hero-banner__stat">
                <span className="hero-banner__stat-value">{value}</span>
                <span className="hero-banner__stat-label">{key}</span>
              </div>
            ))}
          </div>
        )}

        <div className="hero-banner__actions">
          <Link
            to={`/hero/${hero.id}`}
            className="hero-banner__btn hero-banner__btn--primary"
          >
            View details
          </Link>
          <button
            type="button"
            onClick={handleRandom}
            className="hero-banner__btn hero-banner__btn--secondary"
          >
            ⟳ Random hero
          </button>
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;