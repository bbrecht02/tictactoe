import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square (props) {
      return (
        <button className="square" onClick= {props.onClick}>
            {props.value}
        </button>
      );
  } 
  
  class Board extends React.Component {

    renderSquare(i) {
      return ( 
        <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        />
      );
    }
  
    render() {
      return (
        <div>
          <div className="phrase">TIC TAC TOE</div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {

    moveRow = [];
    moveCol = [];

    constructor(props) {
        super(props);
        this.state = {
            history: [{squares: Array(9).fill(null)}],
            stepNumber: 0,
            xIsNext:true,
        };
    }

    reMakePosition(i) {
      this.handleClick(i);
      this.getRow(i);
      this.getCol(i);
    }

    getRow(i) {
      if ([0,3,6].includes(i)) {
        return 1;
      } else if ([1,4,7].includes(i)) {
        return 2;
      } else {
        return 3;
      }
    }

    getCol(i) {
      if ([0,1,2].includes(i)) {
        return 1;
      } else if ([3,4,5].includes(i)) {
        return 2;
      } else {
        return 3;
      }
    }

    handleClick(i) {

        const history = this.state.history.slice(0,this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
        this.moveRow.push(this.getRow(i));
        this.moveCol.push(this.getCol(i));
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {

      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const moves = history.map((step, move) => {
          const desc = move ? "Go to move #" + 
          move +
          ` (${this.moveRow[move-1]},${this.moveCol[move-1]})` 
          : "Go to game start";
          return (
            <li key={move}> 
                <button onClick={() => this.jumpTo(move)}>
                  {move === this.state.stepNumber ? <b>{desc}</b> : desc}
                </button>
            </li>
          );
      });

      let status;
      if (winner) {
          status = "Winner: " + winner;
      } else {
          status = "Next Player: " + (this.state.xIsNext ? "X" : "O");
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
                squares={current.squares}
                onClick={(i) => this.reMakePosition(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }

  function calculateWinner(squares) {
      const lines = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
      ];

      for (let i = 0; i < lines.length; i++) {
          const [a,b,c] = lines[i];
          if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
              return squares[a];
          }
      }
      return null;
  }

  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );