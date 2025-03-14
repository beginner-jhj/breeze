import { useEffect, useRef, useState, forwardRef } from "react";
import {create} from "zustand"
import focus from "../images/focus.svg";
import alarm from "../images/alarm.svg";
import check from "../images/check.svg";
import skip from "../images/skip.svg";
import play from "../images/play.svg";
import pause from "../images/pause.svg";
import dots from "../images/dots.svg";
import edit from "../images/edit-black.svg";
import trashcan from "../images/trashcan.svg";
import alarmSound from "../sounds/alarm.mp3";

import {idGenerator} from "../lib/idGenerator.js";
import { store } from "../states/store.js";

export default function Main(){
    return (
        <main className="w-full px-3 md:p-0 flex items-center justify-center" style={{height:"calc(100vh - 112px)"}}>
            <MainInnerContainer/>
        </main>
    )
}

const pomodoroStore = create((set,get)=>({
    startTimer:false,
    setStartTimer:(value)=>{
        let callBack;
        if(typeof value === 'function'){
            callBack = value;
            const newValue = callBack(get().startTimer);
            set(()=>({startTimer:newValue}));
        }else{
            set(()=>({startTimer:value}));
        }
    },
    skip:false,
    setSkip:(value)=>{
        let callBack;
        if(typeof value === 'function'){
            callBack = value;
            const newValue = callBack(get().skip);
            set(()=>({skip:newValue}))
        }else{
            set(()=>({skip:value}));
        }
    },
    currentTimerType:'focus',
    setCurrentTimerType:(type)=>{
        set(()=>({currentTimerType:type}));
    },
    leftTime:1500,
    setLeftTime:(interverTimerToClear, currentTimerType)=>{
        set(state=>{
            if(state.leftTime<=0 || state.skip){
                clearInterval(interverTimerToClear);
                if(currentTimerType === 'focus'){
                    state.setCurrentTimerType("break");
                }else{
                    state.setCurrentTimerType('focus');
                }
                state.setStartTimer(false);
                state.setSkip(false);
                return currentTimerType === 'focus' ? {leftTime:300}:{leftTime:1500};
            }
            if(currentTimerType === 'focus'){
                const today = `${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,"0")}-${new Date().getDate().toString().padStart(2,"0")}`;
                const storedFocusedTimes = JSON.parse(localStorage.getItem("focusedTimes"));
                storedFocusedTimes[today]+=1;
                localStorage.setItem("focusedTimes",JSON.stringify({...storedFocusedTimes}));
            }
            return {leftTime:state.leftTime - 1};
        })
    }
}))

function MainInnerContainer(){
    const [isOpened, setIsOpened] = useState(false);
    const startTimer = pomodoroStore(state=>state.startTimer);
    const leftTime = pomodoroStore(state=>state.leftTime);
    const setSkip = pomodoroStore(state=>state.setSkip);

    const [ringAlarm, setRingAlarm] = useState(()=>{
        const storedValue = JSON.parse(localStorage.getItem("ringAlarm"));
        if(storedValue !== null){
            return storedValue;
        }
        return true;
    });

    const timer = useRef();
    const tasks = useRef();
    const alarmAudio = useRef();

    useEffect(()=>{
        const adjustTimerHeight = ()=>{
            timer.current.style.height = isOpened ? "100px":"0px";
        }
    
        const moveTasks = ()=>{
            tasks.current.style.translateY = isOpened ?  "translateY(-100px)":"translateY(100px)";
        }

        if(timer && tasks){
            adjustTimerHeight();
            moveTasks();
        }
    },[isOpened]);

    useEffect(()=>{
        if(leftTime<=0 && ringAlarm){
            alarmAudio.current.play();
            setIsOpened(true);
        }
    },[leftTime]);

    useEffect(()=>{
        localStorage.setItem("ringAlarm", ringAlarm);
    },[ringAlarm]);

    const handleSkip = ()=>{
        setSkip(true);
        setIsOpened(true);
    }

    const handleClickAlarm = ()=>{
        setRingAlarm(prev=>!prev);
    }

    return (
        <div className="w-full md:w-2/3 lg:w-1/2 h-full flex flex-col">
            <div className="w-full h-10 flex items-end justify-start relative">
                <img className="h-8 cursor-pointer" src={focus} onClick={()=>{
                    setIsOpened((prev)=>!prev);
                }}></img>
                <span className="font-medium text-white ml-1 cursor-pointer" onClick={()=>{
                    setIsOpened((prev)=>!prev);
                }}>Pomodoro</span>
                <div style={{display:startTimer?"flex":"none"}} className="flex items-end justify-satrt">
                    <span style={{display:isOpened ? "none":"block"}} className="font-semibold text-white ml-4 text-2xl">{String(Math.floor(leftTime/60)).padStart(2,'0')}</span>
                    <span style={{display:isOpened ? "none":"block"}} className="text-white ml-1 text-2xl">:</span>
                    <span style={{display:isOpened ? "none":"block"}} className="font-semibold text-white ml-1 text-2xl">{String(Math.floor(leftTime%60)).padStart(2,'0')}</span>
                    <img id="skipImg" onClick={handleSkip} style={{marginBottom:isOpened ? "3px":"6px"}} className="h-4 ml-1 cursor-pointer" src={skip}></img>
                    <label htmlFor="skipImg" style={{marginBottom:isOpened ? "0":"3px"}} className="text-[16px] text-white font-medium cursor-pointer" onClick={handleSkip}>Skip</label>
                </div>
                <div style={{display:startTimer?"flex":"none"}} className="flex items-end justify-end absolute right-0">
                    <img className="h-6 mr-1" src={alarm}></img>
                    <audio src={alarmSound} ref={alarmAudio}></audio>
                    <div onClick={handleClickAlarm} className="w-4 h-4 mb-1 border-2 border-white rounded-sm cursor-pointer mr-2">
                        <img style={{display:ringAlarm ? "block":"none"}} className="w-4" src={check}></img>
                    </div>
                </div>
            </div>
            <Pomodoro ref={timer}/>
            <Tasks ref={tasks}/>
        </div>
    )
}

