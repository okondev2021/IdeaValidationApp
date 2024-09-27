import { useState, useContext } from "react"
import { AuthInfoContext } from "../context/AuthContextProvider"
import Loader from "./Loader"


const Validator = ({validateIdea, buttonDisabled, isSideBarOpen, errorMessage}) => {

    const {LoggedinUser} = useContext(AuthInfoContext)

    const [idea, setIdea] = useState({
        idea: "",
        targetMarket: ""
    })

    const handleChange = (e) => {
        setIdea({...idea, [e.target.name]: e.target.value})
    }
    
    return (
        <div className="w-full pt-10 px-8 mobile:px-4">
            <h1 className="text-3xl font-semibold text-center w-[60%] mx-auto mobile:text-xl mobile:w-full">Validate Your Idea, Build Your Future!</h1>
            <form onSubmit={validateIdea} method="post" className={`flex flex-col gap-[1.5em] mx-auto mt-[2em] mobile:w-[100%] ${LoggedinUser && isSideBarOpen ? 'w-[60%]' : 'w-[50%]'}`}>
                {errorMessage && 
                    <div className="flex items-center bg-red-200 w-[80%]  px-2 py-4 rounded-lg tab:w-full">
                        {errorMessage}
                    </div>
                }
                <div className="flex flex-col w-full gap-1">
                    <label className="font-semibold text-sm" htmlFor="idea">💡 Describe Your Business Idea</label>
                    <textarea id="idea" className="h-[120px] mobile:h-[140px] border border-grayBlue rounded-md pl-4 pt-2 mobile:text-sm" placeholder="Provide a clear and concise summary of your startup idea." value={idea.idea} name="idea" onChange={handleChange} required></textarea>
                </div>
                <div className="flex flex-col w-full gap-1">
                    <label className="font-semibold text-sm " htmlFor="targetMarket">🎯 Define Your Target Market</label>
                    <input id="targetMarket" className="mobile:text-sm h-[50px] border border-grayBlue rounded-md pl-4" type="text" placeholder="Who are your ideal customers?" name="targetMarket" value={idea.targetMarket} onChange={handleChange} required />
                </div>
                <div className="">
                    <button className="w-full px-4 py-2 mx-auto text-xl font-semibold text-white rounded-md cursor-pointer bg-redbold flex justify-center items-center text-center" type="submit" disabled={buttonDisabled}>
                        {buttonDisabled ? <Loader /> : "Validate"}
                    </button>
                </div>
            </form>
        </div>
    )
    
}

export default Validator