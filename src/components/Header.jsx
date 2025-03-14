import { useEffect, useRef, useState } from "react";
import headset from "../images/headset.svg";
import edit from "../images/edit-black.svg";
import profile from "../images/profile.svg";
import water from "../images/water.svg";
import fire from "../images/fire.svg";
import cafe from "../images/cafe.svg";
import mute from "../images/mute.svg";
import speaker from "../images/speaker.svg";
import play from "../images/play.svg";
import pause from "../images/pause.svg";
import volume from "../images/volume.svg";
import fireSound from "../sounds/fire.mp3";
import waterStreamSound from "../sounds/stream.mp3";
import cafeSound from "../sounds/cafe.mp3";

export default function Header(){
    const [username, setUsername] = useState("");
    const [isStored, setIsStored] = useState(false);
    const [showAudioBox, setShowAudioBox] = useState(false);
    const [expandVolumeRef, setExpandVolumeRef] = useState(false);

    const [playFireNoise, setPlayFireNoise] = useState(false);
    const [playWaterNoise, setPlayWaterNoise] = useState(false);
    const [playCafeNoise, setPlayCafeNoise] = useState(false);
    const [playSelectedNoise, setPlaySelectedNoise] = useState(false);
    const [currentNoiseType, setCurrentNoiseType] = useState("");

    const [selectedNoiseSrc, setSelectedNoiseSrc] = useState("");
    const [videoId, setVideoId] = useState("");
    const [notSupportedLink, setNotSupportedLink] = useState(false);
    const [noiseVolume, setNoiseVolume] = useState(0.5);

    const audioBox = useRef();
    const fireNoiseRef = useRef();
    const waterNoiseRef = useRef();
    const cafeNoiseRef = useRef();
    const selectedNoiseRef = useRef();
    const volumeRef = useRef(); //complete

    const adjustAudioBoxStyle = ()=>{
        if(audioBox.current){
            audioBox.current.style.height = showAudioBox ? "200px":"0px";
            audioBox.current.style.padding = showAudioBox ? "4px":"0px"
        }
    }

    const adjustVolumeRefWidth = ()=>{
        if(volumeRef.current){
            volumeRef.current.style.width = expandVolumeRef ? "70px":"0px";
        }
    }

    useEffect(()=>{
        const storedUsername = localStorage.getItem("username");
        if(storedUsername){
            setIsStored(true);
            setUsername(storedUsername);
        }else{
            setIsStored(false);
            setUsername("");
        }
    },[isStored])

    useEffect(()=>{
        adjustAudioBoxStyle();
    }, [showAudioBox]);

    useEffect(()=>{
        adjustVolumeRefWidth();
    }, [expandVolumeRef]);


    const saveUsername = (e)=>{
        if(e.key === 'Enter' && username.trim() !== ''){
            localStorage.setItem("username", username);
            setIsStored(true);
        }
    }

    useEffect(()=>{
        if(playFireNoise || playWaterNoise || playCafeNoise){
            switch(currentNoiseType){
                case 'fire':
                    setPlayWaterNoise(false);
                    setPlayCafeNoise(false);

                    waterNoiseRef.current.pause();
                    cafeNoiseRef.current.pause();

                    fireNoiseRef.current.play();

                    break
                case 'water':
                    setPlayFireNoise(false);
                    setPlayCafeNoise(false);

                    fireNoiseRef.current.pause();
                    cafeNoiseRef.current.pause();

                    waterNoiseRef.current.play();

                    break
                case 'cafe':
                    setPlayFireNoise(false);
                    setPlayWaterNoise(false);

                    fireNoiseRef.current.pause();
                    waterNoiseRef.current.pause();

                    cafeNoiseRef.current.play();

                    break
            }
        }else{
            if(fireNoiseRef.current && waterNoiseRef.current && cafeNoiseRef.current){
                fireNoiseRef.current.pause();
                waterNoiseRef.current.pause();
                cafeNoiseRef.current.pause();
            }
        }
    },[playFireNoise,playWaterNoise,playCafeNoise]);

    const limitAudioPlay = (audioRef, limit,callBack=()=>{})=>{
        if(audioRef.current.currentTime >= limit){
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            callBack();
        }
    }

    const selectNoise = (fileName) => {
        setShowAudioBox(false);
        setSelectedNoiseSrc(fileName);
        setPlaySelectedNoise(true);
    }

    const getYTvidioId = (e)=>{
        const videoIdMatch = e.target.value.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
        if(videoIdMatch){
            setVideoId(videoIdMatch[1]);
        }
        return;
    }

    const verifyPastedLink = (e)=>{
        if((e.target?.value?.includes("youtube.com") || e.target?.value?.includes("youtu.be")) && e.key === "Enter"){
            setShowAudioBox(false);
            setPlaySelectedNoise(true);
        }else{
            e.target.value = "";
            setNotSupportedLink(true);
            setTimeout(()=>setNotSupportedLink(false),3000);
        }
    }

    useEffect(()=>{
        if(selectedNoiseRef.current){
            selectedNoiseRef.current.volume = noiseVolume;
        }
    }, [noiseVolume]);

    useEffect(()=>{
        if(selectedNoiseRef.current && selectedNoiseSrc !== "" && playSelectedNoise){
            selectedNoiseRef.current.play();
        }else{
            selectedNoiseRef.current.pause();
        }
    },[selectedNoiseSrc, playSelectedNoise])

    return (
        <header className="w-full h-14 flex items-center justify-between px-2 relative">
            <div className="w-[45%] md:w-[200px] flex items-center justify-between">
                <img onClick={()=>{setShowAudioBox(prev=>!prev)}} src={headset} className="w-9 cursor-pointer"></img>
                <div className="w-full h-full relative flex items-center justify-start">
                    <div className="wave-container">
                        <div className="bar" style={{animationPlayState:playSelectedNoise ? "running":"paused"}}></div>
                        <div className="bar" style={{animationPlayState:playSelectedNoise ? "running":"paused"}}></div>
                        <div className="bar" style={{animationPlayState:playSelectedNoise ? "running":"paused"}}></div>
                        <div className="bar" style={{animationPlayState:playSelectedNoise ? "running":"paused"}}></div>
                        <div className="bar" style={{animationPlayState:playSelectedNoise ? "running":"paused"}}></div>
                        <div className="bar" style={{animationPlayState:playSelectedNoise ? "running":"paused"}}></div>
                        <div className="bar" style={{animationPlayState:playSelectedNoise ? "running":"paused"}}></div>
                        <div className="bar" style={{animationPlayState:playSelectedNoise ? "running":"paused"}}></div>
                    </div>
                    <div className="flex items-center">
                        <img src={playSelectedNoise ? pause:play} onClick={()=>{
                            if(selectedNoiseSrc || videoId){
                                setPlaySelectedNoise(prev=>!prev)
                            }
                        }} 
                        style={{cursor:selectedNoiseSrc ? "pointer":"default"}}    className="w-5 h-5 ml-2"></img>
                        <img src={volume} className="w-5 h-5 cursor-pointer ml-1" onClick={()=>setExpandVolumeRef(prev=>!prev)}></img>
                        <input ref={volumeRef} type="range" min={0} max={100} defaultValue={noiseVolume*100} 
                        style={{overflow: expandVolumeRef ? "visible":"hidden" }} className="sound-range-input"
                        onChange={(e)=>setNoiseVolume((e.target.value)/100)}
                        ></input>
                    </div>
                    <YoutubeAudioPlayer videoId={videoId} play={playSelectedNoise} volume={noiseVolume}/>
                    <audio ref={selectedNoiseRef} src={`../sounds/${selectedNoiseSrc}.mp3`} onTimeUpdate={
                        ()=>{
                            limitAudioPlay(selectedNoiseRef,1500);
                        }}></audio>
                </div>
            </div>
            <div ref={audioBox} className="absolute left-2 top-14 trnasiton-all duration-300 w-[170px] h-0 bg-white rounded-md overflow-hidden grid grid-rows-4 items-center z-10">
                <div className="w-full h-full flex items-center justify-between pr-2 hover:bg-[rgba(0,0,0,0.1)]">
                    <div className="w-[36%] flex items-center justify-around">
                        <img src={fire} className="w-5 h-5"></img>
                        <span className="text-sm font-semibold cursor-pointer" 
                        onClick={()=>selectNoise("fire")}
                        >Fire</span>
                    </div>
                    <img src={playFireNoise ? speaker:mute} className="w-4 h-4 cursor-pointer" 
                    onClick={()=>{
                        setPlayFireNoise(prev=>!prev);
                        setCurrentNoiseType('fire');
                        }} ></img>
                    <audio src={fireSound} ref={fireNoiseRef} 
                    onTimeUpdate={()=>limitAudioPlay(fireNoiseRef,60,()=>setPlayFireNoise(false))}></audio>
                </div>
                <div className="w-full h-full flex items-center justify-between pr-2 hover:bg-[rgba(0,0,0,0.1)]">
                    <div className="w-[40%] flex items-center justify-around">
                        <img src={water} className="w-7 h-7"></img>
                        <span className="text-sm font-semibold cursor-pointer"
                        onClick={()=>selectNoise("stream")}
                        >Water</span>
                    </div>
                    <img src={playWaterNoise ? speaker:mute} className="w-4 h-4 cursor-pointer" 
                    onClick={()=>{
                        setPlayWaterNoise(prev=>!prev);
                        setCurrentNoiseType('water');
                        }}></img>
                    <audio src={waterStreamSound} ref={waterNoiseRef} 
                    onTimeUpdate={()=>limitAudioPlay(waterNoiseRef,60, ()=>setPlayWaterNoise(false))}></audio>
                </div>
                <div className="w-full h-full flex items-center justify-between pr-2 hover:bg-[rgba(0,0,0,0.1)]">
                    <div className="w-[40%] flex items-center justify-around pl-1">
                        <img src={cafe} className="w-5 h-5"></img>
                        <span className="text-sm font-semibold ml-1 cursor-pointer"
                        onClick={()=>selectNoise("cafe")}
                        >Cafe</span>
                    </div>
                    <img src={playCafeNoise ? speaker:mute} className="w-4 h-4 cursor-pointer" 
                    onClick={()=>{
                        setPlayCafeNoise(prev=>!prev);
                        setCurrentNoiseType('cafe');
                        }}></img>
                    <audio src={cafeSound} ref={cafeNoiseRef} 
                    onTimeUpdate={()=>limitAudioPlay(cafeNoiseRef,60, ()=>setPlayCafeNoise(false))}></audio>
                </div>
                <div className="w-full h-full flex items-center justify-center">
                    <input className={`w-[90%] border-b-2 border-slate-500 ${notSupportedLink ? "placeholder-red-300":"placeholder-slate-500"}`} placeholder={notSupportedLink ? "Not supported link":"Youtube link"} onKeyDown={verifyPastedLink} onChange={getYTvidioId}></input>
                </div>
            </div>
            {isStored ? <Greeting username={username} setIsStored={setIsStored}/>:<input className="w-1/3 h-8 bg-transparent border-b-2 border-white caret-white text-white placeholder:text-white" placeholder="What is your name?" onChange={(e)=>setUsername(e.target.value)} onKeyDown={saveUsername}></input>}
        </header>
    )
}

