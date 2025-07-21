import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  type BookData = { title: string; author_name?: string[]; cover_i?: number };
  const [book, setBook] = useState("");
  const [search, setSearch] = useState("");
  const [booksData, setBooksData] = useState<BookData[]>(null as any);
  const [loading, setLoading] = useState(false);
  const [displayedBooks, setDisplayedBooks] = useState<BookData[]>([]);
  const [displayedBooksLength, setDisplayedBooksLength] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (booksData && booksData.length > 0) {
      const initialDisplayBooks = booksData.slice(0, 12);
      setDisplayedBooks(initialDisplayBooks);
      setDisplayedBooksLength(initialDisplayBooks.length);
    }
  }, [booksData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBook(e.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      buttonPress();
    }
  };

  const buttonPress = async () => {
    if (book.trim() === "") {
      alert("Please fill the field");
      return;
    }

    setLoading(true);
    setSearch(book);

    try {
      const response = await axios.get(
        `https://openlibrary.org/search.json?q=${book}`
      );
      setBooksData(response.data.docs);
      setBook("");
    } catch (error) {
      console.error("Error fetching data:", error);
      setBooksData([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      for (
        let i = displayedBooksLength;
        i < displayedBooksLength + 12 && i < booksData.length;
        i++
      ) {
        setDisplayedBooks((prev) => [...prev, booksData[i]]);
      }
      setDisplayedBooksLength(displayedBooks.length);

      setLoadingMore(false);
    }, 1000);
  };

  return (
    <div className="App">
      <header className="heading">Search for your book here</header>
      <input
        placeholder="Hunger Games..."
        onChange={handleChange}
        value={book}
        type="text"
        autoFocus
        required
        className="search-input"
        onKeyDown={handleKeyDown}
      />
      <button onClick={buttonPress} className="search-button">
        Search
      </button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {displayedBooks.length === 0 && booksData != null && (
            <p>No books found</p>
          )}
          {displayedBooks.length > 0 && (
            <>
              <h2 className="search-title">
                Search results for: <span>{search}</span>
              </h2>
              <div className="book-section">
                {displayedBooks.map((book, index) => (
                  <div key={index} className="books">
                    {book.cover_i != null ? (
                      <img
                        className="book-cover"
                        src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                        alt={book.title}
                      />
                    ) : (
                      <p>No cover image</p>
                    )}
                    <h3>{book.title}</h3>
                    <p>-{book.author_name?.join(", ")} </p>
                    <a
                      href={`https://www.goodreads.com/search?utf8=✓&query=${
                        book.title
                      }+${book.author_name?.join(", ")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Book on GoodReads
                    </a>
                  </div>
                ))}
              </div>
              {loadingMore ? (
                <>
                  <p>Loading More ...</p>
                </>
              ) : (
                <>
                  {displayedBooksLength < booksData.length && (
                    <button onClick={loadMore} className="load-button">
                      Load More
                    </button>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
