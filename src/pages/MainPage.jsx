import { AuthInfoContext } from "../context/AuthContextProvider"
import { useContext } from "react"

const MainPage = () => {

    const {LoggedinUser, userLogout} = useContext(AuthInfoContext)

    return (
        <div>
            Welcom {LoggedinUser ? LoggedinUser : "Anonymous User"}
            <br />
            {LoggedinUser && <button className=" bg-red-400"  onClick={userLogout}> LogOut</button>}
        </div>
    )
}


export default MainPage