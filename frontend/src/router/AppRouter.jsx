import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Moods from '../components/Moods'
import History from '../components/History'
import Login from '../authentication/Login'
import Register from '../authentication/Register'
import PlayList from '../playList/PlayList'
import Home from '../page/Home'
import AdminUpload from '../page/AdminUpload'

const AppRouter = () => {
  return (
    <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/moods' element={<Moods/>}/>
        <Route path='/history' element={<History/>}/>
        <Route path='/admin/upload' element={<AdminUpload/>}/>
        <Route path='/playList' element={<PlayList/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
    </Routes>
  )
}

export default AppRouter;