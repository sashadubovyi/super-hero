import { useState } from "react";
import { imageUrl } from "../api/superhero";

/**
 * Картинка героя с автоматическим фолбэком на плейсхолдер.
 * Используем везде вместо обычного <img> для героев.
 *
 * props:
 *   src — оригинальный URL картинки из API (hero.image.url)
 *   name — имя героя (для alt-текста и плейсхолдера)
 *   className — кастомные стили
 */
function HeroImage({ src, name, className, style }) {
  const [failed, setFailed] = useState(false);

  // Плейсхолдер — первая буква имени на градиентном фоне
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
      src={imageUrl(src)}
      alt={name || "Hero"}
      className={className}
      style={style}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export default HeroImage;