import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className={"square" + (props.highlight ? " highlight" : "")} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

function Board(props) {
    let rows = [];

    for (let row = 0; row < 3; ++row) {
        let squares = [];

        for (let col = 0; col < 3; ++col) {
            const i = row * 3 + col;

            squares.push(
                <Square key={i} value={props.squares[i]} highlight={ props.highlights[i] }
                        onClick={() => props.onClick(i)} />
            )
        }

        rows.push(
            <div key={row} className="board-row">{ squares }</div>
        )
    }

    return (
        <div>{ rows }</div>
    );
}

class Game extends React.Component {
    // Constructeur
    constructor(props) {
        super(props);

        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            hightlights: Array(9).fill(false),
            stepNumber: 0,
            xIsNext: true,
            reverseMoves: false,
        }
    }

    // Méthodes
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber+1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat({
                squares: squares,
            }),

            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    reverseMoves() {
        this.setState({
            reverseMoves: !this.state.reverseMoves
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        let moves = history.map((step, move) => {
            let desc = move ? 'Go to move #' + move : 'Go to game start';

            if (move) {
                const prev = history[move-1];
                let found = false;

                for (let row = 0; row < 3; ++row) {
                    for (let col = 0; col < 3; ++col) {
                        const i = row * 3 + col;

                        if (step.squares[i] !== prev.squares[i]) {
                            desc += ` (${row}, ${col})`;
                            found = true;
                            break;
                        }
                    }

                    if (found) break;
                }
            }

            if (move === this.state.stepNumber) {
                desc = <strong>{desc}</strong>;
            }

            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        if (this.state.reverseMoves) {
            moves = moves.reverse();
        }

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else if (calculateDraw(current.squares)) {
            status = 'Draw'
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} highlights={ highlightsSquares(current.squares) }
                           onClick={(i) => this.handleClick(i)} />
                </div>
                <div className="game-info">
                    <div>{ status }</div>
                    <button onClick={() => { this.reverseMoves() }}>Sort moves</button>
                    <ol>{ moves }</ol>
                </div>
            </div>
        );
    }
}

// ========================================
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const LINES = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < LINES.length; i++) {
        const [a, b, c] = LINES[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }

    return null;
}

function calculateDraw(squares) {
    for (let i = 0; i < 9; ++i) {
        if (squares[i] === null) {
            return false;
        }
    }

    return true;
}

function highlightsSquares(squares) {
    const LINES = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    let highlights = Array(9).fill(false);
    for (let i = 0; i < LINES.length; i++) {
        const [a, b, c] = LINES[i];

        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            highlights[a] = true;
            highlights[b] = true;
            highlights[c] = true;
        }
    }

    return highlights;
}