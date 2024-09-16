import { Routes, Route} from "react-router-dom"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import Main from "./pages/main"
import NoMatch from "./pages/NoMatch"

function App() {

  return (
    <div className="h-screen">
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </div>
  )
}

export default App
