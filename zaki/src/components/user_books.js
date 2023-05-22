import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import {  useLocation } from "react-router-dom";
import LoadingSpinner from "./loading";
import Navbar from "./navbar";


const UserBooks = () => {
  const [info, setInfo] = useState(null);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [bookInfo, setBookInfo] = useState(null);

  const setUserEmail = async () => {
    
    const token = await JSON.parse(sessionStorage.getItem("token"));
    if (token) {
      setUser(token.user.email);
      console.log(token.user.email);
    }
    setIsLoading(true);
    const { data, error } = await supabase
      .from("Reserved_books")
      .select("ID")
      .eq("Reserver_email", user);
    console.log(data);
    if (error) {
      console.log(error);
      return {
        error,
        data,
      };
    } else {
      return {
        error: null,
        data,
      };
    }
  };

  const getInfo = async (data) => {
    let idArr = [];
    console.log(idArr);
    data.data.map((book) => {
      idArr.push(book.ID);
    });

    try {
      const { data: result, error } = await supabase.rpc("get_books_data", {
        book_ids: idArr,
      });

      if (error) {
        console.error(error);
      } else {
        console.log(result);
        setBookInfo(result);
        // Process the book data returned in the `result` variable
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setUserEmail().then((data) => {
      if (user !== null) {
        if (data.error) {
          console.log(data.error);
          setIsLoading(false);
        } else {
          setInfo(data.data);
          getInfo(data);
          setIsLoading(false);
        }
      } else {
        return;
      }
    });
  }, [user]);

  const handleRemoveBook = async (bookId) => {
  
    console.log("Removing book:", bookId);
    const { error } = await supabase
        .from("Reserved_books")
        .delete()
        .eq("ID", bookId);

    const { error2 } = await supabase.rpc('update_status_2', { book_id: bookId });
    if (error || error2) {
        console.log(error);
        console.log(error2);
    }
        window.location.reload();
  };

  const handleExtendDeadline = async (bookId) => {
    console.log("Extending deadline for book:", bookId);    
    const date_end = new Date();
    date_end.setDate(date_end.getDate() + 30);
    const { error } = await supabase.from("Reserved_books").update({ extended:"true"},{Borrowed_date_end:date_end}).eq("ID", bookId);
  };

  return (
    <>
      <Navbar />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold pb-1">Your Books</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {bookInfo ? (
              bookInfo.map((book) => (
                <div
                  key={book.id}
                  className="bg-white rounded-lg shadow-lg p-4"
                >
                  <img
                    src={book.Image}
                    alt="book"
                    className="w-full h-48 object-cover mb-2"
                  />
                  <h1 className="text-lg font-bold mb-2">{book.Title}</h1>
                  <p className="text-sm text-gray-600">{book.Author}</p>
                  <p className="text-sm text-gray-600">{book.Publisher}</p>
                  <p className="text-sm text-gray-600">{book.Publish_date}</p>
                  <p className="text-sm text-gray-600">{book.Category}</p>
                  <div className="flex justify-between mt-4">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                      onClick={() => handleRemoveBook(book.ID)}
                    >
                      Remove
                    </button>
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                      onClick={() => handleExtendDeadline(book.ID)}
                    >
                      Extend Deadline
                    </button>
                  </div>
                </div>
              ))
            ) : (
                <div className="flex flex-col items-center justify-center">
                <p className="text-lg font-bold">No books reserved yet!</p>
                
                </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UserBooks;
