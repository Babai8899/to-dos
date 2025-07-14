import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './shared/Navbar'
import Footer from './shared/Footer'
import Welcome from './pages/Welcome'
import Login from './modules/Users/Login'
import Home from './pages/Home'
import AuthProvider from './hooks/AuthProvider'
import PrivateRoute from './routes/PrivateRoute'
import View from './modules/Users/View'
import Unauthorized from './pages/errors/unauthorized'
function App() {

  return (
    <>
      <Router>
        <AuthProvider>
          <Navbar />
          <Routes>

            <Route exact path='/' element={<Welcome />} />
            <Route exact path='/unathorized' element={<Unauthorized />} />
            <Route path='/login' element={<Login />} />
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route path='/user/view' element={
              <PrivateRoute>
                <View />
              </PrivateRoute>
            } />
          </Routes>
          <Footer />
        </AuthProvider>
      </Router>
    </>
  )
}

export default App
