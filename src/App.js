import React, { useState } from "react";
import "./App.css";
import { Map } from "./components/Map";
import { Reason } from "./components/Reason";
import { Sentence } from "./components/Sentence";
// import { GameKontra } from "./components/GameKontra";
import { Game } from "./components/Game";

export const App = () => {
  const [instructions, setInstructions] = useState("好きな場所を選ぶ。");
  const [reasons, setReasons] = useState([]);
  const [place, setPlace] = useState("This is my favorite place, the ~.");
  const [sentences, setSentences] = useState([]);
  const [changeMap, setChangeMap] = useState(false);
  const [isGuide, setIsGuide] = useState(false);
  const [guide, setGuide] = useState([]);
  const [guideSentence, setGuideSentence] = useState([]);
  const [clearPosition, setClearPosition] = useState(10);
  const [clearGuide, setClearGuide] = useState([
    'Go straight',
    'Turn right',
    'Go straight',
    'Turn left',
    'Go straight',
    'Turn left',
    'Go straight',
    'Turn right',
    'Go straight'
  ]);
  const [clearMoves, setClearMoves] = useState({
    0: { up: 1 },
    1: { right: 2 },
    2: { up: 7 },
    7: { left: 8 },
    8: { up: 10 }
  });

  //Game
  const [direction, setDirection] = useState("up");
  const directions = ['up', 'right', 'down', 'left'];
  const positions = {
    0: { x: 153, y: 375, room: "entrance" },
    1: { x: 153, y: 320 },
    2: { x: 237, y: 320 },
    3: { x: 320, y: 320 },
    4: { x: 320, y: 270, room: "gym" },
    5: { x: 320, y: 370, room: "school nurse's office" },
    6: { x: 320, y: 410, room: "library" },
    7: { x: 237, y:  90 },
    8: { x: 153, y:  90 },
    9: { x: 320, y:  90 },
   10: { x: 153, y:   8, room: "classroom" },
   11: { x: 153, y: 130, room: "English room" },
   12: { x: 320, y:  50, room: "music room" },
   13: { x: 320, y: 130, room: "arts and crafts room" },
   14: { x: 153, y: 175, room: "cooking room" },
   15: { x: 320, y:   8, room: "computer room" },
   16: { x: 320, y: 175, room: "science room" },
  };
  const moves = {
    0: { up: 1 },
    1: { right: 2, down: 0 },
    2: { up: 7, right: 3, left: 1 },
    3: { up: 4, down: 5, left: 2 },
    4: { down: 3 },
    5: { down: 6, up: 3 },
    6: { up: 5 },
    7: { left: 8, right: 9, down: 2 },
    8: { up: 10, down: 11, right: 7 },
    9: { up: 12, down: 13, left: 7 },
    10: { down: 8 },
    11: { down: 14, up: 8 },
    12: { up: 15, down: 9 },
    13: { down: 16, up: 9 },
    14: { up: 11 },
    15: { down: 12 },
    16: { up: 13 },
  };

  const createDropDown = () => {
    const startSelect = document.getElementById("startSelect");
    const endSelect = document.getElementById("endSelect");
    if(!startSelect.lastChild) {
      const optionStart = document.createElement("option");
      optionStart.value = 0;
      optionStart.text = positions[0].room;
      startSelect.appendChild(optionStart);
      for (let i = 0; i < Object.keys(positions).length; i++) {    
        if(positions[i].room){
            const optionEnd = document.createElement("option");
            optionEnd.value = i;
            optionEnd.text = positions[i].room;
            endSelect.appendChild(optionEnd);
        }
      }
    }
  }

  const findPath = (start, end) => {
    const queue = [{ position: start, path: [], dir: 'up' }];
    const visited = new Set();

    while (queue.length > 0) {
        const { position, path, dir } = queue.shift();
      
        if (position === end) return path;

        if (visited.has(`${position}-${dir}`)) continue;
        visited.add(`${position}-${dir}`);

        for (const [moveDir, nextPos] of Object.entries(moves[position] || {})) {
            const nextPath = [...path];
            let currentDir = dir;
            
            // 回転して正しい方向に向く
            while (currentDir !== moveDir) {
                const currentIndex = directions.indexOf(currentDir);
                const targetIndex = directions.indexOf(moveDir);
                if ((currentIndex + 1) % 4 === targetIndex) {
                    nextPath.push("Turn right");
                    currentDir = directions[(currentIndex + 1) % 4];
                } else {
                    nextPath.push("Turn left");
                    currentDir = directions[(currentIndex + 3) % 4];
                }
            }
            nextPath.push("Go straight");
            queue.push({ position: nextPos, path: nextPath, dir: currentDir });
        }
    }
    return null;
  }
  
  const clearMove = (end) => {
    let cPosition = 0;
    let cDir = "up";
    let cMove = {};
    const cGuide = findPath(0, end);
    
    while (cGuide.length > 0) {
      const cGuideSentence = cGuide.shift();
      
      const currentIndex = directions.indexOf(cDir);
      if (cGuideSentence === "Go straight") {
        cMove[cPosition] = {[cDir]: moves[cPosition][cDir]};
        cPosition = moves[cPosition][cDir];
      } else if (cGuideSentence === "Turn right") {
        cDir = directions[(currentIndex + 1) % 4];
      } else if (cGuideSentence === "Turn left") {
        cDir = directions[(currentIndex + 3) % 4];
      }
    }
    setClearMoves(cMove);
    setClearPosition(end);
    setClearGuide(findPath(0, end));
  }

  // 経路表示関数
  function findRoute() {
    const start = parseInt(document.getElementById("startSelect").value);
    const end = parseInt(document.getElementById("endSelect").value);
    // 行きの経路
    const pathToEnd = findPath(start, end);
    setGuide(pathToEnd);
  }

  const onclickChangeMap = () => {
    setInstructions(`${positions[clearPosition].room}まで道案内しましょう。`)
    setChangeMap(true);    
  }
  function speak(text) {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US"; // 英語に設定
    utterance.rate = "0.8";
    window.speechSynthesis.speak(utterance);
  } 
  const sentenceEnVoice = () => {
    const enVoices = document.querySelectorAll(".sentence");
    let enVoicesText = [];
    enVoices.forEach((text) => {
      enVoicesText.push(text.textContent)
    })
    speak(enVoicesText);
  }

  const onclickReset = () => {
    setInstructions("好きな場所を選ぶ。");
    setReasons([]);
    setPlace("This is my favorite place, the ~.");
    setSentences([]);
    setChangeMap(false);
    setIsGuide(false);
    setGuide([]);
    setGuideSentence([]);

    const rooms = document.querySelectorAll("rect");
    rooms.forEach(room => {
      room.classList.remove("eventNone");
    });
  }
  
  return (
    <div className="body">
    <div className="main">
      <div className="main1">
        <div className="map">
        {changeMap ?
          // <GameKontra />
          <Game 
            positions={positions}
            moves={moves} 
            direction={direction} 
            directions={directions} 
            setDirection={setDirection}
            guideSentence={guideSentence}
            setGuideSentence={setGuideSentence}
            createDropDown={createDropDown}
            speak={speak}
            findPath={findPath}
            clearPosition={clearPosition}
            clearGuide={clearGuide}
            clearMoves={clearMoves}
          />
        :
          <Map
            setInstructions={setInstructions}
            setPlace={setPlace}
            setReasons={setReasons}
            setClearPosition={setClearPosition}
            speak={speak}
            clearMove={clearMove}
          />
        }
        </div>
        <div className="option">
          <div className="instructions">
            <p>{instructions}</p>
          </div>
          {changeMap ?
          <>
            <div id="routeControls">
              
                <select id="startSelect"></select>から
                <select id="endSelect"></select>
                <div>
                  <button onClick={findRoute}>経路を表示</button>
                </div>
                
            </div>
            <div id="routeDisplay"></div>
            <div className="boxGuide">
              {guide.map((guide, index) => {
                return (
                  <p key={index} className="guide">{guide}</p>
                );
              })}
            </div>
          </>
          :
          <>
            <Reason 
              reasons={reasons}
              sentences={sentences}
              setSentences={setSentences}
              setIsGuide={setIsGuide}
            />
            {isGuide ?
              <button type="button" onClick={onclickChangeMap} >道案内へ</button>
            :
              <></>
            }
          </>
          }  
        </div>
      </div>

      <div className="main2">
        <Sentence place={place} sentences={sentences} setSentences={setSentences} changeMap={changeMap} guideSentence={guideSentence} />
        <div>
          <img src="./images/volume.png" id="enVoice" className="imgVolume" alt="" onClick={sentenceEnVoice} />
        </div>
        <div>
          <img src="./images/reset.png" className="reset" alt="" onClick={onclickReset}/>
        </div>
      </div>
    </div>
    </div>
  );
};

