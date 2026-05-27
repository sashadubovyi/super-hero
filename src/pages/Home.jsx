import HeroBanner from "../components/HeroBanner";
import HeroRow from "../components/HeroRow";
import { CATEGORIES } from "../data/categories";

function Home() {
  return (
    <div className="home">
      <HeroBanner />
      {CATEGORIES.map((category) => (
        <HeroRow
          key={category.id}
          title={category.title}
          ids={category.ids}
        />
      ))}
    </div>
  );
}

export default Home;