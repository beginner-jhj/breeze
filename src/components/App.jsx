import { getRandomImage } from "../lib/image.js"
import Header from "./Header.jsx"
import Main from "./Main.jsx"
import CongratModal from "./CongratModal.jsx"
import DataChartModal from "./DataModal.jsx"
import Footer from "./Footer.jsx"
import { useEffect, useState } from "react"
import { store } from "../states/store.js"

function App() {
  const randomImageObject = getRandomImage();
  const setBgSrc = store(state=>state.setBgSrc);
  const bgSrc = store(state=>state.bgSrc);
  const pinnedSrc = localStorage.getItem("pinned-src");
  const [currentBgSrc, setCurrentBgSrc] = useState();

  useEffect(()=>{
    if(!localStorage.getItem("focusedTimes")){
      localStorage.setItem("focusedTimes",JSON.stringify([]));
    }

    if(!localStorage.getItem("tasksByDate")){
      localStorage.setItem("tasksByDate", JSON.stringify({}));
    }
  },[]);

  useEffect(()=>{
    const storedFocusedTimes = JSON.parse(localStorage.getItem("focusedTimes"))||{};
    const storedFocusedTimesDateKeys = Object.keys(storedFocusedTimes);
    
    const storedTasksByDate = JSON.parse(localStorage.getItem("tasksByDate"))||{};
    const storedTasksByDateKeys = Object.keys(storedTasksByDate)
    
    const storedDoneTasksByDate = JSON.parse(localStorage.getItem("doneTasksByDate"))||{};
    const storedDoneTasksByDateKeys = Object.keys(storedDoneTasksByDate);
    
    const today = `${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,"0")}-${new Date().getDate().toString().padStart(2,"0")}`;
    
    if(storedFocusedTimesDateKeys[storedFocusedTimesDateKeys.length - 1] !== today){
      storedFocusedTimes[today] = 0;
      localStorage.setItem("focusedTimes", JSON.stringify({...storedFocusedTimes}));
    }


    if(storedTasksByDateKeys[storedTasksByDateKeys.length - 1] !== today){
      storedTasksByDate[today] = 0;
      localStorage.setItem("tasksByDate", JSON.stringify({...storedTasksByDate}));
    }

    if(storedDoneTasksByDateKeys[storedDoneTasksByDateKeys.length - 1] !== today){
      storedDoneTasksByDate[today] = 0;
      localStorage.setItem("doneTasksByDate", JSON.stringify({...storedDoneTasksByDate}));
    }

  },[])

  useEffect(()=>{
    setBgSrc(randomImageObject.src);
  },[]);

  useEffect(()=>{
    if(pinnedSrc){
      setCurrentBgSrc(pinnedSrc);
    }else if(!pinnedSrc && bgSrc){
      setCurrentBgSrc(bgSrc);
      localStorage.setItem("pinned-src", bgSrc);
    }else{
      setCurrentBgSrc(randomImageObject.src);
    }
  }, [bgSrc])

  return (
    <div className="w-full h-screen bg-cover bg-center bg-no-repeat" 
    style={{backgroundImage:`url(${currentBgSrc})`}}>
      <CongratModal/>
      <DataChartModal/>
      <Header/>
      <Main/>
      <Footer/>
    </div>
  )
}

export default App
