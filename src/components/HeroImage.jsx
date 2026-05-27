import { useEffect, useState } from "react";
import { getHeroImageUrl } from "../api/akabab";

/**
 * Картинка героя из Akabab CDN (jsDelivr) — не банится нигде.
 * При ошибке загрузки показывает плейсхолдер с первой буквой имени.
 *
 * props:
 *   id — ID героя (число или строка)
 *   name — имя героя (для alt-текста и плейсхолдера)
 *   className, style — кастомные стили
 */
function HeroImage({ id, name, className, style }) {
  const [src, setSrc] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    getHeroImageUrl(id)
      .then((url) => {
        if (!cancelled) setSrc(url);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => { cancelled = true; };
  }, [id]);

  // Плейсхолдер — если нет src или картинка не загрузилась
  if (failed || !src) {
    const letter = (name || "?").charAt(0).toUpperCase();
    return (
      <div
        className={className}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
          color: "#666",
          fontSize: "4rem",
          fontWeight: "bold",
          aspectRatio: "2 / 3",
          ...style,
        }}
        aria-label={name}
      >
        {letter}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name || "Hero"}
      className={className}
      style={style}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export default HeroImage;