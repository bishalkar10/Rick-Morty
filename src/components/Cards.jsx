import { Link } from "react-router-dom";

import PropTypes from 'prop-types';

// CharacterCard component
export function CharacterCard({ id, name, image }) {
  return (
    <li className="card">
      <Link to={`/characters/${id}`}>
        <figure>
          <img src={image} alt={`Photo of ${name}`} />
          <figcaption>{name}</figcaption>
        </figure>
      </Link>
    </li>
  )
}

CharacterCard.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
};

// EpisodeCard component
export function EpisodeCard({ id, name, air_date, episode }) {
  return (
    <li className="text-card">
      <Link to={`/episodes/${id}`}>
        <div className="wrapper">
          <p><b>{name}</b></p>
          <p>{air_date}</p>
          <p>{episode}</p>
        </div>
      </Link>
    </li>
  );
}

EpisodeCard.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  air_date: PropTypes.string.isRequired, 
  episode: PropTypes.string.isRequired,
};

// LocationCard component
export function LocationCard({ id, name, type }) {
  return (
    <li className="text-card">
      <Link to={`/locations/${id}`}>
        <div className="wrapper">
          <p><b>{name}</b></p>
          <p>{type}</p>
        </div>
      </Link>
    </li>
  );
}

LocationCard.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export function LoadingCard() {
  return (
    <div className="loading">
      <div className="spin"></div>
    </div>
  )
}