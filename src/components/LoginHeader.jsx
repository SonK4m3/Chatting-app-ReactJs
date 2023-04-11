import {useState} from 'react'
import { useNavigate } from 'react-router-dom';


export default function LoginHeader() {
    const headerStyle = {
        overflow: "hidden",
        background: "linear-gradient(to left, red, yellow)",
        display: "flex",
        justifyContent: "space-between"
    };
    const [message, setMessage] = useState("Hello guys");
    const navigate = useNavigate();

  return (
    <div style={headerStyle}>
        <h1>{message}</h1>
        <button onClick={() => {setMessage('Login Successfully'); navigate('/books', { replace: true })}}>Login</button>
    </div>
  )
}
