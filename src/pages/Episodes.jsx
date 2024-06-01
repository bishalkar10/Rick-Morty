import { useState, useEffect } from "react";

import { Pagination } from "@mui/material";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import { EpisodeCard, LoadingCard } from "../components/Cards";

export default function Episodes() {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [error, setError] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [searchValue, setSearchValue] = useState("");

  function resetPage() {
    setPage(1) // reset the page to 1 when update the filters so we always start from 1
  }

  //update the page count
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  function handleChange(e) {
    e.preventDefault()
    setNameInput(e.target.value)
  }

  function handleSubmit(event) {
    event.preventDefault();

    setSearchValue(nameInput)
    resetPage() // when performing a new search reset the page to 1
  }

  useEffect(() => {
    const url = new URL("https://rickandmortyapi.com/api/episode");

    if (searchValue) {
      url.searchParams.set("name", searchValue.trim());
    }
    url.searchParams.append("page", page)

    async function fetchData(url) {
      setLoading(true)
      try {
        const res = await fetch(url);
        if (res.status === 404) {
          throw new Error("No episode found")
        }
        const data = await res.json();
        setTotalPage(data.info.pages);
        setEpisodes([...data.results]);
      } catch (error) {
        setEpisodes([])
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData(url);
  }, [page, searchValue]);

  return (
    <main>
      <div className="filter-container"> <h2>Episodes</h2>
        <form id="name-form" onSubmit={handleSubmit}>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Enter name"
            value={nameInput}
            onChange={handleChange} />
          <button aria-label="Search button">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </form>
      </div>
      {/* show a loading animation before loading cards */}
      {loading ? (
        <LoadingCard />
      ) : error ? (
        <div className="no-items">{error}</div>
      ) : (
        <>
          <ul className="grid">
            {episodes.map(item => (
              <EpisodeCard key={item.id} {...item} />
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
