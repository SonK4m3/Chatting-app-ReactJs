import React, {useState} from 'react'

export default function Login() {
  const [message, setMessage] = useState('xin chao cac ban');
  return (
    <div>
        <h1>{message}</h1>
        <button onClick={() => setMessage('Login Successful')}>Login</button>
    </div>
  )
}