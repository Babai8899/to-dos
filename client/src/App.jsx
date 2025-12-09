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
import ViewTasks from './modules/todos/task/ViewTasks'
import ViewEvents from './modules/todos/event/ViewEvents'
import ViewNotes from './modules/todos/note/ViewNotes'
import ViewLists from './modules/todos/list/ViewLists'
import Register from './modules/Users/Register'
import UpdatePassword from './modules/Users/UpdatePassword'
// import ChatBot from './shared/ChatBot'
import PushProvider from './hooks/PushProvider'
import NotificationProvider from './hooks/NotificationProvider'
import Dummy from './Dummy'
function App() {

  return (
    <div className="noscrollbar min-h-screen w-screen overflow-x-hidden flex flex-col backdrop-blur-sm bg-white/50 dark:bg-black/50 transition-colors duration-100">
      {/* Add pb-20 for mobile, remove on desktop */}
      <div className="grow flex flex-col pb-20 lg:pb-0">
        <AnimatePresence mode='wait'>
          <Router>
            <ToastProvider>
              <PushProvider>
                <AuthProvider>
                  <NotificationProvider>
                    <Navbar />
                  {/* <ChatBot /> */}
                  <Sidebar />
                  <Routes>
                    <Route exact path='/' element={<Welcome />} />
                    <Route exact path='/dummy' element={<Dummy />} />
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
                    <Route
                      path="/tasks"
                      element={
                        <PrivateRoute>
                          <ViewTasks />
                        </PrivateRoute>
                      }
                    />
                    <Route path='/event' element={
                  <PrivateRoute>
                    <CreateEvent />
                  </PrivateRoute>
                } />
                    <Route path='/events' element={
                  <PrivateRoute>
                    <ViewEvents />
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
                    <Route
                      path="/notes"
                      element={
                        <PrivateRoute>
                          <ViewNotes />
                        </PrivateRoute>
                      }
                    />
                    <Route path='/list' element={
                      <PrivateRoute>
                        <CreateList />
                      </PrivateRoute>
                    } />
                    <Route path='/lists' element={
                      <PrivateRoute>
                        <ViewLists />
                      </PrivateRoute>
                    } />
                  </Routes>
                  {/* </Routes> */}
                  </NotificationProvider>
                  <Footer/>
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
