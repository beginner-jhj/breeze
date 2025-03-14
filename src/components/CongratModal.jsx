import { useEffect, useState, useRef } from "react"
import { store } from "../states/store.js";

export default function CongratModal(){
    const openCongratModal = store(state=>state.openCongratModal);

    const messages = [
        "Congrats!🎉",
        "Well done!👏",
        "You did it!🚀",
        "Way to go!💪",
        "Awesome job!🌟",
        "Fantastic!🎊",
        "Keep it up!🚀",
    ]

    const [randomMessage, setRandomMessage] = useState("");
    const messageBox = useRef();

    const moveMessageBox = ()=>{
        if(messageBox.current){
            messageBox.current.style.top = "20px";
            messageBox.current.style.height = "40px";
        }
    }

    useEffect(()=>{
        const randomIndex = Math.floor(Math.random()*messages.length);
        setRandomMessage(messages[randomIndex]);
        moveMessageBox();
    },[openCongratModal]);
    
    
    return (
        <div style={{display:openCongratModal ? "flex":"none"}} className="w-screen h-screen fixed z-50 bg-opacity-20 bg-black flex justify-center">
            <div ref={messageBox} className="absolute top-0 w-[150px] h-0 transition-all duration-300 bg-white rounded-md flex items-center justify-center overflow-hidden">
                <p className="text-black font-semibold">{randomMessage}</p>
            </div>
        </div>
    )
}