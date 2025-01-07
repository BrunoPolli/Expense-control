import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import './pages/Login/Login.js'
import Login from './pages/Login/Login.js';
import Home from './pages/Home/Home.js';
import Expense from './pages/Expense/Expense.js';
import Transactions from './pages/Transaction/Transaction.js';
import AuthProvider from './utils/AuthProvider.js';
import IndexHome from './pages/IndexHome/IndexHome.js';

function App() {

  return (
    <div className='App'>
        <BrowserRouter>
         <AuthProvider>
            <Routes>
                <Route path='/login' element={<Login/>}/>
                <Route path='/' element={<Home/>}>
                  <Route path='/home' element={<IndexHome/>}/>
                  <Route path='/expense' element={<Expense/>}/>
                  <Route path='/transactions' element={<Transactions/>}/>
                </Route>
            </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>

  );
}

export default App;
