import React from 'react';
import 'C:/Users/Jafar Mahmood/admin-dashboard/src/assets/styles/Table.css';

const Table = ({ data, columns, renderActions }) => {
  if (!data) {
    return <p>Loading data...</p>;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.header}</th>
          ))}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            {columns.map((col) => (
              <td key={col.key}>{item[col.key]}</td>
            ))}
            <td>
              {renderActions(item)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;