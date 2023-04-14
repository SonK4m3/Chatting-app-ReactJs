import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const api_url = "http://localhost:8080/book/";

function Form({ action, book }) {
  const [bookcode, setCode] = useState(book.bookcode);
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [category, setCategory] = useState(book.category);
  const [approved, setApproved] = useState(book.approved);

  function handleSubmit(event) {
    event.preventDefault();
    const nb = {
      bookcode: bookcode,
      title: title,
      author: author,
      category: category,
      approved: approved,
    };
    const dataPost = JSON.stringify(nb);
    // alert(dataPost);
    fetch(api_url + "add", {
      method: action,
      body: dataPost,
    })
      .then((response) => {
        if (response.ok) {
          window.location.href = "/books"; // redirect to home page
        }
      })
      .catch((error) => window.location.href = "/error");
  }

  function handleInput(event, type) {
    switch (type) {
      case "title":
        setTitle(event.target.value);
        break;
      case "author":
        setAuthor(event.target.value);
        break;
      case "category":
        setCategory(event.target.value);
        break;
      case "approved":
        setApproved(event.target.checked);
        break;
      default:
    }
  }

  return (
    <>
      <form className="m-lg-8" onSubmit={handleSubmit}>
        <div className="form-group col-lg-4">
          <label htmlFor="inputTitle">Title</label>
          <input
            type="text"
            className="form-control"
            id="inputTitle"
            value={title}
            onChange={(event) => handleInput(event, "title")}
            aria-describedby="titleHelp"
            placeholder="Enter title"
            required
          />
          <small id="titleHelp" className="form-text text-muted">
            Titles should be capitalized and contain no sensitive words
          </small>
        </div>
        <div className="form-group col-lg-4">
          <label htmlFor="inputAuthor">Author</label>
          <input
            type="text"
            className="form-control"
            id="inputAuthor"
            value={author}
            onChange={(event) => handleInput(event, "author")}
            placeholder="Enter author"
            required
          />
        </div>
        <div className="form-group col-lg-4">
          <label htmlFor="inputCategory">Category</label>
          <input
            type="text"
            className="form-control"
            id="inputCategory"
            value={category}
            onChange={(event) => handleInput(event, "category")}
            placeholder="Enter category"
            required
          />
        </div>
        <div className="form-check col-lg-4">
          <input
            type="checkbox"
            className="form-check-approved"
            id="checkApproved"
            checked={approved}
            onChange={(event) => handleInput(event, "approved")}
          />
          <label className="form-check-label" htmlFor="checkApproved">
            Approved
          </label>
        </div>
        <div>
          <button type="submit" className="btn btn-primary mr-2">
            Submit
          </button>
          <button className="btn btn-secondary ml-2" onClick={() => window.history.back()}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}

function BookView({ id }) {
  const [mbook, setBook] = useState("");

  useEffect(() => {
    fetch(api_url + id)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setBook(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return (
    <div className="container">
      <div className="row">
        <h1>Update book</h1>
      </div>
      {mbook && <Form action={"PUT"} book={mbook} />};
    </div>
  );
}

export default function BookDetail() {
  const { id } = useParams();
  const mb = {
    bookcode: -1,
    title: "",
    author: "",
    category: "",
    approved: false,
  };

  return (
    <>
      {parseInt(id) === -1 ? (
        <div className="container">
          <div className="row">
            <h1>New book</h1>
          </div>
          <Form action={"POST"} book={mb} />
        </div>
      ) : (
        <BookView id={id} />
      )}
    </>
  );
}
