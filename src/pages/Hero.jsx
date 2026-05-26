import { useParams } from "react-router-dom";

function Hero() {
  const { id } = useParams();

  return (
    <div style={{ padding: "40px" }}>
      <h1>Hero details</h1>
      <p>Hero ID: {id}</p>
    </div>
  );
}

export default Hero;