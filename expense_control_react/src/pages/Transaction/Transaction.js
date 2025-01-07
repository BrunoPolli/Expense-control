import { useEffect, useState } from "react";
import axios from "axios";
import './Transactions.css'
import ReactModal from "react-modal";
import getCookie from "../../utils/getCookies";
import { months } from "../../utils/months";

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

ReactModal.setAppElement("#root")

function Transactions (){

  const [items, setItems] = useState([]);

  const [modalIsOpen, setIsOpen] = useState(false);
  const [transaction, setTransaction] = useState(0.0);
  const [selectedMonth, setSelectedMonth] = useState();

  const handleSelectMonth = (e) => {
    setSelectedMonth(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const csrfToken = getCookie("csrf_access_token");
    console.log("AQUI ", csrfToken)
    axios.post("http://localhost:5000/new-transaction", {
      value: transaction.toString(),
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
    .finally(() => setTransaction(0))
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
    axios.get('http://localhost:5000/transactions', {withCredentials: true})
    .then((res) => setItems(res.data.data))
    .catch((err) => console.log("ERR", err))
  }, [])

  return (
    
            <div className="transaction-container" id="transaction-container">
            <button className='add-transaction' onClick={openModal}>Add</button>

            <ReactModal
              isOpen={modalIsOpen}
              onAfterOpen={afterOpenModal}
              onRequestClose={closeModal}
              style={customStyles}
            >
              <form className="new-transaction-form">
                <p className="form-transaction-title">Nova Transação</p>
                <p className="form-transaction-title">Valor:</p>
                <input 
                type="number" 
                className="input-transaction"
                id="input-transaction"
                value={transaction}
                onChange={(e) => setTransaction(e.target.value)}
                />

                <p className="form-expense-title">Mês referência:</p>
                <select className='select-category' name="month" id="month" onChange={handleSelectMonth} required>
                  <option value="">Selecione uma opção</option>
                  {months.map(month => 
                  <option value={month.id}>{month.name}</option>
                  )}
                </select>

                <button className="submit-button-transaction" onClick={handleSubmit}>Salvar</button>
                <button className="submit-button-transaction" onClick={closeModal}>Fechar</button>
              </form>
            </ReactModal>

            { items.map((item) => {
              return (
                <>
                <div className='transaction'>
                  <p className='transaction-title'>Valor:</p>
                  <p className='transaction-description'>R$: {item.value}</p>
                  <hr/>
                  <p className='transaction-title'>Data:</p>
                  <p className='transaction-description'>{item.on_date}</p>
                </div>
                </>
              )
            }) }

            </div>
  )
}

export default Transactions;