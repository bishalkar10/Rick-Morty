import PropTypes from 'prop-types';

export default function Filter({ formData, setFormData, updateFilter }) {
  const handleChange = (e) => {
    // Update the state object with the new value for the changed field
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission

    updateFilter(formData);
  };

  return (
    <form className="filter" onSubmit={handleSubmit}>
      <label>
        Character Type:
        <input
          type="text"
          name="type"
          placeholder="Enter Type"
          value={formData.type}
          onChange={handleChange}
        />
      </label>

      <label>Choose a Gender:
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
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
          value={formData.species}
          onChange={handleChange}
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
          value={formData.status}
          onChange={handleChange}
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
  formData: PropTypes.shape({
    type: PropTypes.string,
    gender: PropTypes.oneOf(['', 'female', 'male', 'genderless', 'unknown']),
    species: PropTypes.oneOf(['', 'human', 'alien', 'robot', 'unknown']),
    status: PropTypes.oneOf(['', 'alive', 'dead', 'unknown'])
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  updateFilter: PropTypes.func.isRequired,
};
