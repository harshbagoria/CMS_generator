
import React from 'react'
import { Routes, Route } from "react-router-dom";
import Signup from './Page/Signup';
import Login from './Page/Login';
import GenerateImage from './Page/generateimage';
import Rewrite from './Page/Rewrite';
//import GenerateContent from './Page/GenerateContant';
import GeneratedImagehistory from './Page/GeneratedImagehistory';
import Home from './Page/Home';
import GeneratedContentHistory from './Page/Generatecontenthistory';
import Protectedroutes from './Component/Protectedroutes';


export default function App() {
  return (
   <Routes>
    <Route path='/' element  = {<div>home</div>}/>
    
    
   <Route path="/signup" element={ <Signup />} />
   <Route path="/login" element={<Login />} />
   <Route path = "/generateimage" element = {<Protectedroutes><GenerateImage/></Protectedroutes>}/>
   <Route path = "/generatecontent" element = {<Protectedroutes><Rewrite/></Protectedroutes>}/>
   <Route path = "/generatedimagehistory" element = {<Protectedroutes><GeneratedImagehistory/></Protectedroutes>}/>
   <Route path = "/generatedcontentHistory" element = {<Protectedroutes><GeneratedContentHistory/></Protectedroutes>}/>
   <Route path  = "/home" element = {<Protectedroutes><Home/></Protectedroutes>}/>

  
   </Routes>
  )
}

