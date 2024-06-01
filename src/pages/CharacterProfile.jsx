import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

import { EpisodeCard, LoadingCard } from "../components/Cards";
import { DataTable } from "../components/DataTable";

export default function CharacterProfile() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("");
  const [episodes, setEpisodes] = useState([])
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

  // use useEffect hook to fetch data from the https://rickandmortyapi.com/api/character/${id} and then get the location.url and make another fetch request to get amount of residents from that location
  useEffect(() => {
    // function to get the episode name from the url
    async function getEpisodeName(url) {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    }

    // function to get the location details from the url
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

        // Get the id of the episodes
        const episodeIds = data.episode.map((url) => url.replace("https://rickandmortyapi.com/api/episode/", ""));
        const resultString = `https://rickandmortyapi.com/api/episode/${episodeIds.join(", ")}`;

        const [locationInfo, episodeList] = await Promise.all([
          getLocationDetails(data.location.url),
          getEpisodeName(resultString),
        ]);
        // update the characterDetails state with the data we got from the api calls
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
        // sometimes certain character is present in only episode so episodeList can return a single object rather than an array
        // So we put the object in a array so when use array.map() we don't get any error
        const episodes = Array.isArray(episodeList) ? [...episodeList] : [episodeList]; // ! very important piece of code
        setEpisodes([...episodes])
      } catch (error) {
        setEpisodes([])
        setError(error.message)
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCharacter();
  }, [id]); // * id dependency is added in the dependency array to avoid eslint warning, you can remove it safely.]);

  // we will pass this data to DataTable component to render a HTML Table
  const tableData = {
    Species: characterDetails.species,
    Gender: characterDetails.gender,
    Origin: characterDetails.origin,
    Location: characterDetails.location,
    Dimension: characterDetails.dimension,
    AmountOfResidents: characterDetails.amountOfResidents
  }

  // show loading animation
  if (loading) {
    return <LoadingCard />
  }

  if (error) {
    <div className="no-items">{error}</div>
  }

  return <main id="character-profile">
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
  </main>;
}