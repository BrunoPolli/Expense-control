import { useEffect, useState } from 'react';
import './IndexHome.css'
import axios from 'axios';
import { months } from '../../utils/months';

function IndexHome() {

  const [total, setTotal] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  
  useEffect(() => {
    
    if(selectedYear && selectedMonth){
      axios.get("http://localhost:5000/total", 
      {
        params: {
          year_ref: selectedYear,
          month_ref: selectedMonth
        }
      },
      {withCredentials: true})
      .then((res) => setTotal(res.data))
      .catch((err) => console.log('ERR:', err))
    }

  }, [selectedYear, selectedMonth])

  const handleSelectYear = (e) => {
    setSelectedYear(e.target.value)
  }

  const handleSelectMonth = (e) => {
    setSelectedMonth(e.target.value)
  }

  return (
    <div className="index-home-container">
      <div className="select-container">
        <p className="select-title">Ano</p>
        <select className='select-option' id='select-year' onChange={handleSelectYear}>
          <option value=""></option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </select>

        <p className="select-title">Mês</p>
        <select className="select-option" id='select-month' onChange={handleSelectMonth}>
          <option value=""></option>
          { months.map((month) => {
            return(
              <option value={month.id}>{month.name}</option>
            )
          }) }
        </select>
      </div>
    
      <div className='home-item'>
        { !selectedMonth | !selectedYear ?  
          <p className='title'>Selecione o ano e o mês</p>
          :
          <>
            <p className='title'>Ano: {total.year}</p>
            <p className='title'>Mês: {total.month}</p>
            <p className='total'>Total: R${total.total}</p>
          </>
        }
        
      </div>

    </div>
  )
}

export default IndexHome;