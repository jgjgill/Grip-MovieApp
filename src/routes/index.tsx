import Layout from 'components/Layout'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import Bookmark from './bookmark'
import Home from './home'

const App = () => {
  return (
    <RecoilRoot>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route element={<Layout />}>
            <Route path='/' element={<Home />} />
            <Route path='bookmark' element={<Bookmark />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  )
}

export default App
