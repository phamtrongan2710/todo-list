
import { useState } from 'react'
import { GrFormPrevious } from "react-icons/gr";
import { GrFormNext } from "react-icons/gr";

export default function Pagination({ itemsPerPage, totalItems, currentPage, paginate }) {
  const [activePage, setActivePage] = useState(currentPage);

  let pageNumbers = []
  const lastPage = Math.ceil(totalItems / itemsPerPage);
  const startPage = currentPage >= 2 ? currentPage - 1 : currentPage;
  const endPage = currentPage <= lastPage - 1 ? currentPage + 1 : lastPage;;

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const handlePageClick = (pageNumber) => {
    setActivePage(pageNumber);
    paginate(pageNumber);
  }

  return (
    <ul className="pagination">
      {activePage > 1 && (
        <li>
          <a onClick={() => handlePageClick(activePage - 1)}>
            <GrFormPrevious />
          </a>
        </li>
      )}

      {pageNumbers.map(number => (
        <li key={number} className={activePage === number ? 'active' : ''}>
          <a onClick={() => handlePageClick(number)}>{number}</a>
        </li>
      ))}

      {activePage < pageNumbers.length && (
        <li>
          <a onClick={() => handlePageClick(activePage + 1)}>
            <GrFormNext />
          </a>
        </li>
      )}
    </ul>
  );
}
