import React from 'react';
import './Login.css'
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../utils/AuthProvider';
import { useNavigate } from 'react-router-dom';

function Login(){

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const url = 'http://localhost:5000/login';
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault()

    axios.post(url, {
      username: name,
      password: password
    }, {withCredentials:true})
    .then((res) => {
      login()
      navigate('/home')
    })
    .catch((err) => alert("Incorrect name or password!"))

    .finally(() => {
      setName("")
      setPassword("")
    })

  }

  return(
    <>
      <div className='login-container-image'/>
    
      <div className='login-container'>
        <form onSubmit={handleSubmit} className='form-container'>
          <label htmlFor='name'>
          Nome
          </label>
          <input type='text' id='name' name='name' value={name} className='login-input' onChange={(e) => setName(e.target.value)}/>
          <label htmlFor='password'>
          Senha
          </label>
          <input type='password' id='password' name='password' value={password} className='login-input' onChange={(e) => setPassword(e.target.value)}/>
          <button type='submit' className='submit-button'>Send</button>
        </form>
      </div>
    </>
  )
}

export default Login;