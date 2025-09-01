// const prompt = require('prompt-sync')();



let Board = (function () {

    let Board_Array = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
    let Wining_States = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 4, 8], [2, 4, 6], [0, 3, 6], [1, 4, 7], [2, 5, 8]];
    let Played_Rounds = 0;

    function PlayRound(Player, Index) {
        if (Board_Array[Index] != " ") return false;
        Board_Array[Index] = Player.Marker;
        Played_Rounds++;
        return true;
    }

    function CheckState(State) {
        if (Board_Array[State[0]] != " " && Board_Array[State[0]] == Board_Array[State[1]] && Board_Array[State[0]] == Board_Array[State[2]]) {
            return true;
        }
        return false;
    }
    function CheckWin() {
        let WinExist = false;

        Wining_States.forEach(function (State) {
            if (CheckState(State)) WinExist = State;
        })
        return WinExist;
    }
    function ResetBoard() {
        Board_Array.forEach(function (value, index, array) { array[index] = " " });
        Played_Rounds = 0;
    }
    function CheckFull() {
        return (Played_Rounds == 9);
    }
    return { PlayRound, CheckWin, ResetBoard, CheckFull };
})()

Display = {}


function Player(Name, Marker) {
    function Win() {
        console.log(`Congrates ${this.Name} you won the game`);
    }
    return { Name, Marker, Win };
}

let Game = (function Game() {

    let Player1;
    let Player2;
    let Current_Player;
    let Ended = false;

    function Start() {
        let name = UIX.GetName1();
        Player1 = Player(name, "❌");
        name = UIX.GetName2();
        Player2 = Player(name, "⭕");
        Current_Player = Player1;
    }

    function ResetGame() {

        Board.ResetBoard();
        Current_Player = Player1;
        Ended = false;
        UIX.Reset();
    }

    function Play(ix) {
        if (Ended) return;
        let Round_status = Board.PlayRound(Current_Player, ix);
        if (!Round_status) return; //  to highlight reset button
        UIX.SetCell(ix, Current_Player.Marker);
        let State = Board.CheckWin();
        if (State) { UIX.ShowWinner(Current_Player, State); Ended = true; }
        else if (Board.CheckFull()) { UIX.ShowTie(); Ended = true; }
        else Current_Player = (Current_Player == Player1) ? Player2 : Player1;
    }

    return { Start, Play, ResetGame };
})()

let UIX = (function UI() {

    let Cells = document.querySelectorAll(".grid div");
    let Reset_button = document.querySelector("#reset-button");
    let Text = document.querySelector("h1");
    let Grid = document.querySelector(".grid");
    let Start_Button = document.querySelector("#submit-names");
    let Player1_Name = document.querySelector("#player1-name");
    let Player2_Name = document.querySelector("#player2-name");
    let Dialog = document.querySelector("#get-names");
    let Cells_Array = document.querySelectorAll(".cell");

    function Reset() {
        Cells_Array.forEach(function (cell) { cell.textContent = " "; cell.style["background-color"] = "white" });
        Text.textContent = "";
    }
    function SetCell(ix, symbol) {
        Cells_Array[ix].textContent = symbol;
    }

    function ShowGame() {
        Dialog.style["display"] = "none";
        Grid.classList.toggle("hide");
        Text.classList.toggle("hide");
        Reset_button.classList.toggle("hide");
    }

    function GetName1() {
        return Player1_Name.value;
    }
    function GetName2() {
        return Player2_Name.value;
    }
    function ShowWinner(player, State) {
        Text.textContent = `Congrats ${player.Name} You won the round 🏆`;
        State.forEach(function (ix) { Cells_Array[ix].style["background-color"] = "lightgreen"; })
    }

    function ShowTie() {
        Text.textContent = `Tie! 🤝`;
    }

    (() => {

        Start_Button.onclick = () => { ShowGame(); Game.Start() };
        Cells_Array.forEach(function (cell) { cell.onclick = () => { Game.Play(cell.id[1]) } });
        Reset_button.onclick = () => { Game.ResetGame() };

    })()

    return { ShowGame, GetName1, GetName2, Reset, ShowWinner, ShowTie, SetCell };


})()





