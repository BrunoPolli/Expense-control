import { useContext, createContext, useState, useEffect } from "react";
import { useAsyncError, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();


const url = 'http://localhost:5000/isauth'

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    verifyAuth();
  }, [])

  useEffect(() => {
    // console.log("Changing...")
    if(isAuthenticated){
      navigate(location.pathname)    
    }else{
      navigate('/login')    
    }
  }, [isAuthenticated, navigate, location.pathname])

  const verifyAuth = async () => {
    axios.get(url, {withCredentials: true})   
    .then((res) => {
      setIsAuthenticated(true)
      navigate(location.pathname)
    }) 
    .catch((err) => {
      setIsAuthenticated(false)
    })
  }

  const login = () => {
    setIsAuthenticated(true);
  }
  const logout = () => {
    axios.get('http://localhost:5000/logout', {withCredentials: true})
    .then((res) => setIsAuthenticated(false))
  }

  return(
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      { children }
    </AuthContext.Provider>
  )

}

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);