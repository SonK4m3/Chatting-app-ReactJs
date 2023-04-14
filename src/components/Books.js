import React, { useState, useEffect } from "react";

const URL_BASE = 'http://localhost:8080';
const api_url = "http://localhost:8080/books";

function onClickDelete(bookcode) {
  var notification = 'Do you want to remove this?';
  if (window.confirm(notification)) {
    fetch(URL_BASE + `/book/delete/${bookcode}`)
      .then((response) => response.json())
      .then((data) => {
        alert(data ? 'Delete successfully' : 'Can\'t delete');
        window.location.href='/books'; 
      });
  } else return false;
}

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
    <><div className="container">
      <div className="row">
        <h1>List Book</h1>
      </div>
    </div><table className="table table-striped table-bordered">
        <thead className="table-dark">
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
              <tr key={book.bookcode}>
                <td>{book.bookcode}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.category}</td>
                <td>{book.approved ? <input type="checkbox" defaultChecked disabled/> : <input type="checkbox" disabled/>} </td>
                <td className="d-flex justify-content-around">
                  <a href={`book/${book.bookcode}`} className="btn btn-success">View</a>
                  <button className="btn btn-danger" onClick={() => onClickDelete(book.bookcode)} >Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="text-center">
        <a href= 'book/-1' className="btn btn-primary">New Book</a>
      </div>
    </>
  );
};

export default Books;
