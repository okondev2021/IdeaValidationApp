import { useState, useContext,} from "react"
import { AuthInfoContext } from "../context/AuthContextProvider"
import { Link } from "react-router-dom"
import AuthText from "../components/AuthText"
import AuthHeader from "../components/AuthHeader"

const SignUp = () => {

    const {userRegistration} = useContext(AuthInfoContext)

    const [signUpInfo, setSignUpInfo] = useState({
        full_name: "",
        email: "",
        password: ""

    })
    const handleChange = (e) => {
        setSignUpInfo({...signUpInfo, [e.target.name]: e.target.value})
    }
    return (
        <section className="flex min-h-full">
            <AuthText />
            <div className="className= w-[50%] mobile:w-full p-[3em] tab:p-[2em]">
                <AuthHeader headingText = "Create an account" paragraphText = "Let's get started." />
                <form className="authForm" onSubmit={userRegistration}>
                    <div className="inputContainer">
                        <label className="authLabel" htmlFor="fullName">Full Name:</label>
                        <input className="authInput" onChange={handleChange} id="fullName" type="text" name="full_name" required  />
                    </div>
                    <div className="inputContainer">
                        <label className="authLabel" htmlFor="email">Email Address:</label>
                        <input className="authInput" onChange={handleChange} id="email" type="email" name="email" required />
                    </div>
                    <div className="inputContainer">
                        <label className="authLabel" htmlFor="password">Password:</label>
                        <input className="authInput" onChange={handleChange} id="password" type="password" name="password" required />
                    </div>
                    <div>
                        <input className="authSubmitInput" type="submit" value="Create an account" />
                    </div>
                </form>
                <div className="authFooterContainer">
                    <p className="text-center">Already have an account? <Link className="authFooterLink" to="/signin">Sign in</Link></p>
                </div>
            </div>
        </section>
    )
}


export default SignUp