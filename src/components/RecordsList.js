import React from 'react';
import RecordCard from './RecordCard';
import '../../src/App.css';

const RecordsList = ({ records }) => {
  return (
    <div className="record-list">
      {records.map(record => (
        <RecordCard key={record.personid} record={record} />
      ))}
    </div>
  );
};

export default RecordsList;