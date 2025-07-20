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
import Unauthorized from './pages/errors/Unauthorized'
import { AnimatePresence } from 'framer-motion'
import SidebarItems from './shared/SidebarItems'
import CreateTask from './modules/todos/task/CreateTask'
import CreateEvent from './modules/todos/event/CreateEvent'
import CreateNote from './modules/todos/note/CreateNote'
import CreateList from './modules/todos/list/CreateList'
function App() {

  return (
    <>
      <AnimatePresence mode='wait'>
        <Router>
          <AuthProvider>
            <Navbar />
            <SidebarItems />
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
        </Router>
      </AnimatePresence>
    </>
  )
}

export default App
