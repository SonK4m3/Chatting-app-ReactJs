import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../constant/Constant";
import axios from "axios";

const RegisterPage = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
    username: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user.email !== "" && user.password !== "") {
      console.log(user);
      const response = await axios.post(`${BASE_URL}/v1/users/register`, user);
      const data = await response.data;
      if (data.success) {
        const token = data.result;
        localStorage.setItem("jwt", token);

        navigate("/home", { replace: true });
      } else {
        alert(data.message);
      }
      // try {
      //   const formData = new FormData();
      //   formData.append("email", user.email);
      //   formData.append("password", user.password);
      //   formData.append("username", user.username);
      //   const response = await fetch(
      //     "http://127.0.0.1:8080/v1/users/register",
      //     {
      //       method: "POST",
      //       headers: {
      //         Accept: "application/json",
      //         "Content-Type": "application/json",
      //       },
      //       mode: "no-cors",
      //       body: JSON.stringify(user),
      //     }
      //   );

      //   const data = await response.json();
      //   console.log(data);
      //   if (data.success) {
      //     const token = data.result;
      //     localStorage.setItem("jwt", token);

      //     navigate("/home", { replace: true });
      //   } else {
      //     alert(data.message);
      //   }
      // } catch (error) {
      //   console.error("Lỗi kết nối", error);
      // }
    }
  };

  return (
    <div className="w-100 p-3">
      <div className="h1">Đăng ký</div>
      <div className="w-25">
        <div className="input-group flex-nowrap">
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
            className="form-control"
            placeholder="Username"
            aria-describedby="addon-wrapping"
          />
        </div>
        <div className="input-group flex-nowrap">
          <input
            type="text"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="form-control"
            placeholder="Email"
            aria-describedby="addon-wrapping"
          />
        </div>
        <div className="input-group flex-nowrap">
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            className="form-control"
            placeholder="Password"
            aria-describedby="addon-wrapping"
          />
        </div>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Đăng ký
        </button>
        <p>
          Đã có tài khoản?{" "}
          <a href="/login">
            <strong>Đăng nhập</strong>
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
