import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "../tailwind.css";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(8);

  useEffect(() => {
    fetchBooks();
  }, [page, perPage]);

  const fetchBooks = async () => {
    const { data: allBooks, error } = await supabase
      .from("BOOK_INFO")
      .select("*");

    if (error) {
      console.log("Error fetching books:", error.message);
    } else {
      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      const booksOnPage = allBooks.slice(startIndex, endIndex);
      setBooks(booksOnPage);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    fetchBooks();
  }, [page, perPage]);

  const totalPages = Math.ceil(books.length / perPage);

  return (
    <>
      <div className="holder mx-auto mt-3 w-10/12 grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {books.map((book) => (
        <div key={book.id} className="card flex flex-col items-center border border-black p-4">
          <div className="card__image-holder">
              <a href="#">
                <img
                  className="card__image"
                  src={book.Image}
                  alt={book.title}
                />
              </a>
            </div>
            <div className="card-title text-center mt-4">
              <a href="#">
                <h2>{book.Title}</h2>
              </a>
            </div>
            <div className="card-description text-center mt-2">
              <p>{book.Category}</p>
            </div>
            <div className="card-footer mt-4">
              <a href="#" className="btn btn--primary btn--inside uppercase">
                Read More
              </a>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination mt-4">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`pagination__item ${
              index + 1 === page ? "pagination__item--active" : ""
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </>
  );
};

export default Books;
