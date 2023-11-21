import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  LoginState,
  ageFilterState,
  UserIdState,
} from "../../recoilContextProvider";
import Star from "../../icons/Star";
import Community from "../../icons/Community";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast, Toaster } from "react-hot-toast";
const BrowseLibraryByGenre = () => {
  const ageRefs = Array(13)
    .fill(null)
    .map(() => React.createRef());

  const [loginState, setLoginState] = useRecoilState(LoginState);
  const {
    main: { isLoggedIn },
  } = useSelector((state) => state);
  const [ageFilter, setAgeFilter] = useRecoilState(ageFilterState);
  const [loading, setLoading] = useState(false);
  const [topBooks, setTopBooks] = useState(null);
  const [bestSeller, setBestSellers] = useState(null);
  const [teachersPick, setTeachersPick] = useState(null);
  const [tags, setTags] = useState(null);
  const [genre, setGenre] = useState(null);
  const [previousBooks, setpreviousBooks] = useState([]);
  const [wishClickedMap, setWishClickedMap] = useState({});
  const [wishListBooks, setWishListBooks] = useState([]);
  const navigate = useNavigate();
  const [userIdState, setUserIdState] = useRecoilState(UserIdState);

  // Create a state variable to store the selected agey
  const [selectedAge, setSelectedAge] = useState(ageFilter);

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

  useEffect(() => {
    async function fetchBookSet() {
      try {
        const response = await axios.get(
          `https://server.brightr.club/api_v2/get-previous-books?guid=${userIdState}`,
          { withCredentials: true }
        );
        setpreviousBooks(response.data.books);
      } catch (error) {
        console.error(error);
      }
    }
    fetchBookSet();
  }, []);
  // Update the selected age when ageFilter changes
  useEffect(() => {
    setSelectedAge(ageFilter);
  }, [ageFilter]);

  // Handle the age selection
  const handleAgeClick = (age) => {
    setSelectedAge(age);
    setAgeFilter(age);
  };

  useEffect(() => {
    async function fetchBookSet() {
      setLoading(true);
      const response = await axios.get(
        `https://server.brightr.club/api_v2_books/getTopBooksByReviewCount?age=${ageFilter}`,
        { withCredentials: true }
      );
      setTopBooks(response.data.top_books_by_review_count);
    }

    fetchBookSet();
  }, [ageFilter]);

  useEffect(() => {
    async function fetchBookSet() {
      setLoading(true);
      const response = await axios.get(
        `https://server.brightr.club/api_v2_books/getGlobalBestsellersByAge?age=${ageFilter}`,
        { withCredentials: true }
      );
      setBestSellers(response.data.global_bestsellers_by_age);
    }

    fetchBookSet();
  }, [ageFilter]);

  useEffect(() => {
    async function fetchBookSet() {
      setLoading(true);
      const response = await axios.get(
        `https://server.brightr.club/api_v2_books/getTeacherPicksByAge?age=${ageFilter}`,
        { withCredentials: true }
      );
      setTeachersPick(response.data.teacher_picks_by_age);
    }
    fetchBookSet();
  }, [ageFilter]);

  useEffect(() => {
    async function fetchBookSet() {
      setLoading(true);
      const response = await axios.get(
        `https://server.brightr.club/api_v2_books/get-must-read-set?category_count=7&book_count=6&section_name=Most+Searched+Tags&randomize_categories=true&age=${ageFilter}&show_unavailable=true`,
        { withCredentials: true }
      );
      setTags(response.data);
    }

    fetchBookSet();
  }, [ageFilter]);

  useEffect(() => {
    async function fetchBookSet() {
      setLoading(true);
      const response = await axios.get(
        `https://server.brightr.club/api_v2_books/get-books-by-genre?age=${ageFilter}&start=0&end=3`,
        { withCredentials: true }
      );
      setGenre(response.data.book_set);
    }
    fetchBookSet();
  }, [ageFilter]);

  React.useEffect(() => {
    if (ageRefs[selectedAge].current) {
      ageRefs[selectedAge].current.scrollIntoView({
        behavior: "auto",
        block: "nearest",
        inline: "center",
      });
    }
  }, []);

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

  return (
    <>
      <h1
        id="book-slider"
        className="font-semibold w-full items-center text-center xl:text-[32px] md:text-[24px] sm:[20px] text-[#4285f4] mt-4"
      >
        Select By Age
      </h1>
      <div className="mx-2 md:mx-24">
        <div
          id="book-slider"
          className="mt-4 w-full h-[150px] flex gap-8 overflow-x-auto"
        >
          {Array(13)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                ref={ageRefs[index]}
                className={`text-black flex-col font-extrabold text-[24px] flex items-center justify-center h-[128px] min-w-[128px] rounded-[50%] cursor-pointer ${
                  index === selectedAge
                    ? "bg-[#4285f4] text-white"
                    : "bg-[#DBDBDB] text-black "
                }`}
                style={{
                  boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.2)",
                  border: `1px solid ${
                    index === selectedAge ? "#2a6ddc" : "c5c5c5"
                  }`,
                }}
                onClick={() => handleAgeClick(index)}
              >
                <div>{index}+</div>
                <div>Age</div>
              </div>
            ))}
        </div>
      </div>

      <div>
        {topBooks && (
          <>
            <h1 className="mt-4 mb-4 ml-[1rem] md:ml-[3rem] text-[20px] font-extrabold text-blue-900">
              {" "}
              Top Books By Age{" "}
            </h1>
            <div
              id="book-slider"
              className={`scrollbar-hide md:w-98 overflow-auto gap-4 flex px-1 md:px-[3rem] py-[1rem] bg-[#ecf3fe] ${
                topBooks.length < 6 ? "justify-center" : ""
              }`}
            >
              {previousBooks &&
                topBooks
                  .filter(
                    (book) =>
                      !previousBooks.some(
                        (prevBook) => prevBook.isbn === book.isbn
                      )
                  )
                  .slice(0, 10)
                  .map((book, index) => (
                    <div
                      key={book.isbn}
                      className="cursor-pointer bg-white flex flex-col min-w-[220px] p-[1rem] relative"
                    >
                      <div className="relative">
                        <div className="absolute bottom-[-20px] left-0">
                          <span className="text-[50px] font-semibold relative">
                            <span
                              className="text-[white] bg-transparent rounded-full m-0 p-0 leading-none"
                              style={{
                                textShadow:
                                  "-2px 0 #4285f4, 0 2px #4285f4, 2px 0 #4285f4, 0 -2px #4285f4",
                              }}
                            >
                              {index + 1}
                            </span>
                          </span>
                        </div>
                        {previousBooks.some(
                          (prevBook) => prevBook.isbn === book.isbn
                        ) && (
                          <div className="text-white bg-red-600 text-center">
                            Already Read
                          </div>
                        )}
                        <img
                          onClick={() => navigate(`/book/${book.isbn}`)}
                          className="flex h-[190px] content-center overflow-hidden object-fill"
                          src={book.image}
                          alt={"book_name"}
                        />
                      </div>
                      <p className="text-[15px] max-h-5 font-semibold overflow-hidden">
                        {" "}
                        {book.name.substring(0, 23) +
                          (book.name.length > 23 ? "..." : "")}{" "}
                      </p>
                      <div
                        className="flex justify-between gap-1 items-center mt-2"
                        style={{ fontSize: "12px" }}
                      >
                        <div className="flex items-center gap-1">
                          {" "}
                          {book.rating} <Star /> <div>|</div>{" "}
                          {typeof book.review_count === "string"
                            ? parseInt(
                                book.review_count.replace(/,/g, ""),
                                10
                              ) >= 1000
                              ? parseFloat(
                                  book.review_count
                                    .replace(/,/g, "")
                                    .replace("K", "")
                                ) >= 1000
                                ? (
                                    parseFloat(
                                      book.review_count
                                        .replace(/,/g, "")
                                        .replace("K", "")
                                    ) / 1000
                                  ).toFixed(1) + "K"
                                : book.review_count.replace(/,/g, "")
                              : book.review_count
                            : book.review_count}{" "}
                          <img src="/icons/reviews.png" alt="Reviews" />{" "}
                        </div>
                        <div>
                          {isLoggedIn && (
                            <button
                              className={`font-bold tracking-widest p-[0.1rem] w-16 rounded ${
                                wishClickedMap[book.isbn]
                                  ? "text-gray-500 border-gray-500"
                                  : "text-[#FFCE44] border-[#FFCE44] text-[12px]"
                              } border`}
                              style={{ border: "2px solid " }}
                              onClick={() => addToReadList(book.isbn)}
                            >
                              {" "}
                              WISH{" "}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </>
        )}
      </div>

      {/*
		<div>
		  <div
			id="book-slider"
			className={`scrollbar-hide md:w-98 overflow-auto gap-4 mt-4 flex px-1 md:px-[3rem] py-[1rem] bg-[#ecf3fe]
				justify-center flex-col items-center
				}`}
		  >
		  <div>Tags</div>
  
			<div className="rounded-[8px] gap-[0.75rem] h-[9rem] w-[9rem] flex flex-col items-center justify-center bg-[#dbdbdb]">
			  <h2 className="text-[1.5rem]">Tags</h2>
			  <h2 className="text-[0.9rem]">Most Searched</h2>
			</div> 
		  </div>
		</div>
		*/}

      {/* <div>
		  {tags && 
			tags.book_set.map((bookSeries) => (
			  <div key={bookSeries.category}>
			   {bookSeries.books.length>3 && <> <h1 className="mt-4 mb-4 ml-[1rem] md:ml-[3rem] text-[20px] font-extrabold text-[#4285f4]">
				  {bookSeries.category}
				</h1>
				<div
				  id="book-slider"
				  className={`scrollbar-hide md:w-98 overflow-auto gap-4 flex px-1 md:px-[3rem] py-[1rem] bg-[#ecf3fe] ${
					bookSeries.books.length < 6 ? "justify-center" : ""
				  }`}
				>
				  {bookSeries.books.map((book) => (
					<div
					  key={book.isbn}
					  className="cursor-pointer bg-white flex flex-col min-w-[220px]  p-[1rem] relative "
					  
					>
					  <img
						
						onClick={() => navigate(`/book/${book.isbn}`)}
						className="flex   h-[190px] content-center overflow-hidden object-fill"
						src={book.image}
						alt={book.name}
					  />
					  <p className="text-[15px]  max-h-5 font-semibold overflow-hidden ">
						{book.name.substring(0, 23) +
						  (book.name.length > 23 ? "..." : "")}
					  </p>
					  <div
						className="flex justify-between gap-1 items-center mt-2 "
						style={{ fontSize: "12px" }}
					  >
						<div className="flex items-center gap-1 ">
						  {book.rating} <Star /> <div>| </div>
						  {typeof book.review_count === "string"
							? parseInt(book.review_count.replace(/,/g, ""), 10) >=
							  1000
							  ? parseFloat(
								  book.review_count
									.replace(/,/g, "")
									.replace("K", "")
								) >= 1000
								? (
									parseFloat(
									  book.review_count
										.replace(/,/g, "")
										.replace("K", "")
									) / 1000
								  ).toFixed(1) + "K"
								: book.review_count.replace(/,/g, "")
							  : book.review_count
							: book.review_count}{" "}
						  <img src='/icons/reviews.png' alt='Reviews' />
						</div>
						<div>
						  <button
							className=" font-bold  tracking-widest p-[0.1rem] w-16 rounded text-[#FFCE44] border-[#FFCE44] text-[12px] border"
							style={{ border: "2px solid " }}
							onClick={()=>addToReadList(book.isbn)}
						  >
							WISH
						  </button>
						</div>
					  </div>tr
					</div>
				  ))}
				</div></>}
			  </div>
			))}
		</div>*/}
      {bestSeller && !genre && previousBooks && (
        <>
          <h1 className="mt-4 mb-4 ml-[1rem] md:ml-[3rem] text-[20px] font-extrabold text-blue-900">
            Global Best Sellers
          </h1>

          <div
            id="book-slider"
            className={`scrollbar-hide md:w-98 overflow-auto gap-4 flex px-1 md:px-[3rem] py-[1rem] bg-[#ecf3fe] ${
              bestSeller.length < 6 ? "justify-center" : ""
            }`}
          >
            {bestSeller
              .filter(
                (book) =>
                  !previousBooks.some((prevBook) => prevBook.isbn === book.isbn)
              )
              .slice(0, 10)
              .map((book, index) => (
                <div
                  key={book.isbn}
                  className="cursor-pointer bg-white flex flex-col min-w-[220px] p-[1rem] relative"
                >
                  <div className="relative">
                    <div className="absolute bottom-[-20px] left-0">
                      <span className="text-[50px] font-semibold relative">
                        <span
                          className="text-[white] bg-transparent rounded-full m-0 p-0 leading-none"
                          style={{
                            textShadow:
                              "-2px 0 #4285f4, 0 2px #4285f4, 2px 0 #4285f4, 0 -2px #4285f4",
                          }}
                        >
                          {index + 1}
                        </span>
                      </span>
                    </div>
                    {previousBooks.some(
                      (prevBook) => prevBook.isbn === book.isbn
                    ) && (
                      <div className="text-white bg-red-600 text-center">
                        Already Read
                      </div>
                    )}

                    <img
                      onClick={() => navigate(`/book/${book.isbn}`)}
                      className="flex h-[190px] content-center overflow-hidden object-fill"
                      src={book.image}
                      alt={"book_name"}
                    />
                  </div>
                  <p className="text-[15px] max-h-5 font-semibold overflow-hidden">
                    {book.name.substring(0, 23) +
                      (book.name.length > 23 ? "..." : "")}
                  </p>
                  <div
                    className="flex justify-between gap-1 items-center mt-2"
                    style={{ fontSize: "12px" }}
                  >
                    <div className="flex items-center gap-1">
                      {book.rating} <Star />
                      <div>|</div>
                      {typeof book.review_count === "string"
                        ? parseInt(book.review_count.replace(/,/g, ""), 10) >=
                          1000
                          ? parseFloat(
                              book.review_count
                                .replace(/,/g, "")
                                .replace("K", "")
                            ) >= 1000
                            ? (
                                parseFloat(
                                  book.review_count
                                    .replace(/,/g, "")
                                    .replace("K", "")
                                ) / 1000
                              ).toFixed(1) + "K"
                            : book.review_count.replace(/,/g, "")
                          : book.review_count
                        : book.review_count}{" "}
                      <img src="/icons/reviews.png" alt="Reviews" />
                    </div>
                    <div>
                      {isLoggedIn && (
                        <button
                          className={`font-bold tracking-widest p-[0.1rem] w-16 rounded ${
                            wishClickedMap[book.isbn]
                              ? "text-gray-500 border-gray-500"
                              : "text-[#FFCE44] border-[#FFCE44] text-[12px]"
                          } border`}
                          style={{ border: "2px solid " }}
                          onClick={() => addToReadList(book.isbn)}
                        >
                          {" "}
                          WISH{" "}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </>
      )}

      {teachersPick && previousBooks && !genre && teachersPick.length > 0 && (
        <>
          <h1 className="mt-4 mb-4 ml-[1rem] md:ml-[3rem] text-[20px] font-extrabold text-blue-900">
            Teachers Pick
          </h1>

          <div
            id="book-slider"
            className={`scrollbar-hide md:w-98 overflow-auto gap-4 flex px-1 md:px-[3rem] py-[1rem] bg-[#ecf3fe] ${
              topBooks.length < 6 ? "justify-center" : ""
            }`}
          >
            {teachersPick
              .filter(
                (book) =>
                  !previousBooks.some((prevBook) => prevBook.isbn === book.isbn)
              )
              .slice(0, 10)
              .map((book, index) => (
                <div
                  key={book.isbn}
                  className="cursor-pointer bg-white flex flex-col min-w-[220px] p-[1rem] relative"
                >
                  <div className="relative">
                    <div className="absolute bottom-[-20px] left-0">
                      <span className="text-[50px] font-semibold relative">
                        <span
                          className="text-[white] bg-transparent rounded-full m-0 p-0 leading-none"
                          style={{
                            textShadow:
                              "-2px 0 #4285f4, 0 2px #4285f4, 2px 0 #4285f4, 0 -2px #4285f4",
                          }}
                        >
                          {index + 1}
                        </span>
                      </span>
                    </div>
                    {previousBooks.some(
                      (prevBook) => prevBook.isbn === book.isbn
                    ) && (
                      <div className="text-white bg-red-600 text-center">
                        Already Read
                      </div>
                    )}
                    <img
                      onClick={() => navigate(`/book/${book.isbn}`)}
                      className="flex h-[190px] content-center overflow-hidden object-fill"
                      src={book.image}
                      alt={"book_name"}
                    />
                  </div>
                  <p className="text-[15px] max-h-5 font-semibold overflow-hidden">
                    {book.name.substring(0, 23) +
                      (book.name.length > 23 ? "..." : "")}
                  </p>
                  <div
                    className="flex justify-between gap-1 items-center mt-2"
                    style={{ fontSize: "12px" }}
                  >
                    <div className="flex items-center gap-1">
                      {book.rating} <Star />
                      <div>|</div>
                      {typeof book.review_count === "string"
                        ? parseInt(book.review_count.replace(/,/g, ""), 10) >=
                          1000
                          ? parseFloat(
                              book.review_count
                                .replace(/,/g, "")
                                .replace("K", "")
                            ) >= 1000
                            ? (
                                parseFloat(
                                  book.review_count
                                    .replace(/,/g, "")
                                    .replace("K", "")
                                ) / 1000
                              ).toFixed(1) + "K"
                            : book.review_count.replace(/,/g, "")
                          : book.review_count
                        : book.review_count}{" "}
                      <img src="/icons/reviews.png" alt="Reviews" />
                    </div>
                    <div>
                      {isLoggedIn && (
                        <button
                          className="font-bold tracking-widest p-[0.1rem] w-16 rounded text-[#FFCE44] border-[#FFCE44] text-[12px] border"
                          style={{ border: "2px solid " }}
                          onClick={() => addToReadList(book.isbn)}
                        >
                          WISH
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </>
      )}

      <div>
        {genre &&
          previousBooks &&
          genre.map((bookSeries, genreIndex) => (
            <div key={bookSeries.genre}>
              {bookSeries.books.length > 6 && bookSeries.genre !== "" && (
                <>
                  <h1 className="mt-4 mb-4 ml-[1rem] md:ml-[3rem] text-[20px] font-extrabold text-[#4285f4]">
                    {bookSeries.genre}
                  </h1>
                  <div
                    id="book-slider"
                    className={`scrollbar-hide md:w-98 overflow-auto gap-4 flex px-1 md:px-[3rem] py-[1rem] bg-[#ecf3fe] ${
                      bookSeries.books.length < 6 ? "justify-center" : ""
                    }`}
                  >
                    {bookSeries.books
                      .reduce((uniqueBooks, book) => {
                        return uniqueBooks.findIndex(
                          (uniqueBook) => uniqueBook.isbn === book.isbn
                        ) < 0
                          ? [...uniqueBooks, book]
                          : uniqueBooks;
                      }, [])
                      .sort((a, b) =>
                        previousBooks.some(
                          (prevBook) => prevBook.isbn === a.isbn
                        )
                          ? 1
                          : -1
                      )
                      .sort(
                        (bookA, bookB) =>
                          bookB.stock_available - bookA.stock_available
                      )
                      .map((book) => (
                        <div
                          key={book.isbn}
                          className={`cursor-pointer bg-white flex flex-col min-w-[220px]  p-[1rem] relative ${
                            book.stock_available === 0 && loginState
                              ? "filter grayscale"
                              : ""
                          }`}
                        >
                          {previousBooks.some(
                            (prevBook) => prevBook.isbn === book.isbn
                          ) && (
                            <div className="text-white bg-red-600 text-center">
                              Already Read
                            </div>
                          )}
                          <img
                            className={`flex h-[190px] min-w-[12vw] content-center overflow-hidden object-fill ${
                              book.stock_available === 0 && loginState
                                ? "filter grayscale"
                                : ""
                            }`}
                            onClick={() => navigate(`/book/${book.isbn}`)}
                            src={book.image}
                            alt={book.name}
                          />
                          <p className="text-[15px]  max-h-5 font-semibold overflow-hidden ">
                            {book.name.substring(0, 23) +
                              (book.name.length > 23 ? "..." : "")}
                          </p>
                          <div
                            className="flex justify-between gap-1 items-center mt-2 "
                            style={{ fontSize: "12px" }}
                          >
                            <div className="flex items-center gap-1 ">
                              {book.rating} <Star /> <div>| </div>
                              {typeof book.review_count === "string"
                                ? parseInt(
                                    book.review_count.replace(/,/g, ""),
                                    10
                                  ) >= 1000
                                  ? parseFloat(
                                      book.review_count
                                        .replace(/,/g, "")
                                        .replace("K", "")
                                    ) >= 1000
                                    ? (
                                        parseFloat(
                                          book.review_count
                                            .replace(/,/g, "")
                                            .replace("K", "")
                                        ) / 1000
                                      ).toFixed(1) + "K"
                                    : book.review_count.replace(/,/g, "")
                                  : book.review_count
                                : book.review_count}{" "}
                              <img src="/icons/reviews.png" alt="Reviews" />
                            </div>
                            <div>
                              {isLoggedIn && (
                                <button
                                  className={`font-bold tracking-widest p-[0.1rem] w-16 rounded ${
                                    wishClickedMap[book.isbn]
                                      ? "text-gray-500 border-gray-500"
                                      : "text-[#FFCE44] border-[#FFCE44] text-[12px]"
                                  } border`}
                                  style={{ border: "2px solid " }}
                                  onClick={() => addToReadList(book.isbn)}
                                >
                                  {" "}
                                  WISH{" "}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </>
              )}

              {genreIndex === 3 && (
                <>
                  {bestSeller && previousBooks && (
                    <>
                      <h1 className="mt-4 mb-4 ml-[1rem] md:ml-[3rem] text-[20px] font-extrabold text-blue-900">
                        Global Best Sellers
                      </h1>

                      <div
                        id="book-slider"
                        className={`scrollbar-hide md:w-98 overflow-auto gap-4 flex px-1 md:px-[3rem] py-[1rem] bg-[#ecf3fe] ${
                          bestSeller.length < 6 ? "justify-center" : ""
                        }`}
                      >
                        {bestSeller
                          .filter(
                            (book) =>
                              !previousBooks.some(
                                (prevBook) => prevBook.isbn === book.isbn
                              )
                          )
                          .slice(0, 10)
                          .map((book, index) => (
                            <div
                              key={book.isbn}
                              className="cursor-pointer bg-white flex flex-col min-w-[220px] p-[1rem] relative"
                            >
                              <div className="relative">
                                <div className="absolute bottom-[-20px] left-0">
                                  <span className="text-[50px] font-semibold relative">
                                    <span
                                      className="text-[white] bg-transparent rounded-full m-0 p-0 leading-none"
                                      style={{
                                        textShadow:
                                          "-2px 0 #4285f4, 0 2px #4285f4, 2px 0 #4285f4, 0 -2px #4285f4",
                                      }}
                                    >
                                      {index + 1}
                                    </span>
                                  </span>
                                </div>
                                {previousBooks.some(
                                  (prevBook) => prevBook.isbn === book.isbn
                                ) && (
                                  <div className="text-white bg-red-600 text-center">
                                    Already Read
                                  </div>
                                )}
                                <img
                                  onClick={() => navigate(`/book/${book.isbn}`)}
                                  className="flex h-[190px] content-center overflow-hidden object-fill"
                                  src={book.image}
                                  alt={"book_name"}
                                />
                              </div>
                              <p className="text-[15px] max-h-5 font-semibold overflow-hidden">
                                {book.name.substring(0, 23) +
                                  (book.name.length > 23 ? "..." : "")}
                              </p>
                              <div
                                className="flex justify-between gap-1 items-center mt-2"
                                style={{ fontSize: "12px" }}
                              >
                                <div className="flex items-center gap-1">
                                  {book.rating} <Star />
                                  <div>|</div>
                                  {typeof book.review_count === "string"
                                    ? parseInt(
                                        book.review_count.replace(/,/g, ""),
                                        10
                                      ) >= 1000
                                      ? parseFloat(
                                          book.review_count
                                            .replace(/,/g, "")
                                            .replace("K", "")
                                        ) >= 1000
                                        ? (
                                            parseFloat(
                                              book.review_count
                                                .replace(/,/g, "")
                                                .replace("K", "")
                                            ) / 1000
                                          ).toFixed(1) + "K"
                                        : book.review_count.replace(/,/g, "")
                                      : book.review_count
                                    : book.review_count}{" "}
                                  <img src="/icons/reviews.png" alt="Reviews" />
                                </div>
                                <div>
                                  {isLoggedIn && (
                                    <button
                                      className={`font-bold tracking-widest p-[0.1rem] w-16 rounded ${
                                        wishClickedMap[book.isbn]
                                          ? "text-gray-500 border-gray-500"
                                          : "text-[#FFCE44] border-[#FFCE44] text-[12px]"
                                      } border`}
                                      style={{ border: "2px solid " }}
                                      onClick={() => addToReadList(book.isbn)}
                                    >
                                      {" "}
                                      WISH{" "}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </>
                  )}
                </>
              )}

              {genreIndex === 5 && (
                <>
                  {teachersPick && previousBooks && teachersPick.length > 0 && (
                    <>
                      <h1 className="mt-4 mb-4 ml-[1rem] md:ml-[3rem] text-[20px] font-extrabold text-blue-900">
                        Teachers Pick
                      </h1>

                      <div
                        id="book-slider"
                        className={`scrollbar-hide md:w-98 overflow-auto gap-4 flex px-1 md:px-[3rem] py-[1rem] bg-[#ecf3fe] ${
                          topBooks.length < 6 ? "justify-center" : ""
                        }`}
                      >
                        {teachersPick
                          .filter(
                            (book) =>
                              !previousBooks.some(
                                (prevBook) => prevBook.isbn === book.isbn
                              )
                          )
                          .slice(0, 10)
                          .map((book, index) => (
                            <div
                              key={book.isbn}
                              className="cursor-pointer bg-white flex flex-col min-w-[220px] p-[1rem] relative"
                            >
                              <div className="relative">
                                <div className="absolute bottom-[-20px] left-0">
                                  <span className="text-[50px] font-semibold relative">
                                    <span
                                      className="text-[white] bg-transparent rounded-full m-0 p-0 leading-none"
                                      style={{
                                        textShadow:
                                          "-2px 0 #4285f4, 0 2px #4285f4, 2px 0 #4285f4, 0 -2px #4285f4",
                                      }}
                                    >
                                      {index + 1}
                                    </span>
                                  </span>
                                </div>
                                {previousBooks.some(
                                  (prevBook) => prevBook.isbn === book.isbn
                                ) && (
                                  <div className="text-white bg-red-600 text-center">
                                    Already Read
                                  </div>
                                )}
                                <img
                                  onClick={() =>
                                    navigate(`/books/${book.isbn}`)
                                  }
                                  className="flex h-[190px] content-center overflow-hidden object-fill"
                                  src={book.image}
                                  alt={"book_name"}
                                />
                              </div>
                              <p className="text-[15px] max-h-5 font-semibold overflow-hidden">
                                {book.name.substring(0, 23) +
                                  (book.name.length > 23 ? "..." : "")}
                              </p>
                              <div
                                className="flex justify-between gap-1 items-center mt-2"
                                style={{ fontSize: "12px" }}
                              >
                                <div className="flex items-center gap-1">
                                  {book.rating} <Star />
                                  <div>|</div>
                                  {typeof book.review_count === "string"
                                    ? parseInt(
                                        book.review_count.replace(/,/g, ""),
                                        10
                                      ) >= 1000
                                      ? parseFloat(
                                          book.review_count
                                            .replace(/,/g, "")
                                            .replace("K", "")
                                        ) >= 1000
                                        ? (
                                            parseFloat(
                                              book.review_count
                                                .replace(/,/g, "")
                                                .replace("K", "")
                                            ) / 1000
                                          ).toFixed(1) + "K"
                                        : book.review_count.replace(/,/g, "")
                                      : book.review_count
                                    : book.review_count}{" "}
                                  <img src="/icons/reviews.png" alt="Reviews" />
                                </div>
                                <div>
                                  {isLoggedIn && (
                                    <button
                                      className={`font-bold tracking-widest p-[0.1rem] w-16 rounded ${
                                        wishClickedMap[book.isbn]
                                          ? "text-gray-500 border-gray-500"
                                          : "text-[#FFCE44] border-[#FFCE44] text-[12px]"
                                      } border`}
                                      style={{ border: "2px solid " }}
                                      onClick={() => addToReadList(book.isbn)}
                                    >
                                      {" "}
                                      WISH{" "}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          ))}
      </div>
      <Toaster />
    </>
  );
};

export default BrowseLibraryByGenre;
