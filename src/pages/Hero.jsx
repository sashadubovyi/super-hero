import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getHeroById } from "../api/superhero";
import HeroImage from "../components/HeroImage";
import "./Hero.css";

function Hero() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getHeroById(id)
      .then((data) => {
        if (!cancelled) setHero(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Умная кнопка "Назад":
  // - если есть история — назад в браузерной истории
  // - если нет (открыли прямой ссылкой в новой вкладке) — на главную
  function handleBack() {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  }

  if (loading) {
    return (
      <div className="hero-page">
        <button className="hero-page__back" onClick={handleBack}>← Back</button>
        <p className="hero-page__status">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hero-page">
        <button className="hero-page__back" onClick={handleBack}>← Back</button>
        <h1 className="hero-page__error">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  const stats = hero.powerstats;
  const bio = hero.biography;
  const app = hero.appearance;
  const work = hero.work;

  return (
    <div className="hero-page">
      <button className="hero-page__back" onClick={handleBack}>← Back</button>

      <div className="hero-page__layout">
        <div className="hero-page__poster">
          <HeroImage src={hero.image?.url} name={hero.name} />
        </div>

        <div className="hero-page__details">
          <h1 className="hero-page__name">{hero.name}</h1>
          {bio?.["full-name"] && (
            <p className="hero-page__fullname">{bio["full-name"]}</p>
          )}

          {bio?.publisher && (
            <div className="hero-page__badge">{bio.publisher}</div>
          )}

          <h2 className="hero-page__section-title">Powerstats</h2>
          <div className="hero-page__stats">
            {Object.entries(stats || {}).map(([key, value]) => (
              <Stat key={key} label={key} value={value} />
            ))}
          </div>

          <h2 className="hero-page__section-title">Biography</h2>
          <dl className="hero-page__list">
            <Field label="Alignment" value={bio?.alignment} />
            <Field label="Place of birth" value={bio?.["place-of-birth"]} />
            <Field label="First appearance" value={bio?.["first-appearance"]} />
            <Field label="Aliases" value={bio?.aliases?.join(", ")} />
          </dl>

          <h2 className="hero-page__section-title">Appearance</h2>
          <dl className="hero-page__list">
            <Field label="Gender" value={app?.gender} />
            <Field label="Race" value={app?.race} />
            <Field label="Height" value={app?.height?.[1]} />
            <Field label="Weight" value={app?.weight?.[1]} />
            <Field label="Eye color" value={app?.["eye-color"]} />
            <Field label="Hair color" value={app?.["hair-color"]} />
          </dl>

          <h2 className="hero-page__section-title">Work</h2>
          <dl className="hero-page__list">
            <Field label="Occupation" value={work?.occupation} />
            <Field label="Base" value={work?.base} />
          </dl>
        </div>
      </div>
    </div>
  );
}

// Маленькие хелпер-компоненты для аккуратности
function Stat({ label, value }) {
  const percent = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className="stat">
      <div className="stat__head">
        <span className="stat__label">{label}</span>
        <span className="stat__value">{percent}</span>
      </div>
      <div className="stat__bar">
        <div className="stat__bar-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function Field({ label, value }) {
  if (!value || value === "-") return null;
  return (
    <>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </>
  );
}

export default Hero;