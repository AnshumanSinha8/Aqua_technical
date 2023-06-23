import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RecordsList from './components/RecordsList';
import PaginationBar from './components/PaginationBar';
import './App.css';

const App = () => {
  const [records, setRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const pageSize = 30;

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/records/paginated', {
          params: {
            page: currentPage,
            pageSize: pageSize,
          },
        });
        setRecords(response.data);
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };

    const fetchTotalRecords = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/records/count');
        setTotalRecords(response.data.count);
      } catch (error) {
        console.error('Error fetching total records count:', error);
      }
    };

    fetchRecords();
    fetchTotalRecords();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = async (query) => {
    try {
      const response = await axios.get('http://localhost:8000/api/records/search', {
        params: {
          query: query,
        },
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching records:', error);
    }
  };

  const handleInputChange = (event) => {
    const query = event.target.value;
    setSearchTerm(query);
    handleSearch(query);
  };

  return (
    <div>
      <h2 className="H2-title">Records</h2>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Search records..."
      />
      <RecordsList records={searchResults.length > 0 ? searchResults : records} />
      <PaginationBar
        currentPage={currentPage}
        pageSize={pageSize}
        totalRecords={totalRecords}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default App;
