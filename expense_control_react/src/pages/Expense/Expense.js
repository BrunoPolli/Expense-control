import { useEffect, useState } from 'react';
import './Expense.css'
import axios from 'axios';
import ReactModal from 'react-modal';
import getCookie from '../../utils/getCookies';
import { months } from '../../utils/months';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '8px',
    backgroundColor: '#3A5253'
  },
};

function Expense() {

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedMonth, setSelectedMonth] = useState();
  const [description, setDescription] = useState("");

  const [modalIsOpen, setIsOpen] = useState(false);
  const [expense, setExpense] = useState(0.0);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const csrfToken = getCookie("csrf_access_token");

    axios.post("http://localhost:5000/new-expense", {
      description: description,
      value: expense,
      category_id: selectedCategory,
      month_ref: selectedMonth
    },
    { 
      headers: {
        "X-CSRF-Token": csrfToken
      },
      withCredentials: true
    }
    )
    .then((res) => setIsOpen(false))
    .catch((err) => {
      setIsOpen(false)
      alert("Opss, an error occurred")
    })
    .finally(() => setExpense(0))
  }

  const handleSelectCategory = (e) => {
    setSelectedCategory(e.target.value)
  }
  const handleSelectMonth = (e) => {
    setSelectedMonth(e.target.value)
  }

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references can be accessed.
  }

  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    axios.get('http://localhost:5000/expense', {withCredentials: true})
    .then((res) => setItems(res.data.data))
    .then((err) => console.log(`Err: ${err}`))
  }, [])
  
  useEffect(() => {
    axios.get('http://localhost:5000/categories', {withCredentials: true})
    .then((res) => setCategories(res.data.data))
    .then((err) => console.log(`Err: ${err}`))
  }, [])

  return (
    <div className="expense-container">
      <button className='add-expense' onClick={openModal}>Add</button>

      <ReactModal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <form className="new-expense-form">
          <p className="form-expense-title">Nova Despesa</p>
          <p className="form-expense-title">Valor:</p>
          <input 
          type="number" 
          className="input-expense"
          id="input-expense"
          value={expense}
          onChange={(e) => setExpense(e.target.value)}
          />
          <p className="form-expense-title">Descrição:</p>
          <input type='text' id='input-description' className='input-expense' value={description} onChange={(e) => setDescription(e.target.value)}/>
          <p className="form-expense-title">Categoria:</p>
          <select className='select-category' name="category" id="category" onChange={handleSelectCategory} required>
            <option value="">Selecione uma opção</option>
            {categories.map(category => 
            <option value={category.id}>{category.name}</option>
            )}
          </select>

          <p className="form-expense-title">Mês referência:</p>
          <select className='select-category' name="month" id="month" onChange={handleSelectMonth} required>
            <option value="">Selecione uma opção</option>
            {months.map(month => 
            <option value={month.id}>{month.name}</option>
            )}
          </select>

          <button className="submit-button-expense" onClick={handleSubmit}>Salvar</button>
          <button className="submit-button-expense" onClick={closeModal}>Fechar</button>
        </form>
      </ReactModal>

      { items.map((item) => {
        return (
          <>
            <div className='expense'>

              <p className='expense-title'>Categoria:</p>
              <p className='expense-description'>{item.category}</p>
              <hr/>
              
              <p className='expense-title'>Valor:</p>
              <p className='expense-description'>R$: {item.value.toFixed(2)}</p>
              <hr/>
              
              <p className='expense-title'>Descrição:</p>
              <p className='expense-description'>{
                item.description ?
                item.description : "---"
              }</p>
              <hr/>
              
              <p className='expense-title'>Data:</p>
              <p className='expense-description'> {item.on_date}</p>
            </div>
          </>
        )
      }) }
      
    </div>
  )
}

export default Expense;