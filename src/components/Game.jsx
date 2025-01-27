import React, { useState, useEffect, useRef } from "react";

export const Game = (props) => {
    const canvasRef = useRef(null);
    const request = useRef();

    const {
        moves, 
        direction, 
        setDirection, 
        directions, 
        positions, 
        guideSentence,
        backGuideSentence, 
        setGuideSentence,
        setBackGuideSentence,
        createDropDown, 
        speak,
        clearPosition, 
        clearGuide, 
        clearMoves, 
        backClearGuide, 
        backClearMoves
    } = props;

    const [positionNumber, setPositionNumber] = useState(0);
    const [position, setPosition] = useState(positions[positionNumber]);
    const [currentPosition, setCurrentPosition] = useState(positions[positionNumber]);
    const [clearStep, setClearStep] = useState(0);
    const [isBack, setIsBack] = useState(false);

    const mapImage = new Image();
    mapImage.src = "./images/map.jpg"
    const playerImage = new Image();
    playerImage.src = "./images/RyutaOthers.png";

    const arrowUpImage = new Image();
    arrowUpImage.src = "./images/arrowUp.png";
    const arrowRightImage = new Image();
    arrowRightImage.src = "./images/arrowRight.png";
    const arrowDownImage = new Image();
    arrowDownImage.src = "./images/arrowDown.png";
    const arrowLeftImage = new Image();
    arrowLeftImage.src = "./images/arrowLeft.png";

    const correctAudio = new Audio("correct.mp3");
    const incorrectAudio =new Audio("incorrect.mp3");

    //canvas内処理
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        
        const arrowDirection = (d) => {
            if (d === "up") {
                ctx.drawImage(arrowUpImage, currentPosition.x+12.5, currentPosition.y-26, 25, 25);
            } else if (d === "right") {
                ctx.drawImage(arrowRightImage, currentPosition.x+51, currentPosition.y+28, 25, 25);
            } else if (d === "down") {
                ctx.drawImage(arrowDownImage, currentPosition.x+12.5, currentPosition.y+51, 25, 25);
            } else if (d === "left") {
                ctx.drawImage(arrowLeftImage, currentPosition.x-26, currentPosition.y+28, 25, 25);
            }
        }
        const drawArrow = () => {
            if ( (clearGuide[clearStep] === "Go straight" && !isBack) || (backClearGuide[clearStep] === "Go straight" && isBack) ) {
                arrowDirection(direction);
            } else if ( (clearGuide[clearStep] === "Turn left" && !isBack) || (backClearGuide[clearStep] === "Turn left" && isBack) ) {
                const currentIndex = directions.indexOf(direction);
                let newDirection = directions[(currentIndex + 3) % 4];

                if (backClearGuide[clearStep+1] === "Turn left" && isBack) {
                    newDirection = directions[(currentIndex + 2) % 4];
                    arrowDirection(newDirection);
                } else {
                    arrowDirection(newDirection);
                }
                arrowDirection(newDirection);
            } else if ( (clearGuide[clearStep] === "Turn right" && !isBack) || (backClearGuide[clearStep] === "Turn right" && isBack) ) {
                const currentIndex = directions.indexOf(direction);
                const newDirection = directions[(currentIndex + 1) % 4];
                arrowDirection(newDirection);
            }
        }
        //初期描画
        mapImage.onload = function() {
            ctx.drawImage(mapImage, 0, 0);
        }
        playerImage.onload = function() {
            if (direction === "up") {
                ctx.drawImage(playerImage, 128, 128, 128, 128, currentPosition.x, currentPosition.y, 50, 50);
            } else if (direction === "right") {
                ctx.drawImage(playerImage, 128*4, 128*2, 128, 128, currentPosition.x, currentPosition.y, 50, 50);
            } else if (direction === "down") {
                ctx.drawImage(playerImage, 0, 0, 128, 128, currentPosition.x, currentPosition.y, 50, 50);
            } else if (direction === "left") {
                ctx.drawImage(playerImage, 0, 128*2, 128, 128, currentPosition.x, currentPosition.y, 50, 50);
            }
            drawArrow();
        }
        //関数
        createDropDown();
        const drawMap = () => {
            ctx.drawImage(mapImage, 0, 0);
        }
        const drawPlayer = () => {
            if (direction === "up") {
                ctx.drawImage(playerImage, 128, 128, 128, 128, currentPosition.x, currentPosition.y, 50, 50);
            } else if (direction === "right") {
                ctx.drawImage(playerImage, 128*4, 128*2, 128, 128, currentPosition.x, currentPosition.y, 50, 50);
            } else if (direction === "down") {
                ctx.drawImage(playerImage, 0, 0, 128, 128, currentPosition.x, currentPosition.y, 50, 50);
            } else if (direction === "left") {
                ctx.drawImage(playerImage, 0, 128*2, 128, 128, currentPosition.x, currentPosition.y, 50, 50);
            }
        }

        let i = 0;
        const playerMove = () => {
            if (0 <= i && i < 15) {
                if (direction === "up") {
                    ctx.drawImage(playerImage, 128*2, 128, 128, 128, currentPosition.x, currentPosition.y, 50, 50);
                } else if (direction === "right") {
                    ctx.drawImage(playerImage, 0, 128*3, 128, 128, currentPosition.x, currentPosition.y, 50, 50);
                } else if (direction === "down") {
                    ctx.drawImage(playerImage, 128, 0, 128, 128, currentPosition.x, currentPosition.y, 50, 50);
                } else if (direction === "left") {
                    ctx.drawImage(playerImage, 128, 128*2, 128, 128, currentPosition.x, currentPosition.y, 50, 50);
                }
                i++;
            } else if (15 <= i && i < 30) {
                if (direction === "up") {
                    ctx.drawImage(playerImage, 128, 128, 128, 128, currentPosition.x, currentPosition.y, 50, 50);
                } else if (direction === "right") {
                    ctx.drawImage(playerImage, 128*4, 128*2, 128, 128, currentPosition.x, currentPosition.y, 50, 50);
                } else if (direction === "down") {
                    ctx.drawImage(playerImage, 0, 0, 128, 128, currentPosition.x, currentPosition.y, 50, 50);
                } else if (direction === "left") {
                    ctx.drawImage(playerImage, 0, 128*2, 128, 128, currentPosition.x, currentPosition.y, 50, 50);
                }
                i++;
            } else if (30 <= i && i < 45) {
                if (direction === "up") {
                    ctx.drawImage(playerImage, 128*4, 128, 128, 128, currentPosition.x, currentPosition.y, 50, 50);
                } else if (direction === "right") {
                    ctx.drawImage(playerImage, 128*2, 128*3, 128, 128, currentPosition.x, currentPosition.y, 50, 50);
                } else if (direction === "down") {
                    ctx.drawImage(playerImage, 128*3, 0, 128, 128, currentPosition.x, currentPosition.y, 50, 50);
                } else if (direction === "left") {
                    ctx.drawImage(playerImage, 128*3, 128*2, 128, 128, currentPosition.x, currentPosition.y, 50, 50);
                }
                i++;
            } else if (45 <= i && i < 60) {
                if (direction === "up") {
                    ctx.drawImage(playerImage, 128, 128, 128, 128, currentPosition.x, currentPosition.y, 50, 50);
                } else if (direction === "right") {
                    ctx.drawImage(playerImage, 128*4, 128*2, 128, 128, currentPosition.x, currentPosition.y, 50, 50);
                } else if (direction === "down") {
                    ctx.drawImage(playerImage, 0, 0, 128, 128, currentPosition.x, currentPosition.y, 50, 50);
                } else if (direction === "left") {
                    ctx.drawImage(playerImage, 0, 128*2, 128, 128, currentPosition.x, currentPosition.y, 50, 50);
                }
                i++;
            } else if (i === 60) {
                if (direction === "up") {
                    ctx.drawImage(playerImage, 128, 128, 128, 128, currentPosition.x, currentPosition.y, 50, 50);
                } else if (direction === "right") {
                    ctx.drawImage(playerImage, 128*4, 128*2, 128, 128, currentPosition.x, currentPosition.y, 50, 50);
                } else if (direction === "down") {
                    ctx.drawImage(playerImage, 0, 0, 128, 128, currentPosition.x, currentPosition.y, 50, 50);
                } else if (direction === "left") {
                    ctx.drawImage(playerImage, 0, 128*2, 128, 128, currentPosition.x, currentPosition.y, 50, 50);
                }
                i = 0;
            }
        }

        

        //動き
        const loop = () => {
            if (currentPosition !== position) {
                let newPosition = currentPosition;
                if (currentPosition.x > position.x) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    newPosition.x -= 1;
                    setCurrentPosition(newPosition);
                    drawMap();
                    if(newPosition.x !== position.x) {
                        playerMove();
                    } else if (newPosition.x === position.x) {
                        drawPlayer();
                        drawArrow();
                    }    
                } else if (currentPosition.x < position.x) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    newPosition.x += 1;
                    setCurrentPosition(newPosition);
                    drawMap();
                    if(newPosition.x !== position.x) {
                        playerMove();
                    } else if (newPosition.x === position.x) {
                        drawPlayer();
                        drawArrow();
                    }    
                } else if (currentPosition.y > position.y) {
                    if (position.y === positions[7].y) {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        newPosition.y -= 1;
                        speechSynthesis.cancel();
                        if(currentPosition.y === 230) {
                            setCurrentPosition(positions[7]);
                        } else {
                            setCurrentPosition(newPosition);
                        }
                        drawMap();
                        if(newPosition.y !== position.y) {
                            playerMove();
                        } else if (newPosition.y === position.y) {
                            drawPlayer();
                            drawArrow();
                        }
                    }else{
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        newPosition.y -= 1;
                        setCurrentPosition(newPosition);
                        drawMap();
                        if(newPosition.y !== position.y) {
                            playerMove();
                        } else if (newPosition.y === position.y) {
                            drawPlayer();
                            drawArrow();
                        }                    
                    }
                } else if (currentPosition.y < position.y) {
                    if (position.y === positions[2].y) {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        newPosition.y += 1;
                        if(currentPosition.y === 180) {
                            setCurrentPosition(positions[2]);
                        } else {
                            setCurrentPosition(newPosition);
                        }
                        drawMap();
                        if(newPosition.y !== position.y) {
                            playerMove();
                        } else if (newPosition.y === position.y) {
                            drawPlayer();
                            drawArrow();
                        }
                    }else{
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        newPosition.y += 1;
                        setCurrentPosition(newPosition);
                        drawMap();
                        if(newPosition.y !== position.y) {
                            playerMove();
                        } else if (newPosition.y === position.y) {
                            drawPlayer();
                            drawArrow();
                        }
                    }
                }
                request.current = requestAnimationFrame(loop);
            }
        }
        if (currentPosition !== position) {
            loop();
        }

        setTimeout(() => {
            if (!isBack) {
                speak(clearGuide[clearStep]);
            } else if (clearStep === 0 && isBack) {
                speak(`This is the ${positions[clearPosition].room}, ${backClearGuide[clearStep]}`);
            } else if (isBack) {
                speak(backClearGuide[clearStep]);
            } 
        },"1200");
        
        return () => cancelAnimationFrame(request.current);
    },)

    const removeClassBtn = () => {
        const btns = document.getElementsByClassName("direction-btn");
        Array.from(btns).forEach(btn=> {
            btn.classList.remove("incorrect-btn");
        });
    }
    const processRotateLeft = () => {
        const currentIndex = directions.indexOf(direction);
        const newDirection = directions[(currentIndex + 3) % 4]; // 左回転は-1の操作と同じ
        const newStep = clearStep + 1;
        setDirection(newDirection);
        setClearStep(newStep);

        correctAudio.play();
        removeClassBtn();
        document.getElementById("left-btn").classList.add("correct-btn");
        setTimeout(() => {
            document.getElementById("left-btn").classList.remove("correct-btn");
        },"1000");
    }
    const processRotateRight = () => {
        const currentIndex = directions.indexOf(direction);
        const newDirection = directions[(currentIndex + 1) % 4]; // 右回転は+1の操作と同じ
        const newStep = clearStep + 1;
        setDirection(newDirection);
        setClearStep(newStep);

        correctAudio.play();
        removeClassBtn();
        document.getElementById("right-btn").classList.add("correct-btn");
        setTimeout(() => {
            document.getElementById("right-btn").classList.remove("correct-btn");
        },"1000");
    }
    
    // 左回転処理
    const rotateLeft = () => {
        const currentIndex = directions.indexOf(direction);
        if (clearMoves[positionNumber] && !isBack) {
            if (directions[(currentIndex + 3) % 4] == Object.keys(clearMoves[positionNumber])) {
                processRotateLeft();
                setGuideSentence([...guideSentence, "Turn left"]);
            } else {
                incorrectAudio.play();
                document.getElementById("left-btn").classList.add("incorrect-btn");
            }
        } else if (backClearMoves[positionNumber] && isBack) {
            if (clearStep === 0) {
                processRotateLeft();
                setBackGuideSentence([...backGuideSentence, "Turn left"]);
            } else if (directions[(currentIndex + 3) % 4] == Object.keys(backClearMoves[positionNumber])) {
                processRotateLeft();
                setBackGuideSentence([...backGuideSentence, "Turn left"]);
            } else {
                incorrectAudio.play();
                document.getElementById("left-btn").classList.add("incorrect-btn");
            }
        } else {
            incorrectAudio.play();
            document.getElementById("left-btn").classList.add("incorrect-btn");
        }
    }
    // 右回転処理
    const rotateRight = () => {
        const currentIndex = directions.indexOf(direction);
        if(clearMoves[positionNumber] && !isBack) {
            if (directions[(currentIndex + 1) % 4] == Object.keys(clearMoves[positionNumber])) {
                processRotateRight();
                setGuideSentence([...guideSentence, "Turn right"]);
            } else {
                incorrectAudio.play();
                document.getElementById("right-btn").classList.add("incorrect-btn");
            }
        } else if (backClearMoves[positionNumber] && isBack) {
            if (directions[(currentIndex + 1) % 4] == Object.keys(backClearMoves[positionNumber])) {
                processRotateRight();
                setBackGuideSentence([...backGuideSentence, "Turn right"]);
            } else {
                incorrectAudio.play();
                document.getElementById("right-btn").classList.add("incorrect-btn");
            }
        } else {
            incorrectAudio.play();
            document.getElementById("right-btn").classList.add("incorrect-btn");
        }
    }
    // 移動処理
    const move = () => {
        if (clearMoves[positionNumber] && clearMoves[positionNumber][direction] !== undefined && !isBack) {
            const newPositionNumber = clearMoves[positionNumber][direction];
            const newStep = clearStep + 1;
            setCurrentPosition(positions[positionNumber])
            setPositionNumber(newPositionNumber);
            setPosition(positions[newPositionNumber]);
            setGuideSentence([...guideSentence, "Go straight"]);
            
            correctAudio.play();
            removeClassBtn();
            document.getElementById("straight-btn").classList.add("correct-btn");
            setTimeout(() => {
                document.getElementById("straight-btn").classList.remove("correct-btn");
            },"1000");

            if(newPositionNumber === clearPosition) {
                setIsBack(true);
                setClearStep(0);
            } else {
                setClearStep(newStep);
            }
        } else if (backClearMoves[positionNumber] && backClearMoves[positionNumber][direction] !== undefined && isBack) {
            const newPositionNumber = backClearMoves[positionNumber][direction];
            const newStep = clearStep + 1;
            setCurrentPosition(positions[positionNumber])
            setPositionNumber(newPositionNumber);
            setPosition(positions[newPositionNumber]);
            setBackGuideSentence([...backGuideSentence, "Go straight"]);
            setClearStep(newStep);

            correctAudio.play();
            removeClassBtn();
            document.getElementById("straight-btn").classList.add("correct-btn");
            setTimeout(() => {
                document.getElementById("straight-btn").classList.remove("correct-btn");
            },"1000");
        } else {
            incorrectAudio.play();
            document.getElementById("straight-btn").classList.add("incorrect-btn");
        }
    }
    
    const onclickResetGame = () => {
        setDirection("up");
        setPositionNumber(0);
        setPosition(positions[0]);
        setCurrentPosition(positions[0]);
        setClearStep(0);
        setIsBack(false);
        setGuideSentence([]);
        setBackGuideSentence([]);
        removeClassBtn();
        const btns = document.getElementsByClassName("direction-btn");
        Array.from(btns).forEach(btn=> {
            btn.classList.remove("eventNone");
        });
    }

    return (
        <>
            <canvas id="mapCanvas" ref={canvasRef} width={700} height={500} />
            <div className="buttons">
                <img src="./images/reset.png" className="resetGame" alt="" onClick={onclickResetGame}/>
                <div id="controls">
                    <img src="./images/turnleft.png" id="left-btn" className="direction-btn" alt="" onClick={rotateLeft}/>
                    <img src="./images/straight.png" id="straight-btn" className="direction-btn" alt="" onClick={move}/>
                    <img src="./images/turnright.png" id="right-btn" className="direction-btn" alt="" onClick={rotateRight}/>
                </div>
            </div>
        </>
    )
}