import { useState, useEffect, useRef } from "react";
import chart from "../images/chart.svg";
import check from "../images/check.svg";
import picture from "../images/picture.svg";
import { store } from "../states/store.js";
import { getImageList } from "../lib/image.js";

export default function Footer(){
    const pinnedSrc = localStorage.getItem("pinned-src");
    const [pin, setPin] = useState(pinnedSrc ? true:false);
    const [showImageList, setShowImageList] = useState(false);
    const currentBgSrc = store(state=>state.bgSrc);
    const setBgSrc = store(state=>state.setBgSrc);
    const setOpenDataModal = store(state=>state.setOpenDataModal);
    const imageList = getImageList();
    const imageListRef = useRef();


    const adjustImageListStyle = ()=>{
        imageListRef.current.style.height = showImageList ? "210px":"0px";
        imageListRef.current.style.padding = showImageList ? "7px":"0px"
    }

    const selectBgInPerson = (e)=>{
        setBgSrc(e.target.src);
        localStorage.removeItem("pinned-src");
    }
    
    useEffect(()=>{
        if(pin && !pinnedSrc){
            localStorage.setItem("pinned-src", currentBgSrc);
        }
        
        if(!pin){
            localStorage.removeItem("pinned-src");
        }
    },[pin]);

    useEffect(adjustImageListStyle,[showImageList]);

    
    return (
        <div className="w-full h-14 flex items-center justify-between px-3 relative">
            <div ref={imageListRef} className="w-[210px] trnasiton-all duration-200 bg-white absolute left-[30px] gap-[5px] bottom-14 grid grid-cols-3 grid-rows-3 items-center justify-items-center rounded-lg">
                {
                    imageList.map((item,idx)=><img key={idx} src={item.src} onClick={selectBgInPerson} className="w-full h-full hover:border-2 border-sky-100 cursor-pointer"></img>)
                }
            </div>
            <div className="h-full flex items-center justify-between">
                <div className="w-[50px] h-full flex items-center justify-around">
                    <span className="text-white text-lg font-medium">Pin</span>
                    <div onClick={()=>setPin(prev=>!prev)}  className="w-4 h-4 border-2 border-white cursor-pointer rounded-sm">
                        <img style={{display:pin ? "block":"none"}} src={check} className="w-3"></img>
                    </div>
                </div>
                <img src={picture} onClick={()=>setShowImageList(prev=>!prev)} className="w-5 h-5 cursor-pointer"></img>
            </div>
            <img onClick={()=>setOpenDataModal(true)} src={chart} className="h-5 cursor-pointer"></img>
        </div>
    )
}