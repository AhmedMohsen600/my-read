import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as BookApi from "../BooksAPI";
import Book from "../components/book";
import { useDebounce } from "../hooks/use-debounce";
import { useImmer } from "use-immer";
export default function Search({ shelfs, setShelfs }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useImmer([]);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearching(true);
      BookApi.search(debouncedSearchTerm).then((results) => {
        if (results.error) {
          setResults([]);
          setIsSearching(false);
          return;
        }
        setIsSearching(false);
        setResults(results);
      });
    } else setResults([]);
  }, [debouncedSearchTerm, setResults]);

  const searchResults = results.map((book) => {
    shelfs.allBooks.map((b) => {
      if (b.id === book.id) {
        if (!book.shelf) {
          book.shelf = b.shelf;
        }
      }
      return b;
    });
    return book;
  });
  console.log(results);
  const moveBookFromSearch = (singleBook, currentSection) => (goToSection) => {
    currentSection = currentSection === "none" ? null : currentSection;

    let newCurrentSection = null;
    if (currentSection) {
      newCurrentSection = shelfs[currentSection].filter(
        (book) => book.id !== singleBook.id
      );
    }

    setShelfs((prev) => {
      if (goToSection === "none") {
        prev[currentSection] = newCurrentSection;
        return;
      }
      if (currentSection) {
        prev[currentSection] = newCurrentSection;
      }
      prev[goToSection].push(singleBook);
    });

    BookApi.update(singleBook, goToSection);
  };

  const getCurrentBookSection = (bookId) => {
    let section = "none";

    const wantToRead = shelfs.wantToRead.find(({ id }) => id === bookId);

    if (wantToRead) section = "wantToRead";

    const currentReading = shelfs.currentlyReading.find(
      ({ id }) => id === bookId
    );

    if (currentReading) section = "currentlyReading";

    const read = shelfs.read.find(({ id }) => id === bookId);
    if (read) section = "read";

    return section;
  };

  return (
    <div className="search-books">
      <div className="search-books-bar">
        <Link to="/">
          <button className="close-search">Close</button>
        </Link>
        <div className="search-books-input-wrapper">
          {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
          <input
            value={searchTerm}
            onChange={({ target }) => setSearchTerm(target.value)}
            type="text"
            placeholder="Search by title or author"
          />
        </div>
      </div>
      <div className="search-books-results">
        {isSearching && (
          <div style={{ textAlign: "center", color: "green", fontSize: 20 }}>
            Searching...
          </div>
        )}
        <ol className="books-grid">
          {searchResults.length !== 0 ? (
            searchResults.map((book) => {
              return (
                <li key={book.id}>
                  <Book
                    goToSection={moveBookFromSearch(
                      book,
                      getCurrentBookSection(book.id)
                    )}
                    section={getCurrentBookSection(book.id)}
                    title={book.title}
                    authors={book.authors}
                    src={
                      book.imageLinks
                        ? book.imageLinks.thumbnail
                        : "http://books.google.com/books/content?id=qXXHAgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
                    }
                  />
                </li>
              );
            })
          ) : (
            <div style={{ color: "green", fontSize: 21, fontWeight: "700" }}>
              {isSearching ? "" : "RESULTS NOT FOUND"}
            </div>
          )}
        </ol>
      </div>
    </div>
  );
}
