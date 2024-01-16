import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../constant/Constant";

const LoginPage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user.email !== "" && user.password !== "") {
      console.log(user);
      const response = await axios.post(`${BASE_URL}/v1/users/login`, user);
      const data = await response.data;
      if (data.success) {
        const token = data.result;
        localStorage.setItem("jwt", token);

        navigate("/home", { replace: true });
      } else {
        alert(data.message);
      }
    }
  };

  useEffect(() => {
    async function fetchDataFromKtorServer() {
      try {
        const response = await fetch(`${BASE_URL}/hello`); // Replace with your Ktor server URL and API endpoint
        if (response.ok) {
          const data = await response.json();
          console.log("Response from Ktor Server:", data);
        } else {
          console.error("Failed to fetch data from Ktor Server");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchDataFromKtorServer();
  }, []);

  return (
    <div className="w-100 p-3">
      <div className="h1">Đăng nhập</div>
      <div className="w-50">
        <div className="w-50 mb-3">
          <label htmlFor="exampleFormControlInput1" className="form-label">
            Email:
          </label>
          <input
            type="text"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="form-control"
            placeholder="Email"
            aria-describedby="addon-wrapping"
            id="exampleFormControlInput1"
          />
        </div>
        <div className="w-50 mb-3">
          <label htmlFor="exampleFormControlInput2" className="form-label">
            Password:
          </label>

          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            className="form-control"
            placeholder="Password"
            aria-describedby="addon-wrapping"
            id="exampleFormControlInput2"
          />
        </div>
        <button className="btn btn-primary mb-3" onClick={handleSubmit}>
          Đăng nhập
        </button>
        <p>
          Chưa có tài khoản?{" "}
          <a href="/register">
            <strong>Đăng ký</strong>
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
