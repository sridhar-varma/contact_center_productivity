import React from 'react';
import './PreviousInfo.css'; // Import PreviousInfo.css for styling

const PreviousInfo = ({ data }) => {
  // Check if data array is empty
  const isEmpty = data.length === 0;

  return (
    <div className="previous-info">
      <h2>Previous Info</h2>
      {isEmpty ? (
        <p>No previous information available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Intent</th>
              <th>Summary</th>
              <th>Call ID</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.status}</td>
                <td>{item.intent}</td>
                <td>{item.summary}</td>
                <td>{item.callId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PreviousInfo;
