import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getHeroById } from "../api/superhero";
import HeroImage from "../components/HeroImage";

function Hero() {
  const { id } = useParams();
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getHeroById(id)
      .then((data) => setHero(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div style={{ padding: "40px" }}>Loading...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: "40px" }}>
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>{hero.name}</h1>
      <p>ID: {hero.id}</p>
      <p>Full name: {hero.biography["full-name"]}</p>
      <p>Publisher: {hero.biography.publisher}</p>
      <HeroImage src={hero.image.url} name={hero.name} style={{ width: 300 }} />
      <h2>Powerstats</h2>
      <pre>{JSON.stringify(hero.powerstats, null, 2)}</pre>
    </div>
  );
}

export default Hero;