import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
const NoMatch = () => {
  const navigate = useNavigate()

  useEffect( () => {
    navigate("/")
  })
  return(
    <div> PAGE NOT FOUND</div>
  )
}


export default NoMatch