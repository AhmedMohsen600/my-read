import React from "react";

export default function OpenSearch({ setShowSearchPage }) {
  return (
    <div className="open-search">
      <button onClick={() => setShowSearchPage(true)}>Add a book</button>
    </div>
  );
}
