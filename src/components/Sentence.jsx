import React, { useEffect } from "react";

export const Sentence = (props) => {
    const { place, sentences, setSentences, changeMap, guideSentence, backGuideSentence } = props;

    const onclickDelete = (id) => {
        const oldSentences = [...sentences];
        const newSentences = oldSentences.filter(newSentences => newSentences.id !== id);
        setSentences(newSentences);
        
        const returnReason = document.getElementById(id);
        returnReason.style.backgroundColor = "rgb(249, 240, 255)";
        returnReason.classList.remove("eventNone");
    }

    const deleteButton = document.getElementsByClassName("deleteButton");
    const buttonHidden = () => {
      for (let i = 0; i < deleteButton.length; i++) {
        deleteButton[i].style.visibility = "hidden";
      }
    }
    const buttonVisible = () => {
      for (let i = 0; i < deleteButton.length; i++) {
        deleteButton[i].style.visibility = "visible";
      }  
    }
    useEffect(() => {
        document.getElementById("boxSentence").addEventListener("mouseenter", buttonVisible);
        document.getElementById("boxSentence").addEventListener("mouseleave", buttonHidden);  
          
        return () => {
          document.getElementById("boxSentence").removeEventListener("mouseenter", buttonVisible);
          document.getElementById("boxSentence").removeEventListener("mouseleave", buttonHidden);  
        };
    }, );
    
    return (
        <div className="sentences">
          <div className="guideSentence">
            {guideSentence.map((guideSentence, index) => {
              return (
                <div key={index} className="sentence">
                  {guideSentence}.
                </div>
              );
              })}
          </div>
          
          <div className="mapSentence">
            <div className="place sentence">{place}</div>
            <div id="boxSentence" className="boxSentence">
              {sentences.map((sentence) => {
                return (
                  <div key={sentence.id} className="sentence">
                    {sentence.en}
                    {changeMap ?
                      <></>
                    :
                    <img src="./images/reset.png" className="deleteButton" alt="" onClick={() => onclickDelete(sentence.id)}/>
                    }
                  </div>
                );
              })}
            </div>
          </div>

          <div className="guideSentence">
            {backGuideSentence.map((guideSentence, index) => {
              return (
                <div key={index} className="sentence">
                  {guideSentence}.
                </div>
              );
              })}
          </div>
        </div>
    )
}