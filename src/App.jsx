import { 
  MdRefresh,
  MdWork,
  MdSettings,
  MdClose,
  MdPause,
  MdPlayArrow,
} from 'react-icons/md';
import { AiTwotoneRest } from 'react-icons/ai';
import { useState, useEffect } from 'react';
import './App.css';

const ShowTime = ( {time} ) => {
  const minute = Math.floor(time / 60);
  const second = time % 60;

  return (
    <span className="timer">
      {minute < 10 ? '0'+minute : minute} : {second < 10 ? '0'+second : second}
    </span>
  )
}

const modes = {
  work: 0,
  rest: 1,
  setting: 2
}

export default function App() {
  // 3000s = 50mins for work, 600s = 10min for break
  const [ workTime, setWorkTime ] = useState(3000);
  const [ restTime, setRestTime ] = useState(600);
  const [ timer, setTimer ] = useState(workTime);
  const [ mode, setMode ] = useState(modes.work);
  const [ paused, setPaused ] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!paused && mode != modes.setting) {
        setTimer(t => t-1);
      }
    }, 1000);

    if ( timer < 0 ) {
      if (mode === modes.work) {
        setMode(modes.rest);
        setTimer(restTime);
      } else {
        setMode(modes.work);
        setTimer(workTime);
      }
    }

    return () => clearInterval(interval);
  }, [paused, timer]);

  const timerSection = (
    <div className={"main "+(mode===modes.work?'work':'rest')}>
      <div className="btnContainer">
        <MdRefresh 
          className="btn" 
          onClick={()=>{
            mode === modes.work ? setTimer(workTime) : setTimer(restTime);
          }}
        />
        {paused ? 
        <MdPlayArrow
          className="btn" 
          onClick={()=>{
            setPaused(false);
          }}
        /> :
        <MdPause 
          className="btn" 
          onClick={()=>{
            setPaused(true);
          }}
        />}
        <MdSettings 
          className="btn"
          onClick={()=>setMode(modes.setting)}
        />
      </div>
      <ShowTime time={timer} />
      {mode === modes.rest 
        ?<MdWork 
            className="btn" 
            onClick={()=>{
              setMode(modes.work);
              setTimer(workTime);
        }}/> 
        :<AiTwotoneRest 
            className="btn" 
            onClick={()=>{
              setMode(modes.rest)
              setTimer(restTime);
        }}/> 
      }
    </div>
  )

  const settingSection= (
    <div className={"main settingMain "+(mode===modes.setting?'show':'')}>
      <div className="btnContainer">
        <MdRefresh
          className="stBtn" 
          onClick={()=>{
            let workInput = document.getElementById('workTimeInput');
            let restInput = document.getElementById('restTimeInput');
            workInput.value = "50";
            restInput.value = "10";
            setWorkTime(50*60);
            setRestTime(10*60);
          }}
        />
      </div>
      <div className="textContainer">
          <div className="textLine">
          <span className="text">work:</span>
          <input
            id="workTimeInput"
            type="text" 
            pattern="\d*"
            maxLength="2"
            placeholder={workTime/60}
            className="inText text"   
            onChange={(e)=>setWorkTime(e.target.value*60)}
          />
          <span className="text">mins</span>
        </div>
        <div className="textLine">
          <span className="text">rest:</span>
          <input 
            id="restTimeInput"
            type="text" 
            pattern="\d*"
            maxLength="2"
            placeholder={restTime/60}
            className="inText text"   
            onChange={(e)=>setRestTime(e.target.value*60)}
          />
          <span className="text">mins</span>
        </div>
      </div>
      <MdClose 
        className="stBtn" 
        onClick={()=>{
          setMode(modes.work);
          setTimer(workTime);
        }}
      />
    </div>
  )

  return (
    <>
      {timerSection}
      {settingSection}
    </>
  );
}
