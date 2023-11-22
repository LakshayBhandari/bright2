import { useState, useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import ScrollContainer from "react-indiana-drag-scroll";
import "./styles.scss";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import "react-loading-skeleton/dist/skeleton.css";
import { getOverlay } from "./utils";
import { useSelector, useDispatch } from "react-redux";
import { getDate } from "../../utils";
import { toast, Toaster } from "react-hot-toast";
import moment from "moment";
import axios from "axios";
import { useLocation } from "react-router-dom";
import {
  LoginState,
  ageFilterState,
  UserIdState,
} from "../../recoilContextProvider";
import { useNavigate } from "react-router-dom";
const BookSlider = ({
  title,
  books,
  booksTitle,
  overlay,
  showOverlay = true,
}) => {

  const location = useLocation();
  const {
    main: { user, isLoggedIn },
    wishlist: { bucket },
    book: { age },
  } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [sectionBooks, setSectionBooks] = useState(
    books.length ? books : ["No books to show"]
  );
  const [booksScroll, setBooksScroll] = useState(0);
  const booksRef = useRef(null);

  const navigate = useNavigate();
  const [wishListBooks, setWishListBooks] = useState([]);

  const [wishClickedMap, setWishClickedMap] = useState({});
  const slide = (direction, ref) => {
    const element = ref.current.container.current;
    setBooksScroll(element.scrollLeft);
    if (direction === "right")
      element.scrollTo(element.scrollLeft + element.clientWidth - 100, 0);
    else element.scrollTo(element.scrollLeft - element.clientWidth - 100, 0);
  };

  const [userIdState, setUserIdState] = useRecoilState(UserIdState);

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
  }, [wishListBooks]);
  const getWishlistDeliveryDate = (i, date) => {
    if (bucket.length)
      return getDate(
        moment(date).add(7 * Math.round((i + 1) / user.books_per_week), "days")
      );
    return getDate(
      moment(date).add(
        7 * (Math.round((i + 1) / user.books_per_week) - 1),
        "days"
      )
    );
  };

  useEffect(() => {
    const element = booksRef.current.container.current;
    element.scrollTo(0, 0);
  }, [age]);

  useEffect(() => {
    if (books.length) setSectionBooks(books);
    else setSectionBooks(["No books to show"]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [books]);

  const addToReadList = async (isbn) => {

    console.log(wishClickedMap)
    console.log(wishListBooks)

    const isbnData = { isbn: isbn };
    try {
      const isBookInWishlist = wishListBooks.some((book) => book.isbn === isbn);
      if (!isBookInWishlist) {
        const response = await axios.post(
          `https://server.brightr.club/api_v2/add-to-wishlist`,
          isbnData,
          { withCredentials: true }
        );
        setWishListBooks((prevBooks) => [...prevBooks, response.data]);
        setWishClickedMap((prevMap) => {
          const updatedMap = { ...prevMap };
          updatedMap[isbn] = true;
          return updatedMap;
        });
        toast.success("Added to readlist");
      } else {
        const response = await axios.post(
          `https://server.brightr.club/api_v2/wishlist-remove`,
          isbnData,
          { withCredentials: true }
        );
        setWishListBooks((prevBooks) =>
          prevBooks.filter((book) => book.isbn !== isbn)
        );
        setWishClickedMap((prevMap) => {
          const updatedMap = { ...prevMap };
          updatedMap[isbn] = false;
          return updatedMap;
        });
        toast.error("Removed From Readlist");
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <div className="book-slider">
      {title && <h3 className="title">{title}</h3>}
      <div className="books">
        {sectionBooks?.length &&
          sectionBooks[0] !== "No books to show" &&
          booksScroll !== 0 && (
            <AiOutlineLeft
              className="left-arrow"
              onClick={() => slide("left", booksRef)}
            />
          )}
        {sectionBooks?.length &&
          sectionBooks[0] !== "No books to show" &&
          booksRef?.current?.container.current.scrollWidth >
            booksRef?.current?.container.current.clientWidth && (
            <AiOutlineRight
              className="right-arrow"
              onClick={() => slide("right", booksRef, true)}
            />
          )}
        {booksTitle && <h3>{booksTitle}</h3>}
        <ScrollContainer vertical={false} ref={booksRef}>
          {!sectionBooks?.length || sectionBooks[0] === "No books to show" ? (
            <h3
              style={{ textAlign: "center", fontSize: "0.9rem" }}
              className="no-books-text"
            >
              No books to show
            </h3>
          ) : (
            <div className="book-list">
              {sectionBooks?.map((book, i) => {
                return (
                  <div
                    className={`book ${
                      isLoggedIn &&
                      (!book.stock_available ||
                        (book.stock_available === 99 && overlay === "wishlist"))
                        ? "book-not-available"
                        : ""
                    }`}
                    key={i}
                  >
                    <div className="book-image">
                      <img
                        className=" cursor-pointer"
                        onClick={() => navigate(`/book/${book.isbn}`)}
                        src={book.image}
                        alt="Book"
                      />
                    </div>
                    <p>{book.name.split(":")[0]}</p>
                    <div className="book-details">
                      <div className=" flex">
                        {book.rating && (
                          <div className="book-detail">
                            <p>{book.rating}</p>
                            <img src="/icons/star.png" alt="Rating" />
                          </div>
                        )}
                        {book.review_count && !isNaN(book.review_count) && (
                          <div className="book-detail">
                            <img src="/icons/reviews.png" alt="Reviews" />
                            <p>{Number(book.review_count).toLocaleString()}</p>
                          </div>
                        )}
                      </div>
                      <div>
                        {isLoggedIn && (
                          <button
                            className={`font-bold tracking-widest p-[0.1rem] w-16 rounded ${
                              wishClickedMap[book.isbn]
                                ? "text-gray-500 border-gray-500 text-[12px]"
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
                    {isLoggedIn &&
                      overlay === "wishlist" &&
                      (!book.stock_available ||
                        book.stock_available === 99) && (
                        <p className="all-copies-booked">All Copies Booked</p>
                      )}
                    { location.pathname==="/your-library" &&  showOverlay &&
                      getOverlay(
                        overlay,
                        sectionBooks,
                        book,
                        i,
                        dispatch,
                        isLoggedIn
                      )}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollContainer>
      </div>
      <Toaster/>
    </div>
  );
};

export default BookSlider;
