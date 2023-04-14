import React, { useEffect, useState } from "react";

const BASE_URL = "https://jsonplaceholder.typicode.com/";

const PhotoCard = ({ photo }) => {
  return (
    <li key={photo.id} className="card">
      <img
        className="card-img-top"
        src={photo.url}
        alt={photo.id + photo.url}
        sizes="200dp"
      />
      <div className="card-body">
        <h1 className="card-title">{photo.title}</h1>
      </div>
    </li>
  );
};

export default function PostList() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetch(BASE_URL + "photos")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setPhotos(data);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div>
      <div>
        <h1>List Photos</h1>
      </div>
      <div className="container">
        <ul className="row">
          {photos.map((photo) => {
            return <PhotoCard photo={photo} />;
          })}
        </ul>
      </div>
    </div>
  );
}
