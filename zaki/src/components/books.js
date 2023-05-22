import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "../tailwind.css";
import { Link } from "react-router-dom";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [displayedPages, setDisplayedPages] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, [page, perPage]);

  useEffect(() => {
    const pages = Array.from({ length: Math.min(totalPages, 10) }, (_, index) => index + 1);
    setDisplayedPages(pages);
  }, [totalPages]);

  const fetchBooks = async () => {
    const { data: allBooks, error } = await supabase.from("BOOK_INFO").select("*");
    if (error) {
      console.log("Error fetching books:", error.message);
    } else {
      setBooks(allBooks);
      const count = allBooks.length;
      setTotalCount(count);
      const totalP = Math.ceil(count / perPage);
      setTotalPages(totalP);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleNextPage = () => {
    const nextPage = page + 1;
    if (nextPage <= totalPages) {
      setPage(nextPage);
    }
  };

  const handleGoToPage = (event) => {
    const goToPage = parseInt(event.target.value, 10);
    if (!isNaN(goToPage) && goToPage >= 1 && goToPage <= totalPages) {
      setPage(goToPage);
    }
  };

  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const displayedBooks = books.slice(startIndex, endIndex);

  return (
    <>
      <div className="holder mx-auto mt-3 w-10/12 grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayedBooks.map((book) => (
          <div key={book.id} className="card flex flex-col items-center border border-black p-4 h-96">
            <div className="card__image-holder flex-shrink-0">
              <a href="#">
                <img className="card__image h-40 object-cover" src={book.Image} alt={book.title} />
              </a>
            </div>
            <div className="card-title text-center mt-4 flex-grow mb-2">
              <a href="#">
                <h3 className="h-24 overflow-hidden">{book.Title}</h3>
              </a>
            </div>
            <div className="card-description text-center mt-2 flex-grow">
              <p className="h-3 overflow font-medium text-gray-600">{book.Category}</p>
            </div>
            <div className="card-footer mt-4">
              <Link
                to={`/r_book/${book.ISBN}`}
                state={{ from: book }}
                className="btn btn--primary btn--inside uppercase text-sm py-2 px-4 rounded-full bg-blue-500 text-white font-semibold hover:bg-blue-600 transition duration-200"
              >
                Read More
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination mt-4 flex justify-center pb-2">
        {displayedPages.map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            className="pagination__item px-2 py-1 mx-1 bg-gray-300 rounded"
          >
            {pageNumber}
          </button>
        ))}
        {totalPages > 10 && (
          <>
            <button onClick={handleNextPage} className="pagination__item px-2 py-1 mx-1 bg-gray-300 rounded">
              Next
            </button>
            <div className="pagination__item">
              <input
                type="number"
                min="1"
                max={totalPages}
                onChange={handleGoToPage}
                className="border border-gray-300 rounded px-2 py-1 mx-1"
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Books;
