import { AiOutlineHeart } from "react-icons/ai";
import {
  addToWishlist,
  increasePriority,
  decreasePriority,
  removeFromWishlist,
  removeFromDump,
  addToPreviousBooks,
  ratePreviousBooks,
  removeFromSuggestedBooks,
  retainBook,
} from "../../reducers/wishlistSlice";
import { setAlert } from "../../reducers/mainSlice";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { HiThumbDown, HiOutlineBookOpen } from "react-icons/hi";
import axios from "axios";
import devUrls from "../../utils/devUrls";
import { Link } from "react-router-dom";
import { GiScooter } from "react-icons/gi";
import Moment from "react-moment";

const wishlistAdd = async (book, dispatch) => {
  dispatch(
    setAlert({ text: `${book.name} added to wishlist`, color: "#33A200" })
  );
  dispatch(addToWishlist({ book }));
  try {
    await axios.post(
      devUrls.addToWishlist,
      { isbn: book.isbn },
      { withCredentials: true }
    );
  } catch (err) {
    console.log(err);
  }
};

const wishlistRemove = async (book, dispatch) => {
  dispatch(
    setAlert({ text: `${book.name} removed from wishlist`, color: "#F75549" })
  );
  dispatch(removeFromWishlist({ book }));
  try {
    await axios.post(
      devUrls.removeFromWishlist,
      { isbn: book.isbn },
      { withCredentials: true }
    );
  } catch (err) {
    console.log(err);
  }
};

const suggestionDump = async (book, dispatch) => {
  dispatch(
    setAlert({
      text: `${book.name} removed from suggestions`,
      color: "#F75549",
    })
  );
  dispatch(removeFromSuggestedBooks({ book }));
  try {
    await axios.post(
      devUrls.dumpBook,
      { isbn: book.isbn },
      { withCredentials: true }
    );
  } catch (err) {
    console.log(err);
  }
};

const wishlistPrevious = async (book, dispatch, i) => {
  dispatch(increasePriority({ i }));
  try {
    await axios.post(
      devUrls.wishlistPrevious,
      { isbn: book.isbn },
      { withCredentials: true }
    );
  } catch (err) {
    console.log(err);
  }
};

const wishlistNext = async (book, dispatch, i) => {
  dispatch(decreasePriority({ i }));
  try {
    await axios.post(
      devUrls.wishlistNext,
      { isbn: book.isbn },
      { withCredentials: true }
    );
  } catch (err) {
    console.log(err);
  }
};

const readBefore = async (book, dispatch) => {
  dispatch(addToPreviousBooks({ book }));
  try {
    await axios.post(
      devUrls.dumpRead,
      { isbn: book.isbn },
      { withCredentials: true }
    );
  } catch (err) {
    console.log(err);
  }
};

const dislike = async (book, dispatch) => {
  dispatch(removeFromDump({ book }));
  try {
    await axios.post(
      devUrls.dumpDislike,
      { isbn: book.isbn },
      { withCredentials: true }
    );
  } catch (err) {
    console.log(err);
  }
};

const retain = async (book, dispatch) => {
  dispatch(retainBook({ book }));
  try {
    await axios.post(
      devUrls.retainBook,
      { isbn: book.isbn },
      { withCredentials: true }
    );
  } catch (err) {
    console.log(err);
  }
};

export const getOverlay = (
  overlay,
  sectionBooks,
  book,
  i,
  dispatch,
  isLoggedIn
) => {
  if (!overlay) {
    return (
      <div className='book-overlay'>
        {isLoggedIn && (
          <button onClick={() => wishlistAdd(book, dispatch)}>
            <AiOutlineHeart />
            <p>Add to Wishlist</p>
          </button>
        )}
        <Link to={`/book/${book.isbn}`}>View Details</Link>
      </div>
    );
  } else if (overlay === "wishlist") {
    return (
      <div className='book-overlay'>
        {i > 0 && (
          <button
            className='high-priority'
            onClick={() => wishlistPrevious(book, dispatch, i)}
            style={{ width: "100px" }}
          >
            <BsArrowLeft />
            <p>High</p>
          </button>
        )}
        <div
          className='vertical-button'
          onClick={() => wishlistRemove(book, dispatch)}
        >
          <MdClose />
          <p>Remove</p>
        </div>
        {i < sectionBooks.length - 1 && (
          <button
            className='low-priority'
            onClick={() => wishlistNext(book, dispatch, i)}
            style={{ backgroundColor: "#F75549", width: "100px" }}
          >
            <p>Low</p>
            <BsArrowRight />
          </button>
        )}
      </div>
    );
  } else if (overlay === "current") {
    return (
      <div className='book-overlay'>
        <button
          style={{ backgroundColor: "#4285F4" }}
          onClick={() => retain(book, dispatch)}
        >
          <HiOutlineBookOpen />
          <p>Retain</p>
        </button>
      </div>
    );
  } else if (overlay === "previous") {
    return (
      <div className='book-overlay'>
        {book.placed_on && (
          <div className='book-overlay-action'>
            <GiScooter />
            <Moment format='D MMM YYYY' withTitle>
              {book.placed_on}
            </Moment>
          </div>
        )}
        {book.placed_on && (
          <div
            className='book-overlay-action'
            style={{ width: "70%", backgroundColor: "#787878" }}
          >
            <Moment to={book.placed_on}>{new Date().toString()}</Moment>
          </div>
        )}
        <div className='rating'>
          {Array(5)
            .fill(true)
            .map((star, j) => {
              const rateBook = () =>
                dispatch(ratePreviousBooks({ book, userRating: j + 1 }));
              if (j < book.userRating)
                return (
                  <FaStar
                    style={{
                      fontSize: "1.5rem",
                      color: "#4285F4",
                      marginLeft: "0.25rem",
                    }}
                    key={j}
                    onClick={rateBook}
                  />
                );
              return (
                <FaStar
                  style={{
                    fontSize: "1.5rem",
                    color: "#B0AFAF",
                    marginLeft: "0.25rem",
                  }}
                  key={j}
                  onClick={rateBook}
                />
              );
            })}
        </div>
      </div>
    );
  } else if (overlay === "dump") {
    return (
      <div className='book-overlay'>
        <button
          style={{ backgroundColor: "#B0AFAF" }}
          onClick={() => readBefore(book, dispatch)}
        >
          Read Before
        </button>
        <button
          style={{ backgroundColor: "#F75549" }}
          onClick={() => dislike(book, dispatch)}
        >
          <HiThumbDown />
          <p>Dislike</p>
        </button>
      </div>
    );
  } else if (overlay === "suggested") {
    return (
      <div className='book-overlay'>
        <button onClick={() => wishlistAdd(book, dispatch)}>
          <AiOutlineHeart />
          <p>Add to Wishlist</p>
        </button>
        <button
          style={{ backgroundColor: "#F75549" }}
          onClick={() => suggestionDump(book, dispatch)}
        >
          <MdClose />
          <p>Remove</p>
        </button>
      </div>
    );
  }
};
