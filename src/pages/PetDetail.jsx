import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { format } from 'date-fns'
const api_url = "http://localhost:8080/pet/";

function Form({ action, pet }) {
  const [id, setId] = useState(pet.id);
  const [name, setName] = useState(pet.name);
  const [dob, setDob] = useState(pet.dob);
  const [race, setRace] = useState(pet.race);
  const [vaccinated, setVaccinated] = useState(pet.vaccinated);

  function handleSubmit(event) {
    event.preventDefault();
    const nb = {
      id: id,
      name: name,
      dob: dob,
      race: race,
      vaccinated: vaccinated,
    };
    const dataPost = JSON.stringify(nb);
    // alert(dataPost);
    fetch(api_url + "add", {
      method: action,
      body: dataPost,
    })
      .then((response) => {
        if (response.ok) {
          window.location.href = "/pets"; // redirect to home page
        } else {
            alert("Input format is incorrect! Please enter again.");
        };
      })
      .catch((error) => console.log(error));
  }

  function handleInput(event, type) {
    switch (type) {
      case "name":
        setName(event.target.value);
        break;
      case "dob":
        setDob(format(new Date(event.target.value), 'yyyy-MM-dd'));
        break;
      case "race":
        setRace(event.target.value);
        break;
      case "vaccinated":
        setVaccinated(event.target.checked);
        break;
      default:
    }
  }

  return (
    <>
      <form className="m-lg-8" onSubmit={handleSubmit}>
        <div className="form-group col-lg-4">
          <label htmlFor="inputName">Name</label>
          <input
            type="text"
            className="form-control"
            id="inputName"
            value={name}
            onChange={(event) => handleInput(event, "name")}
            placeholder="Enter name"
            required
          />
        </div>
        <div className="form-group col-lg-4">
          <label htmlFor="inputDob">Day of birth</label>
          <input
            type="date"
            className="form-control"
            id="inputDob"
            value={dob}
            onChange={(event) => handleInput(event, "dob")}
            aria-describedby="titleHelp"
            placeholder="Enter day of birth"
            required
          />
          <small id="titleHelp" className="form-text text-muted">
            Date should be yyyy-MM-dd format.
          </small>
        </div>
        <div className="form-group col-lg-4">
          <label htmlFor="inputRace">Race</label>
          <input
            type="text"
            className="form-control"
            id="inputRace"
            value={race}
            onChange={(event) => handleInput(event, "race")}
            placeholder="Enter race"
            required
          />
        </div>
        <div className="form-check col-lg-4">
          <input
            type="checkbox"
            className="form-check-vaccinated"
            id="checkVaccinated"
            checked={vaccinated}
            onChange={(event) => handleInput(event, "vaccinated")}
          />
          <label className="form-check-label" htmlFor="checkVaccinated">
            Vaccinated
          </label>
        </div>
        <div>
          <button type="submit" className="btn btn-primary mr-2">
            Save
          </button>
          <button className="btn btn-secondary ml-2" onClick={() => window.history.back()}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}

function PetView({ id }) {
  const [mpet, setPet] = useState("");

  useEffect(() => {
    fetch(api_url + id)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setPet(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return (
    <div className="container">
      <div className="row">
        <h1>Update pet</h1>
      </div>
      {mpet && <Form action={"PUT"} pet={mpet} />};
    </div>
  );
}

export default function PetDetail() {
  const { id } = useParams();
  const mp = {
    id: -1,
    name: "",
    dob: "2023-04-13",
    race: "",
    vaccinated: false,
  };

  return (
    <>
      {parseInt(id) === -1 ? (
        <div className="container">
          <div className="row">
            <h1>New pet</h1>
          </div>
          <Form action={"POST"} pet={mp} />
        </div>
      ) : (
        <PetView id={id} />
      )}
    </>
  );
}
