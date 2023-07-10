
import 'bootstrap/dist/css/bootstrap.css'
import NavBar from "./components/NavBar"
import {Route, Routes} from "react-router-dom"
import Faq from "./pages/Faq"
import HelpArticle from "./pages/HelpArticle"

function App() {
  return (
    <div>
      <NavBar/>
      <div className="">
        <Routes>
          <Route path="/" element={<Faq/>}/>
          <Route path="/faq" element={<Faq/>}/>
          <Route path="/helpArticle" element={<HelpArticle/>}/>
        </Routes>
      </div>
    </div>
  )
}

export default App
