import PropTypes from 'prop-types';


export default function Filter({ setSearchParams }) {

  function serializeFormQuery(formElement) {
    const formData = new FormData(formElement);
    let params = {};
    for (let [key, value] of formData.entries()) {
      params[key] = value; // Include all entries, even empty strings
    }
    return params;
  }

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission
    let params = serializeFormQuery(event.target);

    setSearchParams((prevSearchParams) => {
      const updatedSearchParams = new URLSearchParams(prevSearchParams.toString());

      // Merge new params with existing ones
      for (const [key, value] of Object.entries(params)) {
        if (value.trim() === "") {
          updatedSearchParams.delete(key); // Remove the parameter if the value is an empty string
        } else {
          updatedSearchParams.set(key, value); // Otherwise, set the new value
        }
      }

      return updatedSearchParams;
    });
  };

  return (
    <form className="filter" onSubmit={handleSubmit}>
      <label>
        Character Type:
        <input
          type="text"
          name="type"
          placeholder="Enter Type"
        />
      </label>

      <label>Choose a Gender:
        <select
          name="gender"
        >
          <option value="">Select a gender</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="genderless">Genderless</option>
          <option value="unknown">Unknown</option>
        </select>
      </label>

      <label>Choose a Species:
        <select
          name="species"
        >
          <option value="">Select a species</option>
          <option value="human">Human</option>
          <option value="alien">Alien</option>
          <option value="robot">Robot</option>
          <option value="unknown">Unknown</option>
        </select>
      </label>

      <label>Choose a Status:
        <select
          name="status"
        >
          <option value="">Select a status</option>
          <option value="alive">Alive</option>
          <option value="dead">Dead</option>
          <option value="unknown">Unknown</option>
        </select>
      </label>

      <button type="submit" aria-label="Apply filter button">
        Apply
      </button>
    </form>
  );
}

Filter.propTypes = {
  setSearchParams: PropTypes.func.isRequired,
};
