import React, { useState, useEffect, useRef } from "react";
import { init, GameLoop, Sprite, SpriteSheet, Text } from "kontra";

export const GameKontra = () => {
    const canvasRef = useRef(null);
    // const { init, GameLoop, Sprite, SpriteSheet, Text } = kontra;

    const [positionNumber, setPositionNumber] = useState(0);
    const positions = {
        0: { x: 155, y: 375 },
        1: { x: 155, y: 320 },
        2: { x: 237, y: 320 },
        3: { x: 320, y: 320 },
        4: { x: 320, y: 270 },
        5: { x: 320, y: 370 },
        6: { x: 320, y: 410 },
        // 7: { x: 350, y: 350 },
        // 8: { x: 350, y:  50 }
    };
    const [position, setPosition] = useState(positions[positionNumber]);
    const [direction, setDirection] = useState("up");
    const [message, setMessage] = useState();
    
    
    // 双方向の移動ルールを定義
    const moves = {
        0: { up: 1 },
        1: { right: 2, down: 0 },
        2: { right: 3, left: 1 },
        3: { up: 4, down: 5, left: 2 },
        4: { down: 3 },
        5: { down: 6, up: 3 },
        6: { up: 5 },
        // 7: { up: 4 },
        // 8: { down: 6 }
    };

    const directions = ['up', 'right', 'down', 'left'];
    const directionSymbols = {
        up: '↑',
        right: '→',
        down: '↓',
        left: '←'
    };
    function speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US"; // 英語に設定
        window.speechSynthesis.speak(utterance);
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        
        // Kontraの初期化
        let { context } = init(canvas);
        
        let mapImage = new Image();
        mapImage.src = "./images/map.jpg"
        let map = Sprite({
            x: 0,
            y: 0,
            width: 700,
            height: 500,
            image: mapImage
        });

        let playerImage = new Image();
        playerImage.src = "./images/Ryuta.png"; 
        
        let spriteSheet = SpriteSheet({
            image: playerImage,
            frameWidth: 128,
            frameHeight: 128,
            animations: {
                up: {
                    frames: 3,
                    frameRate: 1,
                },
                right: {
                    frames: 0,
                    frameRate: 1,
                },
                down: {
                frames: 0,
                frameRate: 1,
                },
                left: {
                    frames: 0,
                    frameRate: 1,
                },
            
            }
        });
        
        let player = Sprite({
            x: position.x,
            y: position.y,
            width: 50,
            height: 50,
            animations: spriteSheet.animations
        });
        
        // let test = Sprite({
        //     x: 320,
        //     y: 410,
        //     width:50,
        //     height: 50,
        //     animations: spriteSheet.animations
        // })
        
        let text = Text({
            text: `方向: ${directionSymbols[direction]}`,
            font: "16px Arial",
            color: "black",
            x: position.x,
            y: position.y - 25,
            textAlign: "center"
        });

        let loop = GameLoop({
        update: () => {
            if (direction === "up") {
                player.playAnimation("up");
            } else if (direction === "right") {
                player.playAnimation("right");
            } else if (direction === "down") {
                player.playAnimation("down");
            } else if (direction === "left") {
                player.playAnimation("left");
            }
            // if (player.x > position.x) {
            //     player.dx = -1;
            // } else if (player.x < position.x) {
            //     player.dx = 1;
            // } else if (player.x === position.x) {
            //     player.dx = 0;
            // }
            // if (player.y > position.y) {
            //     player.dy = -1;
            // } else if (player.y < position.y) {
            //     player.dy = 1;
            // } else if (player.y === position.y) {
            //     player.dy = 0;
            // }
            map.update();
            player.update();
            // test.update();
        },
        render: () => {
            map.render();
            player.render();
            // test.render();
            text.render();
        }
        });

        loop.start(); // ゲームループを開始

        return () => {
        loop.stop(); // コンポーネントがアンマウントされたらループを停止
        };
    }, [direction,position]);

    // 左回転処理
    const rotateLeft = () => {
        speak("turn left");
        const currentIndex = directions.indexOf(direction);
        const newDirection = directions[(currentIndex + 3) % 4]; // 左回転は-1の操作と同じ
        setDirection(newDirection);
    }
    // 右回転処理
    const rotateRight = () => {
        speak("turn right");
        const currentIndex = directions.indexOf(direction);
        const newDirection = directions[(currentIndex + 1) % 4]; // 右回転は+1の操作と同じ
        setDirection(newDirection);
    }
    // 移動処理
    const move = () => {
        if (moves[positionNumber] && moves[positionNumber][direction] !== undefined) {
            speak("go strait");
            const newPositionNumber = moves[positionNumber][direction];
            setPositionNumber(newPositionNumber);
            setPosition(positions[newPositionNumber]);
            // speak(position.toString());
        } else {
            // drawMap("進めません。");
        }
    }
    console.log(direction);
    console.log(position);
  return (
    <>
        <canvas id="mapCanvas" ref={canvasRef} width={700} height={500} />
        <div id="controls">
            <button className="direction-btn" onClick={rotateLeft}>左回転</button>
            <button className="direction-btn" onClick={move}>進む</button>
            <button className="direction-btn" onClick={rotateRight}>右回転</button>
        </div>
    </>
  );
};
