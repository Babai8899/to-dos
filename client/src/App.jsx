import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './shared/Navbar'
import Footer from './shared/Footer'
import Welcome from './pages/Welcome'
import Login from './modules/Users/Login'
import Home from './pages/Home'
import AuthProvider from './hooks/AuthProvider'
import ToastProvider from './hooks/ToastProvider'
import PrivateRoute from './routes/PrivateRoute'
import View from './modules/Users/View'
import Unauthorized from './pages/errors/Unauthorized'
import { AnimatePresence } from 'framer-motion'
import Sidebar from './shared/Sidebar'
import CreateTask from './modules/todos/task/CreateTask'
import CreateEvent from './modules/todos/event/CreateEvent'
import CreateNote from './modules/todos/note/CreateNote'
import CreateList from './modules/todos/list/CreateList'
import Register from './modules/Users/Register'
import UpdatePassword from './modules/Users/UpdatePassword'
import ChatBot from './shared/ChatBot'
function App() {

  return (
    <>
      <AnimatePresence mode='wait'>
        <Router>
          <ToastProvider>
            <AuthProvider>
              <ChatBot/>
              <Navbar />
              <Sidebar />
              <Routes>
                <Route exact path='/' element={<Welcome />} />
                <Route exact path='/unathorized' element={<Unauthorized />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
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
                <Route path='/user/update' element={
                  <PrivateRoute>
                    <UpdatePassword />
                  </PrivateRoute>
                } />
                <Route
                  path="/task"
                  element={
                    <PrivateRoute>
                      <CreateTask />
                    </PrivateRoute>
                  }
                />
                <Route path='/event' element={
                  <PrivateRoute>
                    <CreateEvent />
                  </PrivateRoute>
                } />
                <Route
                  path="/note"
                  element={
                    <PrivateRoute>
                      <CreateNote />
                    </PrivateRoute>
                  }
                />
                <Route path='/list' element={
                  <PrivateRoute>
                    <CreateList />
                  </PrivateRoute>
                } />
              </Routes>
              <Footer />
            </AuthProvider>
          </ToastProvider>
        </Router>
      </AnimatePresence>
    </>
  )
}

export default App
