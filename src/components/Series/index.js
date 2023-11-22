import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import Star from "../../icons/Star";
import price from "../../csvjson.json";
import data from "../../data.json";

import { useRecoilState } from "recoil";
import {
  LoginState,
  ageFilterState,
  UserIdState,
} from "../../recoilContextProvider";

import { useSelector } from "react-redux";
import { Toaster, toast } from "react-hot-toast";
const Series = () => {
  const navigate = useNavigate();
  const params = useParams();
  const decodedSeries = decodeURIComponent(params.series);
  const seriesBook = data.filter((item) => item.Series === decodedSeries);
  const {
    main: { isLoggedIn },
  } = useSelector((state) => state);
  

  const [userIdState, setUserIdState] = useRecoilState(UserIdState);
  const initialExpandedState = Array(seriesBook.length).fill(false);
  const [expanded, setExpanded] = useState(initialExpandedState);
  const [seriesBooks, setSeriesBooks] = useState(null);

  const [wishClickedMap, setWishClickedMap] = useState({});
  const [wishListBooks, setWishListBooks] = useState([]);

  const toggleExpanded = (index) => {
    const updatedExpanded = [...expanded];
    updatedExpanded[index] = !updatedExpanded[index];
    setExpanded(updatedExpanded);
  };

  const limitDescription = (description, limit) => {
    if (description) {
      if (description.split(" ").length > limit) {
        return description.split(" ").slice(0, limit).join(" ") + " ...";
      }
      return description;
    } else {
      return "";
    }
  };

  useEffect(() => {
    async function fetchBooks() {
      console.log(1);
      const response = await axios.get(
        `https://server.brightr.club/api_v2_books/getBooksByCategory?category_name=${params.series}`
      );

      setSeriesBooks(response.data.books_in_category);

      if (seriesBooks) {
        console.log(seriesBooks);
      }
    }
    fetchBooks();
  }, []);

  useEffect(() => {
    if (seriesBooks) {
      console.log(seriesBooks[0].image);
    }
  }, [seriesBooks]);

  const addToReadList = async (isbn) => {
    const isbnData = {
      isbn: isbn,
    };
    
    try {
      // Check if the book is already in the wishlist
      const isBookInWishlist = wishListBooks.some((book) => book.isbn === isbn);

      if (!isBookInWishlist) {
        // If the book is not in the wishlist, make the API call
        const response = await axios.post(
          `https://server.brightr.club/api_v2/add-to-wishlist`,
          isbnData,
          { withCredentials: true }
        );

        // Update wishListBooks state with the new book
        setWishListBooks((prevBooks) => [...prevBooks, response.data]);

        // Update wishClickedMap to mark the book as clicked
        setWishClickedMap((prevMap) => {
          const updatedMap = { ...prevMap };
          updatedMap[isbn] = true;
          return updatedMap;
        });

        toast.success("Added to readlist");
      } else {
        // If the book is already in the wishlist, make the API call to remove

        try {
          const response = await axios.post(
            `https://server.brightr.club/api_v2/wishlist-remove`,
            isbnData,
            { withCredentials: true }
          );

          // Update wishListBooks state by removing the book
          setWishListBooks((prevBooks) =>
            prevBooks.filter((book) => book.isbn !== isbn)
          );

          // Update wishClickedMap to mark the book as not clicked
          setWishClickedMap((prevMap) => {
            const updatedMap = { ...prevMap };
            updatedMap[isbn] = false;
            return updatedMap;
          });

          toast.error("Removed From Readlist");
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    async function fetchBookSet() {
      try {
        const response = await axios.get(
          `https://server.brightr.club/api_v2/get-wishlists?guid=${userIdState}`,
          { withCredentials: true }
        );
        setWishListBooks(response.data.wishlists);

        // Initialize wishClickedMap based on books in the wishlist
        const initialWishClickedMap = {};
        response.data.wishlists.forEach((book) => {
          initialWishClickedMap[book.isbn] = true;
        });
        setWishClickedMap(initialWishClickedMap);
      } catch (error) {
        console.error(error);
      }
    }
    fetchBookSet();
  }, []);
  return (
    <div>
      {seriesBooks && (
        <div className=" mt-4 mx-4 md:mx-10">
          <div className=" flex gap-10 md:gap-32 lg:gap-48">
            <div className="relative flex justify-center items-center ml-3 md:ml-0">
              <div className="flex justify-center relative ">
                <img
                  alt=""
                  src={seriesBooks[0].image}
                  className=" h-12  md:h-24 mx-4"
                />
                {seriesBooks[1] && (
                  <img
                    alt=""
                    src={seriesBooks[1].image}
                    className=" h-12  md:h-24 mx-4"
                  />
                )}
              </div>
              {seriesBooks[2] && (
                <img
                  alt=""
                  src={seriesBooks[2].image}
                  className=" h-12  md:h-24 absolute top-0 left-1/2 transform -translate-x-1/2"
                  style={{ zIndex: 1 }}
                />
              )}
            </div>

            <div className="flex flex-col gap-2 md:gap-5">
              <div className="text-[18px] md:text-[30px] font-medium">
                <h1>{decodedSeries} Collection</h1>
                <h1>({seriesBooks.length}) books</h1>
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-8">
            <hr />
            <div className=" text-black text-[18px] font-bold mt-4">
              Books in this series ({seriesBooks.length}) books
            </div>
            <div className=" flex flex-col gap-4 ">
              {seriesBooks.map((book, index) => (
                <>
                  <div className="flex gap-4 md:gap-32 lg:gap-44">
                    <img
                      onClick={() => navigate(`/book/${book.isbn}`)}
                      className="h-36 md:h-64  cursor-pointer"
                      src={book.image}
                    />
                    <div className=" flex flex-col gap-2 ">
                      <h1 className=" text-[16px] md:text-[20px] font-semibold">
                        {book.name}
                      </h1>
                      <div className="flex flex-col text-[12px] md:text-[16px] ">
                        <div className=" flex font-medium gap-2">
                          {book.authors != "null" &&
                            book.authors.map((author) => (
                              <h1 key={author.id}>
                                <Link to={`/author/${author}`}>{author}</Link>
                              </h1>
                            ))}
                        </div>
                        <h1 className=" flex gap-1">
                          <>{book.rating}</>
                          <>
                            <Star />
                          </>
                          <> ({book.review_count}) Reviews</>
                        </h1>
                      </div>
                      {isLoggedIn && (
                        <button
                          onClick={() => addToReadList(book.isbn)}
                          style={{ border: `1px solid  ${ wishClickedMap[book.isbn]
                            ? "#6b7820"
                            : "#FFCE44"}` }}
                          className={`font-bold  tracking-widest p-[0.1rem] w-48 rounded text-[#FFD700] border-[#FFD700] text-[16px] border first-letter first-letter
                          ${
                            wishClickedMap[book.isbn]
                              ? "text-gray-500 border-gray-500"
                              : "text-[#FFCE44] border-[#FFCE44] text-[12px]"
                          }`}
                        >
                          ADD TO Wishlist
                        </button>
                      )}
                      <div
                        className={`text-[12px] md:text-[16px] md:w-[30vw] lg:w-[50vw] ${
                          expanded[index] ? "" : "line-clamp-3"
                        }`}
                      >
                        {expanded[index]
                          ? book.description
                          : limitDescription(book.description, 10)}
                      </div>
                      {book.description && book.description.length > 10 && (
                        <button
                          onClick={() => toggleExpanded(index)}
                          className="text-blue-500 cursor-pointer text-left text-[12px] md:text-[16px]"
                        >
                          {expanded[index] ? "Read Less" : "Read More"}
                        </button>
                      )}
                      {book.isbn &&
                        price.find((item) => item.ISBN === book.isbn) &&
                        price.find((item) => item.ISBN === book.isbn)
                          .BoardBook > 2 && (
                          <div className="text-[16px] font-bold">
                            Amazon Price (BoardBook): ₹
                            {
                              price.find((item) => item.ISBN === book.isbn)
                                .BoardBook
                            }
                          </div>
                        )}
                      {book.isbn &&
                        price.find((item) => item.ISBN === book.isbn) &&
                        price.find((item) => item.ISBN === book.isbn)
                          .Hardcover > 2 && (
                          <div className="text-[16px] font-bold">
                            Amazon Price (Hardcover): ₹
                            {
                              price.find((item) => item.ISBN === book.isbn)
                                .Hardcover
                            }
                          </div>
                        )}
                      {book.isbn &&
                        price.find((item) => item.ISBN === book.isbn) &&
                        price.find((item) => item.ISBN === book.isbn)
                          .Paperback > 2 && (
                          <div className="text-[16px] font-bold ">
                            Amazon Price (Paperback): ₹
                            {
                              price.find((item) => item.ISBN === book.isbn)
                                .Paperback
                            }
                          </div>
                        )}
                    </div>
                  </div>
                  <hr />
                </>
              ))}
            </div>
          </div>
        </div>
      )}
      <Toaster />
    </div>
  );
};

export default Series;
