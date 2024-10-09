import { Routes, Route, BrowserRouter as Router} from "react-router-dom"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import MainPage from "./pages/MainPage"
import NoMatch from "./pages/NoMatch"
import AuthContextProvider from "./context/AuthContextProvider"


function App() {
  return (
    <div className="h-screen font-body1">
      <Router>
        <AuthContextProvider>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="signin" element={<SignIn />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="*" element={<NoMatch />} />
          </Routes>
        </AuthContextProvider>
      </Router>
    </div>
  )
}

export default App
