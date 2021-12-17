import React from "react";

export default function Book({ src, title, authors, goToSection, section }) {
  const handelSelectedValue = (e) => goToSection(e.target.value);

  return (
    <div className="book">
      <div className="book-top">
        <div
          className="book-cover"
          style={{
            width: 128,
            height: 188,
            backgroundImage: `url(${src})`,
          }}
        />

        <div className="book-shelf-changer">
          <select onChange={handelSelectedValue} value={section}>
            <option value="move" disabled>
              Move to...
            </option>
            <option value="currentlyReading">Currently Reading</option>
            <option value="wantToRead">Want to Read</option>
            <option value="read">Read</option>
            <option value="none">None</option>
          </select>
        </div>
      </div>
      <div className="book-title">{title}</div>
      <div className="book-authors">{authors ? authors.join(" - ") : ""}</div>
    </div>
  );
}
