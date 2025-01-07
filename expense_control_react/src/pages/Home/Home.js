import React, { useContext, useEffect } from "react";
import { useAuth } from "../../utils/AuthProvider";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Header from "../Header/Header";

function Home(){

  const { isAuthenticated, logout } = useAuth();

  function getCookie(name) {
    // Obtém todos os cookies como uma string
    let value = `; ${document.cookie}`;
    let parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;  // Retorna null caso o cookie não seja encontrado
}

let csrfToken = getCookie('access_token');
  
    return(
      <>
      
      <Header/>
      <Outlet/>
      </>
    )
  
}

export default Home;