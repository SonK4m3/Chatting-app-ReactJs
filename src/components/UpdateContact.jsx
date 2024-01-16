import { useEffect, useRef, useState } from "react";
import * as jose from "jose";
import axios from "axios";
import { BASE_URL } from "../constant/Constant";

function UpdateContact() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [userContact, setUserContact] = useState(null);
  const userid = useRef(-1);
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result.split(",")[1];
        setSelectedImage(base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendImageToServer = async () => {
    const params = {
      userId: userid.current,
      profilePhoto: selectedImage,
    };

    if (params.userId === -1 || params.profilePhoto === null) {
      alert("Please select an image");
      return;
    }

    const response = await axios.post(`${BASE_URL}/contact/add`, params);

    const data = await response.data;
    console.log(data);
    if (data.success) {
      setSelectedImage(null);
      setIsUpdateSuccess(true);
    } else {
      alert(data.message);
    }
  };

  useEffect(() => {
    const fetchUserContact = async (userId) => {
      const response = await axios.get(
        `${BASE_URL}/contact/user?userId=${userId}`
      );
      const data = await response.data;
      if (data.success) {
        console.log(data);
        setUserContact(data.result);
      }
    };

    const token = localStorage.getItem("jwt");
    if (token !== null && token !== undefined) {
      const decodedToken = JSON.parse(
        new TextDecoder().decode(jose.base64url.decode(token.split(".")[1]))
      );
      if (decodedToken) {
        userid.current = decodedToken.id;
        fetchUserContact(decodedToken.id);
      }
    }
  }, [isUpdateSuccess]);

  return (
    <div>
      <h4>Update contact</h4>
      {userContact !== null ? (
        <div>
          <img
            className="rounded-3 m-3"
            src={`data:image/png;base64,${userContact.profilePhoto}`}
            style={{
              maxWidth: "100px",
              width: "50%",
              height: "auto",
            }}
            alt="profile"
          />
          <h4>{userContact.user.username}</h4>
        </div>
      ) : (
        <div>
          <p>Upload your image profile to connect with other!</p>
          <div>
            {selectedImage && (
              <img
                className="rounded-3 m-3"
                src={`data:image/png;base64,${selectedImage}`}
                style={{
                  maxWidth: "200px",
                  width: "50%",
                  height: "auto",
                }}
                alt="Selected"
              />
            )}
            <div className="mb-3">
              <label htmlFor="formFile" className="form-label">
                Image profile
              </label>
              <input
                className="form-control"
                type="file"
                id="formFile"
                onChange={handleImageChange}
              />
            </div>
            <button className="btn btn-success" onClick={sendImageToServer}>
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdateContact;
