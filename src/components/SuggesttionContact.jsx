import { useEffect, useRef, useState } from "react";
import * as jose from "jose";
import axios from "axios";
import { BASE_URL } from "../constant/Constant";

function SuggestionContact() {
  const [contacts, setContacts] = useState(null);
  const userid = useRef(-1);

    const sendInvitation = async (id) => {
        const response = await axios.post(
            `${BASE_URL}/invitation/send?userId=${id}`
          );
          const data = await response.data;
          console.log(data);
    }


  useEffect(() => {
    const fetchContacts = async (id) => {
      const response = await axios.get(
        `${BASE_URL}/contact/suggestions?id=${id}`
      );
      const data = await response.data;
      if (data.success) {
        console.log(data);
        setContacts(data.result);
      }
    };

    const token = localStorage.getItem("jwt");
    if (token !== null && token !== undefined) {
      const decodedToken = JSON.parse(
        new TextDecoder().decode(jose.base64url.decode(token.split(".")[1]))
      );
      if (decodedToken) {
        userid.current = decodedToken.id;
        fetchContacts(decodedToken.id);
      }
    }
  }, []);

  return (
    <div>
      <h4>Contacts</h4>
      {contacts && (
        <div>
          {contacts.map((con, ind) => (
            <div key={ind} className="d-flex align-items-center">
              <img
                src={`data:image/png;base64,${con.profilePhoto}`}
                alt="avatar"
                style={{
                  maxWidth: "50px",
                  width: "50%",
                  height: "auto",
                }}
              />
              <div className="mx-3">{con.user.username}</div>
              <button className="btn btn-danger" onClick={() => sendInvitation(con.id)}>Invite</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SuggestionContact;
