export function DataTable(data) {
  return (

    <table>
      <tbody>
        {Object.entries(data).map(([key, value], index) => (
          <tr key={index}>
            <th>{key}</th>
            <td>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>

  );
}
