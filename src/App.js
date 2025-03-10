import React, { useState, useEffect } from "react";
import "./App.css";
import { Map } from "./components/Map";
import { Reason } from "./components/Reason";
import { Sentence } from "./components/Sentence";
import { Game } from "./components/Game";
import { applyFontFace } from './utils/fontLoader'; // フォント読込み処理を指定

export const App = () => {
  const [instruction, setInstruction] = useState("好きな場所を選びましょう。");
  const [reasons, setReasons] = useState([]);
  const [place, setPlace] = useState("This is my favorite place, the .");
  const [sentences, setSentences] = useState([]);
  const [changeMap, setChangeMap] = useState(false);
  const [isGuide, setIsGuide] = useState(false);
  const [guide, setGuide] = useState([]);
  const [guideSentence, setGuideSentence] = useState([]);
  const [backGuideSentence, setBackGuideSentence] = useState([]);
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
  const [backClearGuide, setBackClearGuide] = useState([
    'Turn left',
    'Turn left',
    'Go straight',
    'Turn left',
    'Go straight',
    'Turn right',
    'Go straight',
    'Turn right',
    'Go straight',
    'Turn left',
    'Go straight'
  ]);
  const [backClearMoves, setBackClearMoves] = useState({
    1: {down: 0},
    2: {left: 1},
    7: {down: 2},
    8: {right: 7},
    10:{down: 8}
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
    7: { x: 237, y:  93 },
    8: { x: 153, y:  93 },
    9: { x: 320, y:  93 },
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

  const findPath = (start, end, dir) => {
    const queue = [{ position: start, path: [], dir: dir }];
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
    const cGuide = findPath(0, end, cDir);
    setClearGuide(findPath(0, end, cDir));
    
    while (cGuide.length > 0) {
      const GuideSentence = cGuide.shift();
      
      const currentIndex = directions.indexOf(cDir);
      if (GuideSentence === "Go straight") {
        cMove[cPosition] = {[cDir]: moves[cPosition][cDir]};
        cPosition = moves[cPosition][cDir];
      } else if (GuideSentence === "Turn right") {
        cDir = directions[(currentIndex + 1) % 4];
      } else if (GuideSentence === "Turn left") {
        cDir = directions[(currentIndex + 3) % 4];
      }
    }

    let cbPosition = cPosition;
    let cbMove = {};
    const cbGuide = findPath(end, 0, cDir);
    setBackClearGuide(findPath(end, 0, cDir));

    while (cbGuide.length > 0) {
      const GuideSentence = cbGuide.shift();
      
      const currentIndex = directions.indexOf(cDir);
      if (GuideSentence === "Go straight") {
        cbMove[cbPosition] = {[cDir]: moves[cbPosition][cDir]};
        cbPosition = moves[cbPosition][cDir];
      } else if (GuideSentence === "Turn right") {
        cDir = directions[(currentIndex + 1) % 4];
      } else if (GuideSentence === "Turn left") {
        cDir = directions[(currentIndex + 3) % 4];
      }
    }
    setClearPosition(end);
    setClearMoves(cMove);
    setBackClearMoves(cbMove);
  }
  
  // 経路表示関数
  const findRoute = () => {
    const start = 0;
    const end = clearPosition;
    // 行きの経路
    const pathToEnd = findPath(start, end, "up");
    setGuide(pathToEnd);
  }
  const findBackRoute = () => {
    const start = 0;
    const end = clearPosition;
    let dir = "up";
    if (end === 5 || end === 6 || end === 11 || end === 13 || end === 14 || end === 16) {
      dir = "down";
    }
    const pathToEnd = findPath(end, start, dir);
    setGuide(pathToEnd);
  }

  const onclickChangeMap = () => {
    setInstruction(`${positions[clearPosition].room}まで道案内しましょう。`);
    setChangeMap(true);
    findRoute();
  }
  const speak = (text) => {
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
    setInstruction("好きな場所を選ぶ。");
    setReasons([]);
    setPlace("This is my favorite place, the .");
    setSentences([]);
    setChangeMap(false);
    setIsGuide(false);
    setGuide([]);
    setGuideSentence([]);
    setBackGuideSentence([]);

    const rooms = document.querySelectorAll("rect");
    rooms.forEach(room => {
      room.classList.remove("eventNone");
    });
    setDirection("up");
    const btns = document.getElementsByClassName("direction-btn");
    Array.from(btns).forEach(btn=> {
        btn.classList.remove("eventNone");
    });
    if(changeMap) {
      document.getElementById("goRouteButton").classList.add("currentRouteButton");
      document.getElementById("backRouteButton").classList.remove("currentRouteButton");
    }
  }
  
  useEffect(() => { // 初回（空指定[]）のuseEffect内でフォント適用を実行
    const cleanup = applyFontFace(); // フォントを適用し、クリーンアップ関数を取得

    return () => {
      cleanup(); // アンマウント時にクリーンアップ実行
    };
  }, []);

  return (
    <div className="body">
    <div className="main">
      <div className="main1">
        <div className="map">
        {changeMap ?
          <Game 
            positions={positions}
            moves={moves} 
            direction={direction} 
            directions={directions} 
            setDirection={setDirection}
            guideSentence={guideSentence}
            backGuideSentence={backGuideSentence}
            setGuideSentence={setGuideSentence}
            setBackGuideSentence={setBackGuideSentence}
            setInstruction={setInstruction}
            speak={speak}
            findRoute={findRoute}
            findBackRoute={findBackRoute}
            clearPosition={clearPosition}
            clearGuide={clearGuide}
            clearMoves={clearMoves}
            backClearGuide={backClearGuide}
            backClearMoves={backClearMoves}
          />
        :
          <Map
            setInstruction={setInstruction}
            setPlace={setPlace}
            setReasons={setReasons}
            setClearPosition={setClearPosition}
            speak={speak}
            clearMove={clearMove}
          />
        }
        </div>
        <div className="option">
          <div className="instruction">
            <p>{instruction}</p>
          </div>
          {changeMap ?
          <>
            <div id="routeControls">
                <p>{positions[0].room} から {positions[clearPosition].room}</p>
                <div>
                  <button id="goRouteButton" className="routeButton eventNone currentRouteButton">行き</button>
                  <button id="backRouteButton" className="routeButton eventNone">帰り</button>
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
              <button className="change-btn" type="button" onClick={onclickChangeMap} >道案内へ→</button>
            :
              <></>
            }
          </>
          }  
        </div>
      </div>

      <div className="main2">
        <Sentence
          place={place}
          sentences={sentences}
          setSentences={setSentences}
          changeMap={changeMap}
          guideSentence={guideSentence}
          backGuideSentence={backGuideSentence}
        />
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

