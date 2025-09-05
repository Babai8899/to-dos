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
import PushProvider from './hooks/PushProvider'
import Dummy from './Dummy'
function App() {

  return (
  <div className="noscrollbar min-h-screen w-screen overflow-x-hidden flex flex-col backdrop-blur-sm bg-white/30 dark:bg-black/20 transition-colors duration-100">
      <div className="flex-grow flex flex-col">
        <AnimatePresence mode='wait'>
          <Router>
            <ToastProvider>
              <PushProvider>
                <AuthProvider>
                  <Navbar />
                  <ChatBot />
                  <Sidebar />
                  <Routes>
                    <Route exact path='/' element={<Welcome />} />
                    <Route exact path='/home' element={<Home />} />
                    <Route exact path='/dummy' element={<Dummy />} />
                    <Route exact path='/unathorized' element={<Unauthorized />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                    {/* <Route
                      path="/home"
                      element={
                        <PrivateRoute>
                          <Home />
                        </PrivateRoute>
                      }
                    /> */}
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
              </PushProvider>
            </ToastProvider>
          </Router>
        </AnimatePresence>
      </div>
    // </div>
  )
}

export default App
