import React from "react";

function Square({ chooseSquare, val, flicker }) {
  let color = "black";

  if (val === "X") {
    color = "green";
  } else if (val === "O") {
    color = "red";
  }

  return (
    <div className="square" onClick={chooseSquare}>
      <span
        className={`square-content ${flicker ? "flicker" : ""}`}
        style={{ color }}
      >
        {val}
      </span>
    </div>
  );
}

export default Square;
