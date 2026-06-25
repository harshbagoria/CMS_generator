
import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from './Page/Signup';
import Login from './Page/Login';


export default function App() {
  return (
   <BrowserRouter>
   <Routes>
    <Route path='/' element  = {<div>home</div>}/>
    
    
   <Route path="/Signup" element={<Signup />} />
   <Route path="/Login" element={<Login />} />
   </Routes>
   </BrowserRouter>
  )
}
