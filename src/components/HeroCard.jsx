import { Link } from "react-router-dom";
import HeroImage from "./HeroImage";
import "./HeroCard.css";

/**
 * Карточка героя — кликабельная, ведёт на /hero/:id.
 *
 * props:
 *   hero — объект героя из API (id, name, image, biography)
 */
function HeroCard({ hero }) {
  return (
    <Link to={`/hero/${hero.id}`} className="hero-card">
      <div className="hero-card__image-wrap">
        <HeroImage
  id={hero.id}
  name={hero.name}
  className="hero-card__image"
/>
      </div>
      <div className="hero-card__info">
        <h3 className="hero-card__name">{hero.name}</h3>
        {hero.biography?.publisher && (
          <p className="hero-card__publisher">{hero.biography.publisher}</p>
        )}
      </div>
    </Link>
  );
}

export default HeroCard;