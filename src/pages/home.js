import React from "react";
import Book from "../components/book";
import Loading from "../components/loading";
import * as BooksAPI from "../BooksAPI";
import { Link } from "react-router-dom";
export default function Home({ shelfs, setShelfs }) {
  const changeBookSection =
    (bookCurrentSection, singleBook) => (goToSection) => {
      // return the selected book.
      // BooksAPI.update(book, goToSection);
      const updateCurrentSection = shelfs[bookCurrentSection].filter(
        (book) => book.id !== singleBook.id
      );
      // update the shelf.
      setShelfs((prevValue) => {
        // remove book from shelf.
        if (goToSection === "none") {
          prevValue[bookCurrentSection] = updateCurrentSection;
          return;
        }
        // Move the book from the current shelf.
        prevValue[bookCurrentSection] = updateCurrentSection;
        // Add the book to the new shelf.
        prevValue[goToSection].push(singleBook);
      });
      BooksAPI.update(singleBook, goToSection);
    };

  return (
    <div className="list-books-content">
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>

        <div className="open-search">
          <Link to="/search">
            <button id="btn">Add Book</button>
          </Link>
        </div>
      </div>
      <div>
        <div className="bookshelf">
          <h2 className="bookshelf-title">Currently Reading</h2>
          <div className="bookshelf-books">
            <ol className="books-grid">
              {shelfs.currentlyReading ? (
                shelfs.currentlyReading.map((book) => (
                  <li key={book.id}>
                    <Book
                      goToSection={changeBookSection("currentlyReading", book)}
                      section="currentlyReading"
                      title={book.title}
                      authors={book.authors}
                      src={book.imageLinks.thumbnail}
                    />
                  </li>
                ))
              ) : (
                <Loading />
              )}
            </ol>
          </div>
        </div>
        <div className="bookshelf">
          <h2 className="bookshelf-title">Want to Read</h2>
          <div className="bookshelf-books">
            <ol className="books-grid">
              {shelfs.wantToRead ? (
                shelfs.wantToRead.map((book) => (
                  <li key={book.id}>
                    <Book
                      goToSection={changeBookSection("wantToRead", book)}
                      section="wantToRead"
                      title={book.title}
                      authors={book.authors}
                      src={book.imageLinks.thumbnail}
                    />
                  </li>
                ))
              ) : (
                <Loading />
              )}
            </ol>
          </div>
        </div>
        <div className="bookshelf">
          <h2 className="bookshelf-title">Read</h2>
          <div className="bookshelf-books">
            <ol className="books-grid">
              {shelfs.read ? (
                shelfs.read.map((book) => (
                  <li key={book.id}>
                    <Book
                      goToSection={changeBookSection("read", book)}
                      section="read"
                      title={book.title}
                      authors={book.authors}
                      src={book.imageLinks ? book.imageLinks.thumbnail : ""}
                    />
                  </li>
                ))
              ) : (
                <Loading />
              )}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
