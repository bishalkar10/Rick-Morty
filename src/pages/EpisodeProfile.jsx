import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

import { CharacterCard, LoadingCard } from "../components/Cards";

export default function EpisodeProfile() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [characters, setCharacters] = useState([])
  const [episodeDetails, setEpisodeDetails] = useState({
    name: "",
    air_date: "",
    episode: "",
  });

  useEffect(() => {
    async function getCharacterDetails(url) {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    }

    async function fetchEpisode(id) {
      setLoading(true);
      const response = await fetch(`https://rickandmortyapi.com/api/episode/${id}`);
      const data = await response.json();
      // sometimes there could be one id
      let charactersList = [];

      if (data.characters.length !== 0) {
        const characterIds = data.characters.map((url) =>
          url.replace("https://rickandmortyapi.com/api/character/", "")
        );
        const resultString = `https://rickandmortyapi.com/api/character/${characterIds.join(", ")}`;
        charactersList = await getCharacterDetails(resultString);
      }
      setEpisodeDetails({
        name: data.name,
        air_date: data.air_date,
        episode: data.episode,
      });

      // sometimes there could be only one characters featured in the episode then the api doesn't return an array rather an object
      // We will check if the charactersList is an array or not.
      const characters = Array.isArray(charactersList) ? [...charactersList] : [charactersList]; // ! very important piece of code
      setCharacters([...characters])
      setLoading(false);
    }

    fetchEpisode(id);
  }, [id]); // * id dependency is added in the dependency array to avoid eslint warning, you can remove it safely.]);

  if (loading) {
    return <LoadingCard />
  }

  return (
    <main>
      <h2 className="location-name">{episodeDetails.name}</h2>
      <div className="bar">
        Characters featured in {episodeDetails.name}
        <FontAwesomeIcon icon={faAngleRight} />
      </div>
      <ul className="grid">
        {characters.map(item => (
          <CharacterCard key={item.id} {...item} />
        ))}
      </ul>
    </main>
  );
}