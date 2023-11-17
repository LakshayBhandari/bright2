import React ,{useState,useEffect}from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import { Link } from 'react-router-dom';
import Star from '../../icons/Star';
import price from "../../csvjson.json";
import data from "../../data.json";

import {  useSelector } from "react-redux";
const Series = () => {
  const navigate = useNavigate();
    console.log(1)
    const params = useParams();
    console.log(params.series);
    const decodedSeries = decodeURIComponent(params.series);
    const seriesBook = data.filter((item) => item.Series === decodedSeries);
    const {
      main: { isLoggedIn },
    } = useSelector((state) => state);
  
    
  const initialExpandedState = Array(seriesBook.length).fill(false);
  const [expanded, setExpanded] = useState(initialExpandedState);
  const [seriesBooks, setSeriesBooks] = useState(null);

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
        console.log(1)
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

  const addToReadList = (isbn) => {
    async function addToReadList(isbn) {
      const isbnData = {
        isbn: isbn,
      };
      try {
        const response = await axios.post(
          `https://server.brightr.club/api_v2/add-to-wishlist`,
          isbnData,
          { withCredentials: true }
        );
      //  toast.success('Added to WishList')
        
      } catch (error) {
        console.error()
      }
    }
    addToReadList(isbn);
  };
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
                      {isLoggedIn &&<button 
                      onClick={()=>addToReadList(book.isbn)}
                      className=" font-bold  tracking-widest p-[0.1rem] w-48 rounded text-[#FFD700] border-[#FFD700] text-[16px] border" style={{border:"1px solid #FFD700"}}>
                        ADD TO Wishlist
                      </button>}
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
                          .BoardBook >2 && (
                          <div className="text-[16px] font-bold">
                            Amazon Price (BoardBook):{" "}₹
                            {
                              price.find((item) => item.ISBN === book.isbn)
                                .BoardBook
                            }
                          </div>
                        )}
                      {book.isbn &&
                        price.find((item) => item.ISBN === book.isbn) &&
                        price.find((item) => item.ISBN === book.isbn)
                          .Hardcover >2&& (
                          <div className="text-[16px] font-bold">
                            Amazon Price (Hardcover):{" "}₹
                            {
                              price.find((item) => item.ISBN === book.isbn)
                                .Hardcover
                            }
                          </div>
                        )}
                      {book.isbn &&
                        price.find((item) => item.ISBN === book.isbn) &&
                        price.find((item) => item.ISBN === book.isbn)
                          .Paperback >2&& (
                          <div className="text-[16px] font-bold ">
                            Amazon Price (Paperback):{" "}₹
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
     
    </div>
  )
}

export default Series