const Pomodoro = forwardRef((props,ref)=>{
    const startTimer = pomodoroStore(state=>state.startTimer);
    const setStartTimer = pomodoroStore(state=>state.setStartTimer);
    const currentTimerType = pomodoroStore(state=>state.currentTimerType);
    const setCurrentTimerType = pomodoroStore(state=>state.setCurrentTimerType);
    const leftTime = pomodoroStore(state=>state.leftTime);
    const setLeftTime = pomodoroStore(state=>state.setLeftTime);

    useEffect(() => {
        if(startTimer){
            const timer = setInterval(() => {
                setLeftTime(timer,currentTimerType);
            }, 1000);
    
            return () => clearInterval(timer);
        }
    }, [startTimer, currentTimerType]);

    const handleClickFocus = ()=>{
        if(currentTimerType === 'focus'){
            setStartTimer(prev=>!prev);
            setCurrentTimerType('focus');
        }
    }

    const handleClickBreak = ()=>{
        if(currentTimerType === 'break'){
            setStartTimer(prev=>!prev);
            setCurrentTimerType('break');
        }
    }


    return (
        <div ref={ref} className="h-0 w-full overflow-hidden transition-all duration-700 grid grid-cols-[2fr_1fr] items-center justify-items-center">
            <div className="w-full h-full p-3 flex items-center justify-around">
                <span className="text-6xl text-white font-semibold">{String(Math.floor(leftTime/60)).padStart(2,'0')}</span>
                <span className="font-bold text-2xl text-white">:</span>
                <span className="text-6xl text-white font-semibold">{String(leftTime%60).padStart(2, '0')}</span>
            </div>
            <div className="w-full h-full grid grid-rows-2 items-center justify-items-end">
                <div className="flex items-center justify-end pr-3">
                    <img style={{cursor:currentTimerType === 'focus' ? "pointer":"default"}} className="w-5 cursor-pointer mr-1"  src={startTimer && currentTimerType === 'focus' ? pause:play} onClick={handleClickFocus}></img>
                    <span className="font-medium text-white" onClick={handleClickFocus}>Focus</span>
                </div>
                <div className="flex items-center justify-end pr-3">
                    <img style={{cursor:currentTimerType === "break" ? "pointer":"default"}} className="w-5 mr-1" src={startTimer && currentTimerType === 'break' ? pause:play} onClick={handleClickBreak}></img>
                    <span className="font-medium text-white" onClick={handleClickBreak}>Break</span>
                </div>
            </div>
        </div>
    )
})

const Tasks = forwardRef((props, ref)=>{
    const [task, setTask] = useState(null);
    const [storedTasks, setStoredTasks] = useState(()=>{
        const storedValue = JSON.parse(localStorage.getItem("storedTasks"));
        if(storedValue !== null){
            return storedValue;
        }

        return [];
    })

    const taskInput = useRef();


    const handleEnteringTask = (e)=>{
        if(e.key === 'Enter'){
            const today = `${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,"0")}-${new Date().getDate().toString().padStart(2,"0")}`;
            setTask({content:e.target.value, id:idGenerator(), date:today});
        }
    }

    useEffect(()=>{
        if(task !== null){
            const today = `${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,"0")}-${new Date().getDate().toString().padStart(2,"0")}`;
            setStoredTasks((prev)=>[...prev,task]);
            localStorage.setItem("storedTasks", JSON.stringify([...storedTasks, task]));
            taskInput.current.value = "";
            const todaysTasksCount = JSON.parse(localStorage.getItem("tasksByDate"));
            todaysTasksCount[today]+=1;
            localStorage.setItem("tasksByDate",JSON.stringify({...todaysTasksCount}));
            setTask(null);
        }
    },[task]);

    return (
        <div ref={ref} className="w-full" style={{height:"calc(100% - 100px)"}}>
            <input ref={taskInput} onKeyDown={handleEnteringTask}
            className="w-full h-10 border-b-2 border-white bg-transparent caret-white text-white text-lg placeholder:text-white" placeholder="What are you working on?"></input>
            <div className="w-full h-full flex flex-col items-center py-2 overflow-auto no-scrollbar gap-y-[10px]">
                {storedTasks.map((task, index)=><Task key={index} content={task.content} id={task.id} setStoredTasks={setStoredTasks} storedTasks={storedTasks}/>)}
            </div>
        </div>
    )
})

