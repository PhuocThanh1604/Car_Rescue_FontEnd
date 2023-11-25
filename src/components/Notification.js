import React,{useState,useEffect} from "react"
import { onMessageListener, requestPermissions } from "../firebase/firebase"
import { ToastContainer ,toast} from "react-toastify"

function Notification() {
    const [notification,setNotification] = useState({title:"",body:""})
    useEffect(()=>{
        requestPermissions()
        const unsubscribe = onMessageListener().then(payload =>{
            setNotification({
                    title: payload?.notification?.title,
                    body: payload?.notification?.body
            })
            toast.success(
                `${payload?.notification?.title} ${payload?.notification?.body}`,
                {
                    duration: 6000,
                    position:"top-right"
                }
            )
        })
        return () => {
            unsubscribe.catch(err=>console.log("Failed",err))
        }
    },[])
    return (
        <div>
            <ToastContainer></ToastContainer>
        </div>
    )
}

export default Notification