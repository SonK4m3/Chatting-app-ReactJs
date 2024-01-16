import { useEffect, useRef, useState } from "react";
import * as jose from "jose";
import axios from "axios";
import { BASE_URL } from "../constant/Constant";
import { convertTimestampToTime } from "../utils/Utils";

function FriendRequests() {
  const [invitations, setInvitations] = useState(null);
  const userid = useRef(-1);

  const responseInvitation = async (invitation, isAccept) => {
    const response = await axios.post(
      `${BASE_URL}/invitation/response?invitationId=${invitation.id}&isAccept=${isAccept}&contactId=${invitation.contact.id}&fromContactId=${invitation.fromContact.id}`
    );
    const data = await response.data;
    if (data.success) {
      setInvitations((prev) => prev.filter((it) => it.id !== invitation.id));
    }
  };

  useEffect(() => {
    const fetchContacts = async (id) => {
      try {
        const response = await axios.get(`${BASE_URL}/invitation/requests`);

        const data = await response.data;
        if (data.success) {
          console.log(data);
          setInvitations(data.result);
        }
      } catch (err) {
        if (err.response.status === 400) {
          alert("Update your contact before connecting with others");
        }
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
      <h4>Requests</h4>
      {invitations ? (
        <>
          {invitations.length > 0 ? (
            <div>
              {invitations.map((inv, ind) => (
                <div
                  key={ind}
                  className="bg-secondary w-auto h-auto rounded-3 p-3 mb-3"
                >
                  <div className="d-flex align-items-center">
                    <img
                      src={`data:image/png;base64,${inv.fromContact.profilePhoto}`}
                      alt="avatar"
                      style={{
                        maxWidth: "50px",
                        width: "50%",
                        height: "auto",
                      }}
                    />
                    <div>{inv.fromContact.user.username}</div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>{convertTimestampToTime(inv.sendTime)}</div>
                    <div>
                      <button
                        className="btn btn-success me-3"
                        onClick={() => responseInvitation(inv, 1)}
                      >
                        Accept
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => responseInvitation(inv, 0)}
                      >
                        Deny
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>There are no friend requests</div>
          )}
        </>
      ) : (
        <div>Update your contact</div>
      )}
    </div>
  );
}

export default FriendRequests;
