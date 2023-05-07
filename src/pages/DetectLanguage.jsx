import React, { useState } from "react";

function DetectLanguage() {
  const [lang, setLang] = useState("");

  const detect = () => {
    var DetectLanguage = require("detectlanguage");

    var detectlanguage = new DetectLanguage('6ac0cd1b6f8fadb6356e8d94c3123a9b');

    detectlanguage.detect(lang).then(function(result) {
        alert(`language is: ${result[0]["language"]} with confidence: ${result[0]["confidence"]}`);
      });
  };

  return (
    <div>
      <input type="text" onChange={(e) => setLang(e.target.value)} />
      <button onClick={detect}>Detect Language</button>
    </div>
  );
}

export default DetectLanguage;
