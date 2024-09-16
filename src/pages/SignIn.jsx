import { Link } from "react-router-dom"
import AuthText from "../components/AuthText"
const SignIn = () => {
    return (
        <section className="flex h-screen">
            <AuthText />
            <div className="className= w-[50%] relative">
                <section className="p-[3em]">
                    <header>
                        <div className=" flex items-center font-semibold gap-2 text-redbold mb-4">
                            <i class="bi bi-arrow-left text-2xl"></i>
                            <p>Back</p>
                        </div>
                        <h2 className=" font-medium text-5xl text-black001">Sign in</h2>
                        <p className=" mt-2 font-normal text-lg text-grayBlue">Welcome back, kindly enter your login details</p>
                    </header>
                    <form className=" mt-[2em] flex flex-col gap-6 ">
                        <div className="inputContainer">
                            <label className="authLabel" htmlFor="email">Email Address:</label>
                            <input className="authInput" id="email" type="email"  />
                        </div>
                        <div className="inputContainer">
                            <label className="authLabel" htmlFor="password">Password:</label>
                            <input className="authInput" id="password" type="password"  />
                        </div>
                        <div>
                            <input className="authSubmitInput" type="submit" value="Sign in" />
                        </div>
                    </form>
                </ section>
                <div className=" absolute bottom-[2em] w-full flex justify-center items-center">
                    <p className=" text-center">Don't have an account? <Link className=" text-redbold font-semibold" to="/signup">Create a free account</Link></p>
                </div>
            </div>
        </section>
    )
}


export default SignIn