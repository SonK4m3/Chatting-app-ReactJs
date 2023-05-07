import React, { useState, useEffect } from "react";

const URL_BASE = 'http://localhost:8080';
const api_url = "http://localhost:8080/pets";

function onClickDelete(id) {
  var notification = 'Do you want to remove this pet?';
  if (window.confirm(notification)) {
    fetch(URL_BASE + `/pet/delete/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if(data){
            alert('Delete successfully'); 
            window.location.href='/pets'; 
        } else alert('Can\'t remove');
      });
  } else return false;
}

const Pets = () => {

  const [pets, setPets] = useState([]);
  useEffect(() => {
    fetch(api_url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setPets(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return (
    <><div className="container">
      <div className="row">
        <h1>List Pets</h1>
      </div>
    <div>
      <input placeholder="Enter pet name" />
    </div>

    </div><table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Day of birth</th>
            <th>Race</th>
            <th>Vaccinated</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody id="pet-rows">
          {pets.map((pet) => {
            return (
              <tr key={pet.id}>
                <td>{pet.id}</td>
                <td>{pet.name}</td>
                <td>{pet.dob}</td>
                <td>{pet.race}</td>
                <td>{pet.vaccinated ? <input type="checkbox" defaultChecked disabled/> : <input type="checkbox" disabled/>} </td>
                <td className="d-flex justify-content-around">
                  <a href={`pet/${pet.id}`} className="btn btn-success">Edit</a>
                  <button className="btn btn-danger" onClick={() => onClickDelete(pet.id)} >Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="text-center">
        <a href= 'pet/-1' className="btn btn-primary">New Pet</a>
      </div>
    </>
  );
};

export default Pets;
