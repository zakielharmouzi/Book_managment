import Navbar from "./navbar";
import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useLocation } from "react-router-dom";
import LoadingSpinner from "./loading";

const Book = () => {
    const [info, setInfo] = useState(null);
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(null);
    const id = location.pathname.split("/")[2];
    const reservationDate = new Date().toISOString();
    const end_date = new Date();
    end_date.setDate(end_date.getDate() + 30);
    const returnDate = end_date.toISOString();


  const fetchBook = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from("BOOK_INFO").select("*").eq("ISBN", id);
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

  useState(() => {
    setUser(JSON.parse(sessionStorage.getItem("token")).user.email);
    fetchBook().then((data) => {
      if (data.error) {
        console.log(data.error);
        setIsLoading(false);
      } else {
        setInfo(data.data[0]);
        setIsLoading(false);
      }
    });
  });

  const handleReserve = async() => {
    
    const { data, error } = await supabase
    .from('Reserved_books')
    .insert([
        { Reserver_email: user, ISBN: info.ISBN,ID:info.ID,Borrow_date_start:reservationDate,Borrow_date_end:returnDate},
  ])
    if (error) {   
        console.log(error);
        }
    else{
        alert("Book Reserved");
        console.log(info.ID);
    let { data, error } = await supabase
  .rpc('update_status', {
    book_id:info.ID
  })

if (error) console.error(error)
else console.log(data)
    }
  };

  return (
    <>
      <Navbar />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          {info ? (
            <div className="flex flex-col items-center justify-center">
              <table className="border-collapse border border-gray-500">
                <tbody>
                  <tr>
                    <td className="border border-gray-500 px-4 py-2">Title:</td>
                    <td className="border border-gray-500 px-4 py-2">{info.Title}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-500 px-4 py-2">Author:</td>
                    <td className="border border-gray-500 px-4 py-2">{info.Author}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-500 px-4 py-2">ISBN:</td>
                    <td className="border border-gray-500 px-4 py-2">{info.ISBN}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-500 px-4 py-2">Publication Info:</td>
                    <td className="border border-gray-500 px-4 py-2">{info.Publication_info}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-500 px-4 py-2">Category:</td>
                    <td className="border border-gray-500 px-4 py-2">{info.Category}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-500 px-4 py-2">Status:</td>
                    <td className="border border-gray-500 px-4 py-2">{info.status}</td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-4">
                <button
                  onClick={handleReserve}
                  className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
                >
                  Reserve
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-3xl font-bold text-gray-800">No Book Found</h1>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Book;
