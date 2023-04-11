import { React, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';

const api_url = "http://localhost:8080/book/";

export default function BookDetail() {

  const { id } = useParams();
  let url = api_url + id;
  const [book, setBook] = useState('');
  useEffect(() => {
    fetch(url)
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
    <div >
      <div>{book.bookcode}</div>
      <div>{book.title}</div>
      <div>{book.author}</div>
      <div>{book.category}</div>
      <div>{book.approved}</div>
    </div>
  )
}
