import React from 'react';

const SearchBar = ({ onSearch }) => {
  const handleInputChange = (e) => {
    const searchQuery = e.target.value;
    onSearch(searchQuery);
  };

  return (
    <div className="search-bar">
      <input type="text" placeholder="Search..." onChange={handleInputChange} />
    </div>
  );
};

export default SearchBar;