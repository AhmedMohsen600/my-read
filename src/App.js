import React, { useEffect } from "react";
import "./App.css";
import Search from "./pages/search";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/home";
import { useImmer } from "use-immer";
import * as BooksAPI from "./BooksAPI";
function BooksApp() {
  const [shelfs, setShelfs] = useImmer({
    allBooks: null,
    wantToRead: null,
    currentlyReading: null,
    read: null,
    none: null,
  });

  useEffect(() => {
    BooksAPI.getAll()
      .then((data) =>
        setShelfs({
          allBooks: data,
          wantToRead: data.filter((book) => book.shelf === "wantToRead"),
          currentlyReading: data.filter(
            (book) => book.shelf === "currentlyReading"
          ),
          read: data.filter((book) => book.shelf === "read"),
        })
      )
      .catch((error) => console.log(error.message));
  }, [setShelfs]);
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home shelfs={shelfs} setShelfs={setShelfs} />
        </Route>
        <Route path="/search">
          <Search shelfs={shelfs} setShelfs={setShelfs} />
        </Route>
      </Switch>
    </Router>
  );
}

export default BooksApp;
