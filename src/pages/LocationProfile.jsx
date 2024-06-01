import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

import { CharacterCard, LoadingCard } from "../components/Cards";

export default function LocationProfile() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();
  const [locationDetails, setLocationDetails] = useState({
    name: "",
    characters: []
  });


  useEffect(() => {
    async function getCharacterDetails(url) {
      const response = await fetch(url);
      const data = await response.json(); //data.name , data.image
      return data;
    }

    async function fetchLocations(id) {
      setLoading(true);
      try {
        const response = await fetch(`https://rickandmortyapi.com/api/location/${id}`);
        const data = await response.json();
        // Initialize charactersList as empty array with let keyword.
        // getCharacterDetails() might return a object instead of an array of objects

        let charactersList = [];

        // Check if residents array is not empty
        if (data.residents.length !== 0) {
          const characterIds = data.residents.map((url) =>
            url.replace("https://rickandmortyapi.com/api/character/", "")
          );
          const resultString = `https://rickandmortyapi.com/api/character/${characterIds.join(", ")}`;
          charactersList = await getCharacterDetails(resultString);
        }
        // update the locationDetails state
        setLocationDetails({
          name: data.name,
          characters: Array.isArray(charactersList)
            ? charactersList
            : [charactersList],
        });
      } catch (error) {
        //handle error
        setError([])
      } finally {
        setLoading(false);
      }
    }

    fetchLocations(id);
  }, [id]); // * id dependency is added in the dependency array to avoid eslint warning, you can remove it safely.]);

  // show loading animation
  if (loading) {
    return <LoadingCard />
  }

  if (error) {
    <div className="no-items">{error}</div>
  }

  return (
    <main>

      <h2 className="location-name">{locationDetails.name}</h2>

      <div className="bar">
        Characters resides in {locationDetails.name}
        <FontAwesomeIcon icon={faAngleRight} />
      </div>
      {locationDetails.characters.length < 1 ? (
        <div className="no-items">No Characters</div>
      ) : (
        <ul className="grid">
          {locationDetails.characters.map((character) => (
            <CharacterCard key={character.id} {...character} />
          ))}
        </ul>
      )}
    </main>
  );
}