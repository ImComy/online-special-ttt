import React, { useEffect, useState } from "react";
import { useChannelStateContext, useChatContext } from "stream-chat-react";
import Square from "./Square";
import { Patterns } from "../WinningPatterns";
import "./board.css";

function Board({ result, setResult }) {
  const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
  const [player, setPlayer] = useState("X");
  const [turn, setTurn] = useState("X");
  const [moveHistory, setMoveHistory] = useState([]);
  const [squareToRemoveNext, setSquareToRemoveNext] = useState(null);

  const { channel } = useChannelStateContext();
  const { client } = useChatContext();

  useEffect(() => {
    checkIfTie();
    checkWin();
  }, [board]);

  useEffect(() => {
    if (moveHistory.length > 5) {
      setSquareToRemoveNext(moveHistory[0].square);
    }
  }, [moveHistory]);

  const chooseSquare = async (square) => {
    if (turn === player && board[square] === "") {
      setTurn(player === "X" ? "O" : "X");

      await channel.sendEvent({
        type: "game-move",
        data: { square, player },
      });

      const newMoveHistory = [...moveHistory, { player, square }];

      if (newMoveHistory.length > 6) {
        setSquareToRemoveNext(null);
        setTimeout(() => {
          const updatedMoveHistory = newMoveHistory.slice(1);
          setMoveHistory(updatedMoveHistory);

          const newBoard = ["", "", "", "", "", "", "", "", ""];
          updatedMoveHistory.forEach((move) => {
            newBoard[move.square] = move.player;
          });
          setBoard(newBoard);
        }, 1000);
      } else {
        setMoveHistory(newMoveHistory);
        setBoard(
          board.map((val, idx) => {
            if (idx === square && val === "") {
              return player;
            }
            return val;
          })
        );
      }
    }
  };

  const undoMove = () => {
    if (moveHistory.length > 0) {
      const lastMove = moveHistory[moveHistory.length - 1];
      const newMoveHistory = moveHistory.slice(0, -1);

      const newBoard = ["", "", "", "", "", "", "", "", ""];
      newMoveHistory.forEach((move) => {
        newBoard[move.square] = move.player;
      });

      setBoard(newBoard);
      setMoveHistory(newMoveHistory);
      setTurn(lastMove.player === "X" ? "O" : "X");
      setSquareToRemoveNext(null);
      setResult({ winner: "", state: "" });
    }
  };

  const checkWin = () => {
    Patterns.forEach((currPattern) => {
      const firstPlayer = board[currPattern[0]];
      if (firstPlayer === "") return;
      let foundWinningPattern = true;
      currPattern.forEach((idx) => {
        if (board[idx] !== firstPlayer) {
          foundWinningPattern = false;
        }
      });

      if (foundWinningPattern) {
        setResult({ winner: board[currPattern[0]], state: "won" });
      }
    });
  };

  const checkIfTie = () => {
    let filled = true;
    board.forEach((square) => {
      if (square === "") {
        filled = false;
      }
    });

    if (filled) {
      setResult({ winner: "none", state: "tie" });
    }
  };

  const handleReset = () => {
    setBoard(["", "", "", "", "", "", "", "", ""]);
    setMoveHistory([]);
    setSquareToRemoveNext(null);
    setTurn("X");
    setPlayer("X");
    setResult({ winner: "", state: "" });
  };

  channel.on((event) => {
    if (event.type === "game-move" && event.user.id !== client.userID) {
      const currentPlayer = event.data.player === "X" ? "O" : "X";
      setPlayer(currentPlayer);
      setTurn(currentPlayer);
      const newMoveHistory = [...moveHistory, { player: event.data.player, square: event.data.square }];

      if (newMoveHistory.length > 6) {
        setSquareToRemoveNext(null);
        setTimeout(() => {
          const updatedMoveHistory = newMoveHistory.slice(1);
          setMoveHistory(updatedMoveHistory);

          const newBoard = ["", "", "", "", "", "", "", "", ""];
          updatedMoveHistory.forEach((move) => {
            newBoard[move.square] = move.player;
          });
          setBoard(newBoard);
        }, 1000);
      } else {
        setMoveHistory(newMoveHistory);
        setBoard(
          board.map((val, idx) => {
            if (idx === event.data.square && val === "") {
              return event.data.player;
            }
            return val;
          })
        );
      }
    }
  });

  return (
    <div>
      <div className="board">
        <div className="row">
          <Square
            val={board[0]}
            chooseSquare={() => chooseSquare(0)}
            flicker={squareToRemoveNext === 0}
          />
          <Square
            val={board[1]}
            chooseSquare={() => chooseSquare(1)}
            flicker={squareToRemoveNext === 1}
          />
          <Square
            val={board[2]}
            chooseSquare={() => chooseSquare(2)}
            flicker={squareToRemoveNext === 2}
          />
        </div>
        <div className="row middle">
          <Square
            val={board[3]}
            chooseSquare={() => chooseSquare(3)}
            flicker={squareToRemoveNext === 3}
          />
          <Square
            val={board[4]}
            chooseSquare={() => chooseSquare(4)}
            flicker={squareToRemoveNext === 4}
          />
          <Square
            val={board[5]}
            chooseSquare={() => chooseSquare(5)}
            flicker={squareToRemoveNext === 5}
          />
        </div>
        <div className="row">
          <Square
            val={board[6]}
            chooseSquare={() => chooseSquare(6)}
            flicker={squareToRemoveNext === 6}
          />
          <Square
            val={board[7]}
            chooseSquare={() => chooseSquare(7)}
            flicker={squareToRemoveNext === 7}
          />
          <Square
            val={board[8]}
            chooseSquare={() => chooseSquare(8)}
            flicker={squareToRemoveNext === 8}
          />
        </div>
      </div>
      <div className="controls">
        <button onClick={handleReset} className="reset-button">
          Reset Board
        </button>
        <button onClick={undoMove} className="undo-button">
          Undo Move
        </button>
      </div>
    </div>
  );
}

export default Board;