const Task = ({content,id, storedTasks, setStoredTasks})=>{
    const setOpenCongratModal = store(state=>state.setOpenCongratModal);
    const [showInput, setShowInput] = useState(false);
    const editTaskInput = useRef();

    const [showTooltip, setShowTooltip] = useState(false);
    const [done, setDone] = useState(false);
    
    const toolTip = useRef();

    const adjustTooltipHeight = ()=>{
        if(toolTip.current){
            toolTip.current.style.height = showTooltip ? "80px":"0px";
        }
    }

    useEffect(()=>{
        adjustTooltipHeight();
    }, [showTooltip]);


    useEffect(()=>{
        if(showInput && editTaskInput.current){
            editTaskInput.current.focus();
        }
    },[showInput]);

    const handleSettingDefaultValue = (e)=>{
        e.target.value = storedTasks.filter(task=>task.id === id)[0].content;
    }

    const handleEnteringEditedTask = (e)=>{
        if(e.key === "Enter"){
            const taskToEdit = storedTasks.filter((task)=>task.id === id)[0];
            taskToEdit.content = e.target.value;
            const filteredTasks = storedTasks.filter((task)=>task.id !== id);
            setStoredTasks([...filteredTasks,taskToEdit]);
            localStorage.setItem("storedTasks", JSON.stringify([...filteredTasks,taskToEdit]));
            setShowInput(false);
            setShowTooltip(false);
        }
    }

    const handleDeletingTask = ()=>{
        const filteredTasks = storedTasks.filter((task)=>task.id !== id);
        setStoredTasks([...filteredTasks]);
        localStorage.setItem("storedTasks", JSON.stringify([...filteredTasks]));
    }

    const handleDoneTask = ()=>{
        const storedDoneTasksByDate = JSON.parse(localStorage.getItem("doneTasksByDate")) ;
        const today = `${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,"0")}-${new Date().getDate().toString().padStart(2,"0")}`;

        storedDoneTasksByDate[today] +=1;

        localStorage.setItem("doneTasksByDate", JSON.stringify({...storedDoneTasksByDate}));
        setOpenCongratModal(true);
        setTimeout(()=>{
            setOpenCongratModal(false);
            setDone(false);
        },1000);
    }

    return (
        <div className="w-full h-[30px] flex items-center justify-between relative">
            <div className="flex items-center">
                <div onClick={(e)=>{
                    setDone(true);
                    handleDoneTask(e);
                    setTimeout(handleDeletingTask,1000);
                    }} className="w-4 h-4 border-2 border-white cursor-pointer">
                    <img style={{display:done ? "block":"none"}} className="w-4" src={check}></img>
                </div>
                <p style={{textDecoration:done ? "line-through":"none", display:showInput ? "none":"block"}} className="text-md text-white ml-2 mb-1 font-semibold">{content}</p>
                <input type="text" ref={editTaskInput} style={{display:showInput ? "block":"none"}} className="border-b-2 border-white bg-transparent ml-2 text-white placeholder:text-white" onFocus={handleSettingDefaultValue} onKeyDown={handleEnteringEditedTask}></input>
            </div>
            <img src={dots} className="h-4 mr-1 cursor-pointer" onClick={()=>{
                setShowTooltip(prev=>!prev);
            }}></img>
            <div ref={toolTip} className="absolute w-[110px] h-0 bg-white right-0 top-5 rounded-md shadow-md overflow-hidden transition-all duration-300 grid grid-rows-2">
                <div className="w-full h-full flex items-center justify-between px-2">
                    <img className="w-4 h-4" src={edit}></img>
                    <span className="text-sm cursor-pointer" onClick={()=>{
                        setShowInput(true);
                        }}>Edit</span>
                </div>
                <div className="w-full h-full flex items-center justify-between px-2">
                    <img className="w-4 h-4" src={trashcan}></img>
                    <span onClick={handleDeletingTask} className="text-sm cursor-pointer" >Delete</span>
                </div>
            </div>
        </div>
    )
}