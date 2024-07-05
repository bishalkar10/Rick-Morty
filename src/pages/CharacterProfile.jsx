import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

import { EpisodeCard, LoadingCard } from "../components/Cards";
import { DataTable } from "../components/DataTable";

export default function CharacterProfile() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [episodes, setEpisodes] = useState([]);
  const [characterDetails, setCharacterDetails] = useState({
    name: "",
    species: "",
    gender: "",
    origin: "",
    location: "",
    locationID: "",
    image: "",
    dimension: "",
    amountOfResidents: "",
  });

  useEffect(() => {
    async function getEpisodeName(url) {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    }

    async function getLocationDetails(url) {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    }

    async function fetchCharacter() {
      setLoading(true);
      try {
        const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
        const data = await response.json();

        const episodeIds = data.episode.map((url) => url.replace("https://rickandmortyapi.com/api/episode/", ""));
        const cachedEpisodes = {};
        const uncachedEpisodeIds = []; 

        // Check if episodes are in localStorage
        episodeIds.forEach((episodeId) => {
          const cachedEpisode = localStorage.getItem(`episode-${episodeId}`);
          if (cachedEpisode) {
            cachedEpisodes[episodeId] = JSON.parse(cachedEpisode);
          } else {
            uncachedEpisodeIds.push(episodeId);
          }
        });

        let episodesData = [];

        if (uncachedEpisodeIds.length > 0) {
          const resultString = `https://rickandmortyapi.com/api/episode/${uncachedEpisodeIds.join(",")}`;
          const fetchedEpisodes = await getEpisodeName(resultString);

          const fetchedEpisodesArray = Array.isArray(fetchedEpisodes) ? fetchedEpisodes : [fetchedEpisodes];

          fetchedEpisodesArray.forEach((episode) => {
            localStorage.setItem(`episode-${episode.id}`, JSON.stringify(episode)); // cache the episodes
            cachedEpisodes[episode.id] = episode;
          });
        }

        // Reconstruct the episodes in the original order
        episodesData = episodeIds.map(id => cachedEpisodes[id]); // episodeData is an array 

        const locationInfo = await getLocationDetails(data.location.url);

        setCharacterDetails({
          name: data.name,
          species: data.species,
          gender: data.gender,
          origin: data.origin.name,
          location: locationInfo.name,
          locationID: locationInfo.id,
          image: data.image,
          dimension: locationInfo.dimension,
          amountOfResidents: locationInfo.residents.length,
        });

        setEpisodes(episodesData);
      } catch (error) {
        setEpisodes([]);
        setError(error.message);
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCharacter();
  }, [id]);

  const tableData = {
    species: characterDetails.species,
    gender: characterDetails.gender,
    origin: characterDetails.origin,
    location: characterDetails.location,
    locationID: characterDetails.locationID,
    dimension: characterDetails.dimension,
    amountOfResidents: characterDetails.amountOfResidents
  };

  if (loading) {
    return <LoadingCard />;
  }

  if (error) {
    return <div className="no-items">{error}</div>;
  }

  return (
    <main id="character-profile">
      <figure>
        <img src={characterDetails.image} alt={`Photo of ${characterDetails.name}`} />
        <figcaption>
          {characterDetails.name}
        </figcaption>
      </figure>
      <DataTable {...tableData} />
      <div className="bar">
        {characterDetails.name} present in episode
        <FontAwesomeIcon icon={faAngleRight} />
      </div>
      <ul className="text-card-grid">
        {episodes.map(item => (
          <EpisodeCard key={item.id} {...item} />
        ))}
      </ul>
    </main>
  );
}