function YoutubeAudioPlayer({videoId, play, volume}){
    const playerRef = useRef(null);
    const iframeRef = useRef(null);
    const [isReady, setIsReady] = useState(false);
    
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        document.body.appendChild(script);
        
        window.onYouTubeIframeAPIReady = () => {
            playerRef.current = new window.YT.Player(iframeRef.current, {
                events: {
                    onReady: (event) => {
                        setIsReady(true);
                        event.target.playVideo();
                        event.target.unMute(); 
                        event.target.setVolume(100);
                    }
                }
        });
        };
        
        return () => {
            delete window.onYouTubeIframeAPIReady;
        };
    }, [videoId]);

    useEffect(()=>{
        if(playerRef.current && isReady){
            if (play) {
                playerRef.current.playVideo();
                playerRef.current.unMute();
            } else {
                playerRef.current.pauseVideo();
            }
        }
    }, [play]);

    useEffect(()=>{
        if(playerRef.current && isReady){
            playerRef.current.setVolume(volume*100);
        }
    },[volume]);

    return (
        <iframe ref={iframeRef} allow="autoplay" id="youtubeAudioPlayer" style={{opacity:"1", width:"1px", height:"1px"}} src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}></iframe>
    )
}

function Greeting({username, setIsStored}){
    const currentTime = `${new Date().getHours().toString().padStart(2,"0")}:${new Date().getMinutes().toString().padStart(2,"0")}`;
    const today = `${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,"0")}-${new Date().getDate().toString().padStart(2,"0")}`
    const todaysFocusedTimes = (JSON.parse(localStorage.getItem("focusedTimes"))[today]/60).toFixed(1);
    const [showUserProfile, setShowUserProfile] = useState(false);
    const [todaysTasks, setTodaysTasks] = useState(0);
    const [todaysDoneTasks, setTodaysDoneTasks] = useState(0);
    const userProfileRef = useRef();

    const adjustUserProfileStyle = ()=>{
        userProfileRef.current.style.height = showUserProfile ? "100px":"0px";
        userProfileRef.current.style.padding = showUserProfile ? "4px":"0px";
    }

    useEffect(adjustUserProfileStyle,[showUserProfile]);

    useEffect(()=>{
        const storedTasks = JSON.parse(localStorage.getItem("tasksByDate"));
        const storedDoneTasks = JSON.parse(localStorage.getItem("doneTasksByDate"));
        
        if(storedDoneTasks && storedTasks){
            setTodaysTasks(storedTasks[today]);
            setTodaysDoneTasks(storedDoneTasks[today]);
        }
    },[]);


    return (
        <div className="h-8 flex items-center justify-end relative">
            <img src={profile} className="w-7 h-7 cursor-pointer" onClick={()=>setShowUserProfile(prev=>!prev)}></img>
            <div ref={userProfileRef} className="w-[150px] transition-all delay-200 absolute top-10 bg-white rounded-md z-50 flex flex-col items-start overflow-hidden">
                <div className="w-full flex items-center relative">
                    <p className="font-semibold">{`Hi ${username}`}</p>
                    <img className="w-4 h-4 cursor-pointer ml-1" src={edit} onClick={()=>{
                    localStorage.removeItem("username");
                    setIsStored(false);
                    }}></img>
                    <p className="font-semibold absolute right-0">{currentTime}</p>
                </div>
                <div className="w-full flex items-center justify-between">
                    <p className="text-md">Today</p>
                    <p className="text-sm">({today})</p>
                </div>
                <p className="text-sm text-slate-500">Done: 
                    (<span className="text-green-500">{todaysDoneTasks}</span>/{todaysTasks})
                </p>
                <p className="text-sm text-slate-500">Focused: <span className="text-green-500">{todaysFocusedTimes}</span> min</p>
            </div>
        </div>
    )
}