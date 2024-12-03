import React from "react";

export const Reason = (props) => {
    const { reasons, sentences, setSentences, setIsGuide } = props;

    const onClickAdd = (id) => {
        const clickReason = document.getElementById(id);
        id = id.substr(1);
        const soundReason = new SpeechSynthesisUtterance();
        soundReason.text = reasons[id].en;
        soundReason.lang = "en-US";
        soundReason.rate = "0.8"
        speechSynthesis.speak(soundReason);
        clickReason.style.backgroundColor = "rgb(249, 194, 255)";
        clickReason.classList.add("eventNone");
        const newSentences = [...sentences, reasons[id]];
        setSentences(newSentences);
    
        const rooms = document.querySelectorAll("rect");
        rooms.forEach(room => {
          room.classList.add("eventNone");
        });

        setIsGuide(true);
      };

    return (
        <div>
            {reasons.map((reason) => {
              return (
                <p id={reason.id} key={reason.id} className="reason" onClick={() => onClickAdd(reason.id)}>{reason.ja}</p>
              );
            })}
        </div>
    )
}