import React, { useState, useEffect } from "react";

const URL_BASE = 'http://localhost:8080';
const api_url = "http://localhost:8080/books";

const Books = () => {

  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch(api_url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setPosts(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return (
    <><div class="container">
      <div class="row">
        <h1>List Book</h1>
      </div>
    </div><table class="table table-striped table-bordered">
        <thead class="table-dark">
          <tr>
            <th>BookCode</th>
            <th>Title</th>
            <th>Author</th>
            <th>Category</th>
            <th>Approved</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody id="book-rows">
          {posts.map((book) => {
            return (
              <tr>
                <td>{book.bookcode}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.category}</td>
                <td>{book.approved ? <input type="checkbox" checked /> : <input type="checkbox" />} </td>
                <td className="d-flex justify-content-around">
                  <a href= {`book/${book.bookcode}`} class="btn btn-success">View</a>
                  <a href= '/books' class="btn btn-danger" onClick={() => fetch(URL_BASE + `/book/delete/${book.bookcode}`)} >Delete</a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table></>
  );
};

export default Books;
