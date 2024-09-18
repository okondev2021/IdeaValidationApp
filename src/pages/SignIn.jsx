import { useState, useContext } from "react"
import { Link } from "react-router-dom"
import { AuthInfoContext } from "../context/AuthContextProvider"
import AuthText from "../components/AuthText"
import AuthHeader from "../components/AuthHeader"

const SignIn = () => {

    const {userLogin} = useContext(AuthInfoContext)

    const [loginInfo, setLoginInfo] = useState({
        email : "",
        password : ""
    })

    const handleChange = (e) => {
        setLoginInfo({...loginInfo, [e.target.name]: e.target.value})
    }
    

    return (
        <section className="flex min-h-full">
            <AuthText />
            <div className="className= w-[50%] mobile:w-full p-[3em] tab:p-[2em]">
                <AuthHeader headingText = "Sign in" paragraphText = "Welcome back, kindly enter your login details" />
                <form className="authForm" onSubmit={userLogin} method="post">
                    <div className="inputContainer">
                        <label className="authLabel" htmlFor="email">Email Address:</label>
                        <input className="authInput" onChange={handleChange} name="email" id="email" type="email" required value={loginInfo.email}  />
                    </div>
                    <div className="inputContainer">
                        <label className="authLabel" htmlFor="password">Password:</label>
                        <input className="authInput" onChange={handleChange} name="password" id="password" type="password" required value={loginInfo.password}  />
                    </div>
                    <div>
                        <input className="authSubmitInput" type="submit" value="Sign in" />
                    </div>
                </form>
                <div className="authFooterContainer">
                    <p className="text-center">Don't have an account? <Link className="authFooterLink" to="/signup">Create a free account</Link></p>
                </div>
            </div>
        </section>
    )
}


export default SignIn