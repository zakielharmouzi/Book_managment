import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import Navbar from "./navbar";
import LoadingSpinner from "./loading";

const AdminView = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [isbn, setISBN] = useState("");
  const [category, setCategory] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  const handleAddBook = async () => {
    if (!title || !author || !publisher || !isbn || !category || !imageLink) {
    alert("Please provide all the book details");
      return;
    }
    setIsLoading(true);
    const { data } = await supabase.from("BOOK_INFO").select("*").order("ID", { ascending: false }).limit(1);
    console.log(data);
    
    try {
      const { error } = await supabase.from("BOOK_INFO").insert([
        {
            Title: title,
            ID: data[0].ID+1,
            Author: author,
            Publication_info: publisher,
            ISBN: isbn,
            Category: category,
            Image: imageLink,
            status:'Available'
        },
      ]);

      if (error) {
        console.error(error);
      } else {
        console.log("Book added successfully");
        setTitle("");
        setAuthor("");
        setPublisher("");
        setISBN("");
        setCategory("");
        setImageLink("");
      }
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  };

  const handleRemoveBook = async (bookId) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.from("books").delete().eq("ID", bookId);

      if (error) {
        console.error(error);
      } else {
        console.log("Book removed successfully");
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const getRole = async () => {
    setUser(JSON.parse(sessionStorage.getItem("token")).user.email);
    setIsLoading(true);
    const { data, error } = await supabase
      .from("users")
      .select("role")
      .eq("email", user);
    console.log(data);
    setIsLoading(false);
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

  useEffect(() => {
    getRole().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        if (data.data[0].role !== "ADMIN") {
          alert("HMMMM You are not an admin");
          window.location.href = "/homepage";
        }
      }
    });
  }, [user]);

  return (
    <>
      <Navbar />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold">Admin Page</h1>

          <div className="flex flex-col items-center justify-center mt-4">
            <h2 className="text-xl font-bold mb-2">Add Book</h2>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 mb-2"
            />
            <input
              type="text"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 mb-2"
            />
            <input
              type="text"
              placeholder="Publisher"
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 mb-2"
            />
            <input
              type="text"
              placeholder="ISBN"
              value={isbn}
              onChange={(e) => setISBN(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 mb-2"
            />
            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 mb-2"
            />
            <input
              type="text"
              placeholder="Image Link"
              value={imageLink}
              onChange={(e) => setImageLink(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 mb-2"
            />
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              onClick={handleAddBook}
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Book"}
            </button>
          </div>

          <div className="flex flex-col items-center justify-center mt-8">
            <h2 className="text-xl font-bold mb-2">Remove Book</h2>
            <input
              type="text"
              placeholder="Book ID"
              className="border border-gray-300 rounded-md px-2 py-1 mb-2"
            />
            <button
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
              onClick={handleRemoveBook}
              disabled={isLoading}
            >
              {isLoading ? "Removing..." : "Remove Book"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminView;
