
import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from './Page/Signup';
import Login from './Page/Login';
import GenerateImage from './Page/generateimage';


export default function App() {
  return (
   <BrowserRouter>
   <Routes>
    <Route path='/' element  = {<div>home</div>}/>
    
    
   <Route path="/signup" element={<Signup />} />
   <Route path="/login" element={<Login />} />
   <Route path = "/generateimage" element = {<GenerateImage/>}/>
   </Routes>
   </BrowserRouter>
  )
}
