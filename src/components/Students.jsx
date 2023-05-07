import React, { useState, useEffect } from "react";

const URL_BASE = "http://localhost:8080";
const api_url = "http://localhost:8080/students";
const api_find_text = "http://localhost:8080/student/find/";

function onClickDelete(id) {
  var notification = "Do you want to remove this student?";
  if (window.confirm(notification)) {
    fetch(URL_BASE + `/student/delete/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          alert("Delete successfully");
          window.location.href = "/students";
        } else alert("Can't remove");
      });
  } else return false;
}

function handleSearch(q, callBack) {
    if(q === "") {
        fetch(api_url)
        .then((response) => response.json())
        .then((data) => {
        console.log(data);
        callBack(data);
        })
        .catch((err) => {
        console.log(err.message);
        });
        return;
    }

    fetch(api_find_text + q)
        .then((response) => response.json())
        .then((data) => {
        console.log(data);
        callBack(data);
        })
        .catch((err) => {
        console.log(err.message);
        });
}

function SearchBar(props) {
  const [q, setQuery] = useState("");
    
  const onChangeQuery = (qr) => {
    setQuery(qr);

    const newFilteredNames = props.nStudents.filter((student) =>
      student.name.toLowerCase().includes(q.toLowerCase()) || student.major.toLowerCase().includes(q.toLowerCase())
    );
    
    props.setStudents(newFilteredNames);
  };

  return (
    <div>
      <input
        type="text"
        value={q}
        onChange={(e) => onChangeQuery(e.target.value)}
      />
      <button onClick={() => handleSearch(q, props.setStudents)}>Search</button>
    </div>
  );
}

const Students = () => {
  const [students, setStudents] = useState([]);
  const [nStudents, setNStudents] = useState([]);

  useEffect(() => {
    fetch(api_url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setStudents(data);
        setNStudents(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return (
    <>
      <div className="container">
        <div className="row">
          <h1>List Students</h1>
        </div>
        <div>
          {/* <input placeholder="Enter student name" /> */}
          <SearchBar students = {students} setStudents = {setStudents} nStudents={nStudents} setNStudents={setNStudents} />
        </div>
      </div>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Day of birth</th>
            <th>Major</th>
            <th>Vaccinated</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody id="student-rows">
          {students.map((student) => {
            return (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.dob}</td>
                <td>{student.major}</td>
                <td>
                  {student.vaccinated ? (
                    <input type="checkbox" defaultChecked disabled />
                  ) : (
                    <input type="checkbox" disabled />
                  )}{" "}
                </td>
                <td className="d-flex justify-content-around">
                  <a href={`student/${student.id}`} className="btn btn-success">
                    View
                  </a>
                  {/* <button className="btn btn-danger" onClick={() => onClickDelete(student.id)} >Delete</button> */}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* <div className="text-center">
        <a href= 'student/-1' className="btn btn-primary">New Student</a>
      </div> */}
    </>
  );
};

export default Students;
