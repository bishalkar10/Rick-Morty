import { Link } from 'react-router-dom';

export function DataTable(data) {

  return (
    <table>
      <tbody>
        
        <tr>
          <th>Species</th>
          <td><Link to={`/characters?species=${data.species.toLowerCase()}`}>{data.species}</Link></td>
        </tr>
        <tr>
          <th>Gender</th>
          <td><Link to={`/characters?gender=${data.gender.toLowerCase()}`}>{data.gender}</Link></td>
        </tr>
        <tr>
          <th>Origin</th>
          <td>{data.origin}</td>
        </tr>
        <tr>
          <th>Location</th>
          <td><Link to={`/locations/${data.locationID}`}>{data.location}</Link></td>
        </tr>
        <tr>
          <th>Dimension</th>
          <td>{data.dimension}</td>
        </tr>
        <tr>
          <th>Amount Of Residents</th>
          <td>{data.amountOfResidents}</td>
        </tr>
      </tbody>
    </table>
  );
}
