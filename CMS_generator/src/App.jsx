
import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from './Page/Signup';
import Login from './Page/Login';
import GenerateImage from './Page/generateimage';
import Rewrite from './Page/Rewrite';
//import GenerateContent from './Page/GenerateContant';


export default function App() {
  return (
   <BrowserRouter>
   <Routes>
    <Route path='/' element  = {<div>home</div>}/>
    
    
   <Route path="/signup" element={<Signup />} />
   <Route path="/login" element={<Login />} />
   <Route path = "/generateimage" element = {<GenerateImage/>}/>
   <Route path = "/generatecontent" element = {<Rewrite/>}/>
  
   </Routes>
   </BrowserRouter>
  )
}
