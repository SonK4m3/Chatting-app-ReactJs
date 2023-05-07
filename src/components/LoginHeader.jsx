import { useState } from "react";
import DetectLanguage from "../pages/DetectLanguage";

export default function LoginHeader() {
  const headerStyle = {
    overflow: "hidden",
    background: "linear-gradient(to left, red, yellow)",
    display: "flex",
    justifyContent: "space-between",
  };
  const [message, setMessage] = useState("Hello guys");

  return (
    <div>
      <div style={headerStyle}>
        <h1>{message}</h1>
        <button onClick={() => setMessage("Login Successfully")}>Login</button>
      </div>
      <div>
        <a href="/books" className="btn btn-primary">Book</a>
        <a href='/pets' className="btn btn-primary">Pet</a>
        <a href='/students' className="btn btn-primary">Bài thực hành 3</a>
      </div>
      <div className="h-100 d-flex align-items-center justify-content-center">
        <DetectLanguage />
      </div>
    </div>
  );
}
