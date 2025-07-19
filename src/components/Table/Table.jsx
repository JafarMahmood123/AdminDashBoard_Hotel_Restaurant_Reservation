import './Table.css';

/**
 * A reusable table component.
 * @param {object[]} columns - Array of column configurations.
 * @param {string} columns[].header - The text to display in the table header.
 * @param {string} columns[].accessor - The key to access the data in the row object.
 * @param {function} [columns[].Cell] - Optional custom render function for the cell.
 * @param {object[]} data - Array of data objects to display in the table.
 */
const Table = ({ columns, data }) => {
  if (!data || data.length === 0) {
    return <p>No data available.</p>;
  }

  return (
    <div className="table-container">
      <table className="responsive-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.accessor}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={row.id || rowIndex}>
              {columns.map((col) => (
                <td key={col.accessor} data-label={col.header}>
                  {col.Cell ? col.Cell({ row }) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
