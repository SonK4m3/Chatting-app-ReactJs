import { useEffect, useRef, useState } from "react";
import NavBar from "../../components/NavBar";
import axios from "axios";
import setAuthToken from "../../auth/setAuthJwt";
import { convertTimestampToTime } from "../../utils/Utils";
import { BASE_URL, BASE_WS } from "../../constant/Constant";
import ExpandedBar from "../../components/ExpandedBar";
import UpdateContact from "../../components/UpdateContact";
import SuggestionContact from "../../components/SuggesttionContact";
import FriendRequests from "../../components/FriendRequests";

const FriendsList = ({ friends, setUid }) => {
  return (
    <div
      className="bg-dark"
      style={{
        height: "100%",
      }}
    >
      <ol className="list-group list-group-numbered">
        {friends.map((friend, index) => (
          <li
            key={index}
            className="list-group-item d-flex justify-content-between align-items-start"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setUid(friend);
            }}
          >
            <div className="ms-2 me-auto">
              <div className="d-flex align-items-center">
                <img
                  src={`data:image/png;base64,${friend.profilePhoto}`}
                  alt="avatar"
                  style={{
                    maxWidth: "24px",
                    width: "50%",
                    height: "auto",
                  }}
                />
                <div className="fw-bold ms-1">{friend.user.username}</div>
              </div>
              <div className="d-lg-block d-none">New message</div>
            </div>
            <span className="badge bg-danger rounded-pill">1</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

const MessageArea = ({ uid }) => {
  const { id, profilePhoto, user } = uid;

  const containerRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [websocket, setWebsocket] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const receiveVideo = useRef(false);
  const loadRecentMessage = useRef(false);

  const fetchVideo = async (videoName) => {
    try {
      const url = `${BASE_URL}/video/${videoName}`;
      const response = await axios.get(url, { responseType: "blob" });
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error("Error fetching video:", error);
      return null;
    }
  };

  const fetchRecentMessages = async (messageId) => {
    if (messageId !== 0) loadRecentMessage.current = true;
    const response = await axios.get(
      `${BASE_URL}/messages/personal/recent-messages-by-id?receiverId=${user.id}&messageId=${messageId}`
    );
    const data = await response.data;
    if (data.success) {
      const loadVideos = async () => {
        const updatedMessages = await Promise.all(
          data.result.map(async (item) => {
            if (item.messageType === "RECORD") {
              const videoUrl = await fetchVideo(item.message);
              return { ...item, videoUrl };
            }
            return item;
          })
        );
        setMessages(updatedMessages);
      };

      loadVideos();
      // setMessages((prev) => [...data.result, ...prev]);
    }
  };

  useEffect(() => {
    if (user.id !== -1) {
      const token = axios.defaults.headers.common["Authorization"];
      const ws = new WebSocket(
        `${BASE_WS}/chat/personal/public/${user.id}?token=${
          token.split(" ")[1]
        }`
      );

      ws.onopen = () => {
        console.log("WebSocket connection opened");
        fetchRecentMessages(0);
      };

      ws.onmessage = (event) => {
        const data = event.data;
        // console.log(data);

        if (receiveVideo.current) {
          const blob = new Blob([data], { type: "video/mp4" });
          const videoUrl = URL.createObjectURL(blob);
          setSelectedVideo(videoUrl);
          receiveVideo.current = false;
        } else {
          const mess = JSON.parse(data);
          if (mess.messageType === "RECORD") receiveVideo.current = true;
          if (!mess.result) setMessages((prev) => [...prev, mess]);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
        setMessages([]);
      };
      setWebsocket(ws);

      return () => {
        ws.close();
      };
    }
  }, [user.id]);

  const sendMessage = () => {
    if (message === "" && selectedImage === null) return;

    const messageData = selectedImage
      ? {
          type: "IMAGE",
          value: selectedImage,
        }
      : {
          type: "TEXT",
          value: message,
        };

    websocket.send(JSON.stringify(messageData));
    setMessage("");
    setSelectedImage(null);
  };
  const videoInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const handleImageChange = (event) => {
    const file = imageInputRef.current.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result.split(",")[1];
        setSelectedImage(base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (event) => {
    const fileInput = videoInputRef.current;
    const file = fileInput?.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const videoData = event.target.result;
        websocket.send(videoData);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  useEffect(() => {
    if (containerRef.current && loadRecentMessage.current === false) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    } else {
      loadRecentMessage.current = false;
    }
  }, [messages]);

  return (
    <div
      className="w-75 col-md-6 col-lg-7 col-xl-8 bg-primary p-3"
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {user.id !== -1 ? (
        <>
          <div className="d-flex align-items-center my-1">
            <img
              src={`data:image/png;base64,${profilePhoto}`}
              alt="avatar"
              style={{
                maxHeight: "48px",
                width: "auto",
                height: "100%",
              }}
            />
            <h2 className="ms-1">{user.username}</h2>
          </div>
          <ul
            ref={containerRef}
            className=" bg-dark rounded-3 p-3"
            style={{ overflowY: "auto", height: "75vh" }}
          >
            <button
              onClick={() =>
                fetchRecentMessages(messages.length > 0 ? messages[0].id : 0)
              }
            >
              Load
            </button>
            {messages.map((mess, ind) =>
              mess.fromId === user.id ? (
                <li className="d-flex justify-content-between mb-4" key={ind}>
                  <div className="card">
                    <div className="card-header d-flex justify-content-between p-3">
                      <p className="fw-bold mb-0">{user.username}</p>
                      <p className="text-muted small mb-0">
                        <i className="far fa-clock"></i>{" "}
                        {convertTimestampToTime(mess.sendDT)}
                      </p>
                    </div>
                    <div className="card-body">
                      {mess.messageType === "TEXT" && (
                        <p className="mb-0">{mess.message}</p>
                      )}
                      {mess.messageType === "IMAGE" && (
                        <img
                          src={`data:image/png;base64,${mess.message}`}
                          style={{
                            maxWidth: "300px",
                          }}
                          alt="Selected"
                        />
                      )}
                      {mess.messageType === "RECORD" && (
                        <video
                          controls
                          width="300"
                          src={mess.videoUrl ? mess.videoUrl : selectedVideo}
                        />
                      )}
                    </div>
                  </div>
                </li>
              ) : (
                <li className="d-flex justify-content-end mb-4" key={ind}>
                  <div className="card">
                    <div className="card-header d-flex justify-content-between p-3">
                      <p className="fw-bold mb-0"></p>
                      <p className="text-muted small mb-0">
                        <i className="far fa-clock"></i>{" "}
                        {convertTimestampToTime(mess.sendDT)}
                      </p>
                    </div>
                    <div className="card-body">
                      {mess.messageType === "TEXT" && (
                        <p className="mb-0">{mess.message}</p>
                      )}
                      {mess.messageType === "IMAGE" && (
                        <img
                          src={`data:image/png;base64,${mess.message}`}
                          style={{
                            maxWidth: "300px",
                          }}
                          alt="Selected"
                        />
                      )}
                      {mess.messageType === "RECORD" && (
                        <video
                          controls
                          width="300"
                          src={mess.videoUrl ? mess.videoUrl : selectedVideo}
                        />
                      )}
                    </div>
                  </div>
                </li>
              )
            )}
          </ul>
          <div className="bg-dark mb-1">
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
          </div>
          <div className="mb-3 d-flex" style={{}}>
            <div className="d-flex justify-items-center w-auto h-100 align-items-center gap-1 me-1">
              <i
                className="fa-solid fa-image"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  imageInputRef.current.click();
                }}
              ></i>
              <i
                className="fa-solid fa-video"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  videoInputRef.current.click();
                }}
              ></i>
            </div>
            <div className="form-outline w-100 me-3">
              <input
                className="form-control"
                id="textAreaExample2"
                rows="1"
                placeholder="Aa"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage(e);
                  }
                }}
              ></input>
              <input
                style={{
                  display: "none",
                }}
                ref={imageInputRef}
                className="form-control"
                id="textAreaExample2"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              ></input>
              <input
                style={{
                  display: "none",
                }}
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
              />
            </div>
            <button
              type="button"
              className="btn btn-info btn-rounded float-end"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </>
      ) : (
        <div>
          <h1>Chưa chọn đoạn chat nào</h1>
        </div>
      )}
    </div>
  );
};

