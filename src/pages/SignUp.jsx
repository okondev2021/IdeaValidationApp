import { Link, useNavigate } from "react-router-dom"
import AuthText from "../components/AuthText"

const SignUp = () => {
    const navigate = useNavigate()
    return (
        <section className="flex h-screen">
            <AuthText />
            <div className="className= w-[50%] mobile:w-full p-[3em] tab:p-[2em]">
                <header>
                    <div className=" flex items-center font-semibold gap-2 text-redbold mb-4" onClick={ () => navigate(-1)}>
                        <i class="bi bi-arrow-left text-2xl"></i>
                        <p>Back</p>
                    </div>
                    <h2 className=" font-medium text-5xl text-black001 tab:text-3xl">Create an account</h2>
                    <p className=" mt-2 font-normal text-lg text-grayBlue">Let's get started.</p>
                </header>
                <form className="authForm">
                    <div className="inputContainer">
                        <label className="authLabel" htmlFor="fullName">Full Name:</label>
                        <input className="authInput" id="fullName" type="text"  />
                    </div>
                    <div className="inputContainer">
                        <label className="authLabel" htmlFor="email">Email Address:</label>
                        <input className="authInput" id="email" type="email"  />
                    </div>
                    <div className="inputContainer">
                        <label className="authLabel" htmlFor="password">Password:</label>
                        <input className="authInput" id="password" type="password"  />
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