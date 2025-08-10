import { useContext, useState } from 'react'
import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import {Route ,Routes} from 'react-router-dom'
import Home from './pages/Home'
import ApplyJob from './pages/ApplyJob'
import Applications from './pages/Applications'
import RecuriterLogin from './components/RecuriterLogin'
import { AppContext } from './context/AppContext'
import Dashboard from './pages/Dashboard'
import AddJob from './pages/AddJob'
import ManagesJobs from './pages/ManagesJobs'
import ViewApplications from './pages/ViewApplications'
import 'quill/dist/quill.snow.css'

function App() {
  const {showRecruiterLogin}=useContext(AppContext)

  return (
    <>
{ showRecruiterLogin && <RecuriterLogin/>}
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/apply-job/:id' element ={<ApplyJob/>}/>
        <Route path= '/applications'element={<Applications/>}/>
        <Route path='/dashboard'element ={<Dashboard/>}>
       <Route path='add-job'element={<AddJob/>}/>
       <Route path='manage-jobs' element={<ManagesJobs/>}/>
       <Route path='view-applications' element={<ViewApplications/>}/>
        </Route>
      </Routes>
    </>
  )
}

export default App
