import {Chart, CategoryScale, LinearScale,BarElement, Title, Legend} from "chart.js";
import { useEffect, useRef, useState } from "react";
import {Bar} from "react-chartjs-2";
import { store } from "../states/store.js";

Chart.register(CategoryScale,LinearScale,BarElement, Title, Legend);


export default function DataChartModal(){
    const [tasksCounts, setTasksCounts] = useState([]);
    const [tasksDates, setTasksDates] = useState([]);
    const [doneTasksCounts, setDoneTasksCounts] = useState([]);
    const [concentrationTimes, setConcentrationTimes] = useState([]);
    const [concentrationDates, setConcentrationDates] = useState([]);
    const [currentChart, setCurrentChart] = useState("task");
    const openDataModal = store(state=>state.openDataModal);
    const setOpenDataModal = store(state=>state.setOpenDataModal);
    
    useEffect(()=>{
        const tasksCountByDate = JSON.parse(localStorage.getItem("tasksByDate"))||{};
        const tasksCountEntries = Object.entries(tasksCountByDate);
        const doneTasksByDate = JSON.parse(localStorage.getItem("doneTasksByDate"))||{};
        const doneTasksEntries = Object.entries(doneTasksByDate);
        const focusedTimes = JSON.parse(localStorage.getItem("focusedTimes"))||{};
        const focusedTimesEntries = Object.entries(focusedTimes);
    
        setTasksCounts(tasksCountEntries.map((item)=>item[1]));
        setTasksDates(tasksCountEntries.map((item)=>item[0]));

        setDoneTasksCounts(doneTasksEntries.map((item)=>item[1]));

        setConcentrationTimes(focusedTimesEntries.map((item)=>(item[1]/60).toFixed(2)));
        setConcentrationDates(focusedTimesEntries.map((item)=>item[0]));
    },[]);
    
    return (
        <div onClick={()=>setOpenDataModal(false)} style={{display:openDataModal ? "flex":"none"}} className="fixed z-1 w-full h-full bg-opacity-20 bg-black items-center justify-center">
            <div onClick={(e)=>e.stopPropagation()} className="w-11/12 md:w-[600px] bg-white rounded-md shadow-md flex flex-col items-center p-1">
                {currentChart === "task" ? 
                <Bar options={
                    { responsive:true,
                        plugins:{
                            title:{
                                display:true,
                                text:"Tasks"
                            },
                            legend:{
                                display:true,
                                position:"top"
                            }
                        },
                        scales:{
                            y:{
                                max:Math.max(...tasksCounts),
                                ticks:{
                                    stepSize:1,
                                    callback:(val)=>Number.isInteger(val) ? val:null
                                }
                            }
                        },
                    }
                    } 
                    data={{
                        labels:tasksDates,
                        datasets:[
                            {
                                label:"Set",
                                data:tasksCounts,
                                backgroundColor: "rgba(255, 99, 132, 0.5)",
                            },
                            {
                                label:"Done",
                                data:doneTasksCounts,
                                backgroundColor:"rgba(118, 215, 196,0.5)"
                            }
                        ]
                    }}/>:
                <Bar 
                    options={{
                        responsive:true,
                        plugins:{
                            title:{
                                display:true,
                                text:"Concentration"
                            },
                            legend:{
                                display:false
                            },
                            scales:{
                                y:{
                                    max:Math.max(...concentrationTimes),
                                    ticks:{
                                        stepSize:1,
                                        callback:(val)=>Number.isInteger(val) ? val:null
                                    }
                                }
                            },
                        }
                    }}

                    data={{
                        labels:concentrationDates,
                        datasets:[
                            {
                                label:"Set1",
                                data:concentrationTimes,
                                backgroundColor: "rgba(255, 99, 132, 0.5)",
                            }
                        ]
                    }}
                />
                }
                <div className="w-full flex items-center justify-between">
                    <div className="h-full grid grid-cols-2 items-center justify-items-center gap-x-1">
                        <button onClick={()=>setCurrentChart("task")} style={{backgroundColor:currentChart === "task" ? "rgba(255, 99, 132, 0.5)":"white"}} className="w-full bg-white border-2 border-gray-100 rounded-md cursor-pointer shadow-sm text-center p-1">Tasks</button>
                        <button onClick={()=>setCurrentChart("concentration")} style={{backgroundColor:currentChart === "concentration" ? "rgba(255, 99, 132, 0.5)":"white"}} className="w-full bg-white border-2 border-gray-100 rounded-md cursor-pointer shadow-sm p-1">Concentration</button>
                    </div>
                </div>
            </div>
        </div>
    )
}