const friendProps = {
  id: -1,
  profilePhoto: "",
  user: {
    id: -1,
    username: "username",
    email: "email",
  },
};

const HomePage = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [friends, setFriends] = useState([]);

  const [uid, setUid] = useState({
    id: -1,
    profilePhoto: "",
    user: {
      id: -1,
      username: "username",
      email: "email",
    },
  });

  const [expandedNav, setExpandedNav] = useState(null);

  const handleExpanded = (feature) => {
    if (expandedNav === feature) {
      setExpandedNav(null);
    } else {
      setExpandedNav(feature);
    }
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    setIsLogin(false);
  };

  const fetchFriend = async () => {
    const response = await axios.get(`${BASE_URL}/users/friend/list-contacts`);
    const data = await response.data;
    console.log(data);
    if (data.success) {
      setFriends(data.result);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token !== null && token !== undefined) {
      setAuthToken(token);
      setIsLogin(true);

      fetchFriend();
    }
  }, []);

  return (
    <div
      className="w-100"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "row",
        position: "relative",
      }}
    >
      <NavBar isLogin={isLogin} logout={logout} action={[handleExpanded]} />
      {isLogin && (
        <div
          className=""
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            className="w-100 d-flex bg-success"
            style={{
              height: "100%",
            }}
          >
            <FriendsList friends={friends} setUid={setUid} />
            {expandedNav !== null && (
              <ExpandedBar>
                {expandedNav === "search" ? (
                  <>
                    <div className="px-auto">
                      <input
                        className="form-control"
                        id="textAreaExample2"
                        placeholder="Search..."
                        onChange={(e) => {}}
                        onKeyDown={(e) => {}}
                      />
                    </div>
                    <div
                      className="bg-dark"
                      style={{
                        width: "98%",
                        height: "1px",
                        margin: "4px auto",
                      }}
                    >
                      <div>Contact name</div>
                    </div>
                  </>
                ) : expandedNav === "suggestion" ? (
                  <SuggestionContact />
                ) : expandedNav === "update" ? (
                  <UpdateContact />
                ) : expandedNav === "requests" ? (
                  <FriendRequests />
                ) : (
                  <></>
                )}
              </ExpandedBar>
            )}

            <MessageArea uid={uid} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
