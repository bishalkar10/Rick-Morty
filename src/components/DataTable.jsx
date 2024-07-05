import { Link } from 'react-router-dom'; // Import Link from react-router-dom

export function DataTable(data) {

  return (
    <table>
      <tbody>
        {/* Wrap species and gender in a Link */}
        <tr>
          <th>Species</th>
          <td><Link to={`/characters?species=${data.species}`}>{data.species}</Link></td>
        </tr>
        <tr>
          <th>Gender</th>
          <td><Link to={`/characters?gender=${data.gender}`}>{data.gender}</Link></td>
        </tr>
        {/* Format location with a dynamic ID */}
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
