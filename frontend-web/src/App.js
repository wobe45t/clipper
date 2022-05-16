import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Login, Export, Upload } from './screens'
import { Header, Footer } from './components'
import './App.style.css'

import { useRecoilState } from 'recoil'
import { userAtom } from './state'

const App = () => {
  const [user, setUser] = useRecoilState(userAtom)

  return (
    <BrowserRouter>
      <div className='container'>
        <Header />
        <div className='main'>
          <div style={{ width: '80%' }}>
            <Routes>
              <Route exact path='/' element={<Login />} />
              <Route path='/export' element={<Export />} />
              <Route path='/upload' element={<Upload />} />
            </Routes>
          </div>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
