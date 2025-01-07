import './Header.css'
import { useAuth } from '../../utils/AuthProvider';
import { useNavigate, Outlet } from 'react-router-dom';

function Header(){

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout()
  }

  const goToHome = () => {
    navigate('/home')
  }
  const goToExpenses = () => {
    navigate('/expense')
  }
  const goToTransactions = () => {
    navigate('/transactions')
  }
  
  return (
    <>
    <div className='header'>
      <button className='menu' onClick={goToHome}>Home</button>
      <button className='menu' onClick={goToExpenses}>Despesas</button>
      <button className='menu' onClick={goToTransactions}>Transações</button>
      <div className='logout'>
        <button className='menu' onClick={handleLogout}>Logout</button>
      </div>
    </div>

    </>
  )
}

export default Header;