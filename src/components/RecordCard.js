import React from 'react';
import '../../src/App.css';

const RecordCard = ({ record }) => {
  return (
    <div className="record-card">
      <h3>Name: {record.first_name} {record.last_name}</h3>
      <p>Age: {record.age}</p>
      <p>SSN: {record.ssn}</p>
      <p>Address: {record.address_street}, {record.address_city}, {record.address_state}, {record.address_zip}</p>
    </div>
  );
};

export default RecordCard;
