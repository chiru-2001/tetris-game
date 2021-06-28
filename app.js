document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let squares = Array.from(document.querySelectorAll(".grid div"));
  // console.log(squares);
  const audio = document.getElementById('tetris-audio');
  let audio_play = false;
  const scoreDisplay = document.querySelector("#score");
  const gameEnd = document.querySelector('#game-over');
  const startBtn = document.querySelector("#start-button");
  const width = 10;
  let nextRandom = 0;
  let timerId;
  let score = 0;
  const colors = ['#f4a261','#e76f51','#d021e5','#20639B','#173F5F'];
  //9ef07d
  //drawing tetriminoes
  //L tetrimino
  const lTetrimino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];
  const zTetrimino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
  ];
  const tTetrimino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];
  const oTetrimino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];
  const iTetrimino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];
  const theTetriminos = [
    lTetrimino,
    zTetrimino,
    tTetrimino,
    oTetrimino,
    iTetrimino,
  ];
  //   console.log(theTetriminos);
  let currentPosition = 4;
  let currentRotation = 0;
  //   randomly select a tetrimino and its first shape
  let random = Math.floor(Math.random() * theTetriminos.length);
  //   console.log(random);
  let current = theTetriminos[random][currentRotation];
  //draw the random rotation in first tetrimino
  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add("tetrimino");
      squares[currentPosition + index].style.backgroundColor = colors[random];
    });
  }
  // draw();
  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove("tetrimino");
      squares[currentPosition + index].style.backgroundColor = '';
    });
  }
  function control(e) {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 39) {
      //moveright()
      moveRight();
    } else if (e.keyCode === 40) {
      moveDown();
    }
  }
  document.addEventListener("keyup", control);
  //Times and intervals
  //make the tetriminos move down every second
  //movedown function

  function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
  }
  function freeze() {
    if (
      current.some((index) =>
        squares[currentPosition + index + width].classList.contains("taken")
      )
    ) {
      current.forEach((index) =>
        squares[currentPosition + index].classList.add("taken")
      );
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetriminos.length);
      current = theTetriminos[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  }
  //timerId = setInterval(moveDown, 1000);
  // assign functions to keycodes
  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(
      (index) => (currentPosition + index) % width === 0
    );
    if (!isAtLeftEdge) currentPosition -= 1;
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition += 1;
    }
    draw();
  }
  //move the tetrimino right,unless is at the edge or there is a blockage

  function moveRight() {
    undraw();
    const isAtRightEdge = current.some(
      index=> (currentPosition + index) % width === width - 1)
    
    if (!isAtRightEdge) {
      currentPosition += 1;
    }
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition -= 1;
    }
    draw();
  }

  function isAtRight() {
    return current.some(index=> (currentPosition + index + 1) % width === 0)  
  }
  
  function isAtLeft() {
    return current.some(index=> (currentPosition + index) % width === 0)
  }
  //move the tetrimino left,unless it is at the edge or there is a blockage
  function checkRotatedPosition(P){
    P = P || currentPosition       //get current position.  Then, check if the piece is near the left side.
    if ((P+1) % width < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
      if (isAtRight()){            //use actual position to check if it's flipped over to right side
        currentPosition += 1    //if so, add one to wrap it back around
        checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
        }
    }
    else if (P % width > 5) {
      if (isAtLeft()){
        currentPosition -= 1
      checkRotatedPosition(P)
      }
    }
  }
  //keycode and events
  //rotate the tetrimino
  function rotate() {
    undraw();
    currentRotation++;
    if (currentRotation === current.length) {
      // if end of the array is reached then go back to the start.
      currentRotation = 0;
    }
    current = theTetriminos[random][currentRotation];
    checkRotatedPosition()
    draw();
  }

  //displaying the next up tetrimino
  const displaySquares = document.querySelectorAll(".mini-grid div");
  const displayWidth = 4;
  let displayIndex = 0;
  // the tetriminos without rotation
  const upNextTetriminos = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2],
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
    [1, displayWidth, displayWidth + 1, displayWidth + 2],
    [0, 1, displayWidth, displayWidth + 1],
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1],
  ];
  //display the shape in mini-grid display
  function displayShape() {
    displaySquares.forEach((square) => {
      square.classList.remove("tetrimino");
      square.style.backgroundColor = '';
    });
    upNextTetriminos[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index].classList.add("tetrimino");
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
    });
  }
  //adding start/pause button
  //adding functionality to the button
  startBtn.addEventListener("click", () => {
    if(audio_play === false){
    playAudio();
    audio_play= true;
    }
    else{
      pauseAudio();
      audio_play = false;
    }
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    else{
      draw();
      timerId = setInterval(moveDown,1000);
      nextRandom = Math.floor(Math.random()*theTetriminos.length);
      displayShape();
    }
  });
  //splice() method:
  //itemArr.splice(startIndex,deleteCount)
  //splice(),concat(),appendChild()
  /*If user manages to fill the entire row, then the entire row should be removed. Increase the score by 1 and display it.
   */
  function addScore(){
    for(let i=0;i<199;i+=width){
      const row = [i,i+1,i+2,i+3,i+4,i+5,i+6,i+7,i+8,i+9];
      if(row.every(index => squares[index].classList.contains('taken'))){
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach(index => {
          squares[index].classList.remove('taken');
          squares[index].classList.remove('tetrimino');
          squares[index].style.backgroundColor = '';
        });
        const squaresRemoved = squares.splice(i,width);
        // console.log(squaresRemoved);
        squares = squaresRemoved.concat(squares);
        squares.forEach(cell => grid.appendChild(cell));
      }
    }
  }
  function playAudio() { 
    audio.play(); 
  } 
  
  function pauseAudio() { 
    audio.pause();
  } 
  function gameOver(){
    if(current.some(index => squares[currentPosition+index].classList.contains('taken'))){
      pauseAudio();
      gameEnd.style.display = 'block';
      gameEnd.innerHTML = 'GAME OVER';
      clearInterval(timerId);

    }
  }
});
