import React, { useState, useEffect } from "react";

const students = [{
    id: 1,
    name: "nguyen hong son",
    dob: "19/05/2002",
    major: "IT",
    vaccinated: true,
  }];

export default function () {
  return (
    <div>
      <table>
        <tr>
          <th>Id</th>
          <th>Name</th>
          <th>Day of birth</th>
          <th>Major</th>
          <th>Vaccinated</th>
        </tr>
      </table>
      <tbody>
        {students.map((student) => {
          return (
            <tr>
              <th>{student.id}</th>
              <th>{student.name}</th>
              <th>{student.dob}</th>
              <th>{student.major}</th>
              <th>
                {student.vaccinated ? (
                  <input type="checkbox" checked />
                ) : (
                  <input type="checkbox" />
                )}
              </th>
            </tr>
          );
        })}
      </tbody>
    </div>
  );
}
