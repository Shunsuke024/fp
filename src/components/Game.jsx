import React, { useState, useEffect, useRef } from "react";

export const Game = (props) => {
    const canvasRef = useRef(null);

    const { moves, direction, setDirection, directions, positions, clearPosition, setGuideSentence, findPath, createDropDown, speak} = props;

    const [positionNumber, setPositionNumber] = useState(0);
    
    const [position, setPosition] = useState(positions[positionNumber]);
    const [currentPosition, setCurrentPosition] = useState(positions[positionNumber]);
    
    let mapImage = new Image();
    mapImage.src = "./images/map.jpg"
    let playerImage = new Image();
    playerImage.src = "./images/RyutaOthers.png";
    const request = useRef();
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        
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
                    }    
                } else if (currentPosition.y > position.y) {
                    if (position === positions[7]) {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        newPosition.y -= 1;
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
                        }                    
                    }
                } else if (currentPosition.y < position.y) {
                    if (position === positions[2]) {
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
                        }
                    }
                }
                request.current = requestAnimationFrame(loop);
            }
        }
        loop();

        return () => cancelAnimationFrame(request.current);
    },)

    // 左回転処理
    const rotateLeft = () => {
        // speak("turn left");
        const currentIndex = directions.indexOf(direction);
        const newDirection = directions[(currentIndex + 3) % 4]; // 左回転は-1の操作と同じ
        setDirection(newDirection);
    }
    // 右回転処理
    const rotateRight = () => {
        // speak("turn right");
        const currentIndex = directions.indexOf(direction);
        const newDirection = directions[(currentIndex + 1) % 4]; // 右回転は+1の操作と同じ
        setDirection(newDirection);
    }
    // 移動処理
    const move = () => {
        if (moves[positionNumber] && moves[positionNumber][direction] !== undefined) {
            // speak("go straight");
            const newPositionNumber = moves[positionNumber][direction];
            setCurrentPosition(positions[positionNumber])
            setPositionNumber(newPositionNumber);
            setPosition(positions[newPositionNumber]);
            if (clearPosition === newPositionNumber) {
                setGuideSentence(findPath(0, clearPosition));
            }
        } else {
            // drawMap("進めません。");
        }
    }

    return (
        <>
            <canvas id="mapCanvas" ref={canvasRef} width={700} height={500} />
            <div id="controls">
                <button className="direction-btn" onClick={rotateLeft}>左回転</button>
                <button className="direction-btn" onClick={move}>進む</button>
                <button className="direction-btn" onClick={rotateRight}>右回転</button>
            </div>
            
        </>
    )
}