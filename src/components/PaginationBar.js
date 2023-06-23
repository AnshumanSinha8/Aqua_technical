import React from 'react';

const PaginationBar = ({ currentPage, pageSize, totalRecords, onPageChange }) => {
  const totalPages = Math.ceil(totalRecords / pageSize);
  const maxPageButtons = 5;
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    onPageChange(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    if (endPage - startPage < maxPageButtons - 1) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <li key={i} className={currentPage === i ? 'active' : ''}>
          <button onClick={() => handlePageClick(i)}>{i}</button>
        </li>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="pagination-bar">
      <button onClick={handlePrevPage} disabled={currentPage === 1}>
        Prev
      </button>
      <ul className="page-numbers">{renderPageNumbers()}</ul>
      <button onClick={() => handlePageClick(totalPages)}>Last</button>
      <button onClick={handleNextPage} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
  );
};

export default PaginationBar;