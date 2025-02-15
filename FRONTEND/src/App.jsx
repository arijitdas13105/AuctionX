import { useState } from 'react'

import './App.css'
import Home from './Pages/Home/Home'
import { Route, Routes } from 'react-router-dom'
import Login from './Pages/Auth/Login'
import Navbar from './Pages/Home/components/Navbar'
import AuthPage from './Pages/Auth/AuthPage'
import CreateItem from './Pages/SellerDashboard/components/CreateItem'
import SellerProducts from './Pages/SellerDashboard/components/SellerProducts'
import SellerDashboard from './Pages/SellerDashboard/SellerDashboard'
import CategoryProducts from './Pages/Home/components/CategoryProducts'
import ProductDetails from './Pages/Home/components/ProductDetails/ProductDetails'
import ProfileScreen from './Pages/Profile/ProfileScreen'
import { useSelector } from 'react-redux'
import AllPopularProducts from './Pages/Home/components/PopularItems/AllPopularProducts'
import AllAvailableItems from './Pages/Home/components/AvailableItems/Components/AllAvailableItems'
import SearchItems from './Pages/Home/Search/SearchItems'

function App() {

  const isLoggedIn=useSelector((state)=>state.auth.isLoggedIn)
  return (
    <div className='  p-3   '>
    <Navbar/>
    <Routes initially={isLoggedIn?'profile':''} >
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={ <AuthPage/>}/>
      <Route path='/createItem' element={<CreateItem/> }/>
      <Route path='/myProducts' element={<SellerDashboard/>}/>
      <Route path='/products/:productId' element={<ProductDetails/>}/>
      <Route path='/category/:categoryId' element={<CategoryProducts/>}/>
      <Route path='/allPopularProducts' element={<AllPopularProducts/>}/>
      <Route path='/allAvailableItems' element={<AllAvailableItems/>}/>
      <Route path='/profile' element={<ProfileScreen/>}/>
      <Route path='/search' element={<SearchItems/>}/>
     
    </Routes>
     
    </div>
  )
}

export default App





 
