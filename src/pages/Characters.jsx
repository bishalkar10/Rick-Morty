import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { CharacterCard } from "../components/Cards";
import { Pagination } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSearch, faX } from "@fortawesome/free-solid-svg-icons";
import Filter from "../components/Filter";
import { LoadingCard } from "../components/Cards";

export default function Characters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const [error, setError] = useState("");

  // filter state is used in the useEffect hook dependecy array
  const [filter, setFilter] = useState({
    name: "",
    type: "",
    gender: "",
    species: "",
    status: "",
  });

  function resetPage() {
    setPage(1) // reset the page to 1 when update the filters
  }

  function toggleFilter(event) {
    event.stopPropagation();
    setShowFilter(!showFilter)
  }

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Synchronize form data with searchParams
  useEffect(() => {
    const paramsObject = Object.fromEntries(searchParams.entries());

    // reset the filter every time form submit. 
    // If a previous filter like species : robot is applied and we are not applying the filter this time, 
    // the filter state still would have species : robot
    const updatedFormData = {
      name: '', 
      type: '',
      gender: '',
      species: '',
      status: '',
    };

    // update the form with url Search Param filter
    for (const key in updatedFormData) {
      if (paramsObject[key]) {
        updatedFormData[key] = paramsObject[key];
      }
    }

    setFilter(updatedFormData);
  }, [searchParams]);

  // handle the name form submit
  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const nameValue = formData.get("name");

    setSearchParams(prevSearchParams => {
      // Create a new URLSearchParams object
      const updatedSearchParams = new URLSearchParams(prevSearchParams.toString());

      // Check if nameValue is empty (either "" or null)
      if (nameValue.trim()) {
        updatedSearchParams.set('name', nameValue); // Set the "name" parameter to the provided value
      } else {
        updatedSearchParams.delete("name"); // This will remove the "name" parameter
      }

      // Iterate over previous searchParams and set them in the updatedSearchParams
      for (const [key, value] of prevSearchParams.entries()) {
        if (key !== 'name') {
          updatedSearchParams.set(key, value);
        }
      }

      return updatedSearchParams;
    });
  }

  useEffect(() => {
    const url = new URL("https://rickandmortyapi.com/api/character");

    for (let k in filter) {
      if (filter[k].trim() !== "") {
        // if value of an item is empty string then don't add it
        url.searchParams.set(k, filter[k]);
      }
    }
    url.searchParams.append("page", page);

    async function fetchData(url) {
      setError("") // clear any error before each api call else user can't see the loading screen.
      setLoading(true)
      try {
        const res = await fetch(url);
        const data = await res.json();
        if (res.status === 404) {
          throw new Error("No character found")
        }
        setTotalPage(data.info.pages);
        setCharacters([...data.results]); // only add new card and delete the previous ones
      } catch (error) {
        setError(error.message)
        setCharacters([]) // empty the characters array if any error occurs.
      } finally {
        setLoading(false)
      }
    }

    fetchData(url);
  }, [page, filter]);

  return (
    <main>
      <div className="filter-container">
        <h2>Characters</h2>
        <form id="name-form" onSubmit={handleSubmit}>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Enter name"
          />
          <button aria-label="Search button"> <FontAwesomeIcon icon={faSearch} /></button>
        </form>
        <button
          id="toggle-filter-btn"
          aria-label="Toggle filter button"
          onClick={toggleFilter}
        >
          <FontAwesomeIcon icon={showFilter ? faX : faFilter} />
        </button>

        {showFilter && <Filter {...{setSearchParams}} />}
      </div>
      {/* show a loading animation before loading cards */}
      {loading ? (
        <LoadingCard />
      ) : error ? (
        <div className="no-items">{error}</div>
      ) : (
        <>
          <ul className="grid">
            {characters.map(item => (
              <CharacterCard key={item.id} {...item} />
            ))}
          </ul>
          <Pagination
            count={totalPage}
            page={page}
            color="primary"
            size="small"
            onChange={handlePageChange}
          />
        </>
      )}
    </main>
  );
}