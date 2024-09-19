import { useContext, useRef } from "react"
import { jwtDecode } from "jwt-decode";
import { AuthInfoContext } from "../context/AuthContextProvider"

const MainPage = () => {

    const {LoggedinUser, userLogout, setLoggedInUser, setAuthDataObject} = useContext(AuthInfoContext)

    const isAuthTokenPresent = useRef(JSON.parse(localStorage.getItem("AuthToken")));

    if (isAuthTokenPresent.current){
      const decodedToken = jwtDecode(isAuthTokenPresent.current?.refresh)
      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime > decodedToken.exp){
        // reset everything since this user is no longer authenticated (refresh token has expired)
        localStorage.removeItem("AuthToken")
        setLoggedInUser(null)
        setAuthDataObject(null)
      }
    }

    return (
        <div>
            Welcom {LoggedinUser ? LoggedinUser : "Anonymous User"}
            <br />
            {LoggedinUser && <button className=" bg-red-400"  onClick={userLogout}> LogOut</button>}
        </div>
    )
}


export default MainPage