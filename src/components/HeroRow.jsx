import { useEffect, useRef, useState } from "react";
import { getHeroesByIds } from "../api/superhero";
import HeroCard from "./HeroCard";
import "./HeroRow.css";

/**
 * Горизонтальный ряд карточек одной категории.
 *
 * props:
 *   title — заголовок ряда (например, "Marvel Heroes")
 *   ids — массив ID героев для загрузки
 */
function HeroRow({ title, ids }) {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ссылка на DOM-элемент скроллящегося контейнера —
  // нужна, чтобы прокручивать его программно при клике на стрелки
  const scrollRef = useRef(null);

  // Состояние стрелок — показывать или нет в зависимости от позиции скролла
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Загрузка героев
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getHeroesByIds(ids)
      .then((data) => {
        if (!cancelled) setHeroes(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [ids]);

  // Пересчёт стрелок при скролле и при изменении контента
  function updateArrows() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }

  useEffect(() => {
    updateArrows();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [heroes]);

  // Прокрутка на одну "страницу" (ширина видимой области)
  function scrollBy(direction) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  }

  return (
    <section className="hero-row">
      <h2 className="hero-row__title">{title}</h2>

      <div className="hero-row__container">
        {canScrollLeft && (
          <button
            className="hero-row__arrow hero-row__arrow--left"
            onClick={() => scrollBy(-1)}
            aria-label="Scroll left"
          >
            ‹
          </button>
        )}

        <div className="hero-row__scroll" ref={scrollRef}>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="hero-row__skeleton" />
              ))
            : heroes.map((hero) => (
                <div key={hero.id} className="hero-row__item">
                  <HeroCard hero={hero} />
                </div>
              ))}
        </div>

        {canScrollRight && (
          <button
            className="hero-row__arrow hero-row__arrow--right"
            onClick={() => scrollBy(1)}
            aria-label="Scroll right"
          >
            ›
          </button>
        )}
      </div>
    </section>
  );
}

export default HeroRow;