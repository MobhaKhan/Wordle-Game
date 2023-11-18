  
//HTML has the icons of each as clickable
  function Instructions() {
    if (document.getElementById("instructions-container").style.display === "block") { // If its being displayed both column 2 and the instructions-container should disappear when clicked upon
      document.querySelector(".column2").style.display = "none";
      document.getElementById("instructions-container").style.display = "none";
    } else {
      document.getElementById("instructions-container").style.display = "block"; //If aren't visable make both visable
      document.querySelector(".column2").style.display = "block";
    }
  
    document.querySelector(".column1").focus(); // Since I had each of the icons as clickable even pressing the enter key would trigger the icons unless clicked on column1
    //by this method it automatically focuses on column 1 after the icons are clicked on
  }
  
  function Hint() {
    if (document.getElementById("hintText").style.display === "block") { //If the text is visable hide it
      document.getElementById("hintText").style.display = "none";
    } else {
      document.getElementById("hintText").innerHTML = "<i>Hint: </i>" + hint; // If is isn't showing adding the hint and display it
      document.getElementById("hintText").style.display = "block";
    }
  
    document.querySelector(".column1").focus(); //Focus on column 1 after being clicked upon
  }
  
  function darkMode() {
    document.querySelector("body").classList.toggle("dark-mode"); //Toggles the dark-mode (Checking the CSS properties)
    document.querySelector(".column1").focus(); //Focus on column 1 after being clicked upon
  }

//Board JavaScript Starts

// Setting up the variables for the four by four grid
var height = 4; // used for making the grid itself
var width = 4; // used for making the grid itself
var row = 0; // used for iterating through the grid
var col = 0; // used for iterating through the grid
let word; // used for the random word from provided dictionary
let hint; // used for the random word's hint from provided dictionary

window.onload = function() { 
  fillingContent();  //fillingContent was the only one loaded when wordle opens is because it has all the functions calls within
}

function grid(){  // This function creates the grid itself. The inner for loop is for the width making boxes in one row the increment to new height (new row)
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) { 
      let box = document.createElement("span"); //span was used so it doesn't affect any other element. The recommended table method was messing up my formatting
      box.id = i.toString() + j.toString(); //Giving each box the id of ij to address each box
      box.classList.add("box"); // adding the boxes with css properties
      box.innerText = ""; // each is filled with empty strings
      document.getElementById("board").appendChild(box); // This appends the boxes to the board which was created as a div  
     }
  }
}

async function wordGenerator() {
  //Getting the random word / hint from the json object
  const restartButton = document.getElementById("restart");
  restartButton.disabled = true; // Part of the requirement to disable the Start Over while the word is being generated
  restartButton.innerText = "Loading..."; // The Start Over changes to loading in the time it takes to load the word

  const response = await fetch("https://api.masoudkf.com/v1/wordle", {
    headers: {
      "x-api-key": "sw0Tr2othT1AyTQtNDUE06LqMckbTiKWaVYhuirv",
    },
  });
  const data = await response.json();
  const dictionary = data.dictionary; // extracting the dictionary
    
  const generateRandomIndex = Number.parseInt(Math.random() * dictionary.length); 
  word = dictionary[generateRandomIndex].word.toUpperCase();
  hint = dictionary[generateRandomIndex].hint;

  restartButton.disabled = false; // Making the start Over work again
  restartButton.innerText = "Start Over";
  console.log(word); //This was to see what the random word was from the dictionary
  console.log(hint); //This was to see what the random word's hint was from the dictionary
}

async function fillingContent(){
  grid(); // Creates the grid
  await wordGenerator(); //
  document.addEventListener("keyup", (key) => { //adding the event listener of "keyup" so when the key is pressed and released
  // the 'key' is like the callback function that executes the code when the "keyup" event is triggered
    if ("KeyA" <= key.code && key.code <= "KeyZ") { //Checks if the ket is a letter
      if (col < width) { // checks is the the boxes don't exeed the width of the grid
        let currentBox = document.getElementById(row.toString()  + col.toString()); //gets the currentBox (ij)
        if (currentBox.innerText == "") {
          currentBox.innerText = key.code[3].toUpperCase(); // adds the keys to the boxes 
          col ++;
        }
      }
    } 
    else if (key.code == "Backspace") { 
      if (0 < col && col <= width) {
        col --; // goes back a box
      }
      let currentBox = document.getElementById(row.toString() + col.toString()); //gets the currentBox (ij)
      currentBox.innerText = "";// removes the key with an empty string
    } else if (key.code == "Enter") {
      if (col < width) { // if the current box being filled is less than the width throw an alert
        alert("You must complete the word before pressing Enter");
      } else {
        checkRows(); // If the row is full check the row against the word
        if (row < height - 1) { // updates to go to the next row
          row ++;
          col = 0; // col goes to zero so we start the new row at the first box
        }
      }
    }
  });
  restartGame(); // Restart button is there all times
}

function restartGame(){
  //Ensures if it's in darMode it doesn't go back to lightMode since that setting isn't reset
  const restartButton = document.getElementById("restart"); 
  restartButton.addEventListener("click", async () => { // The event listerner is a click on the restart button
    // This part resets the whole board with hiding the hint, instructions, rightAnswer is they are visiable
    document.getElementById('rightAnswer').style.display = "none";
    document.querySelector(".column2").style.display = "none";  // The column 2 in my html creates the flex as a row and has the left border
    document.getElementById("instructions-container").style.display = "none";
    document.getElementById("hintText").style.display = "none";
    document.getElementById('board').innerHTML = ""; // removes the keys with empty strings
    // Remove the congratsImg div completely if it exists (Must check is it's there or else it runs into a error)
    const congratsImgDiv = document.getElementById('congratsImg');
    if (congratsImgDiv) { //If it does exist remove (Basically used after the showCongrats() function)
      congratsImgDiv.remove();
    }
    // reseting the board variables (the height and width can remain the same since they aren't changed becuase they are for the grid layout only)
    row = 0;//These two are changed and used to iterate through
    col = 0; 
    await wordGenerator(); // Get the new random word and hint
    grid(); // boxes are made again
  });

  restartButton.style.backgroundColor = "rgb(104, 167, 104)"; // Adding the CSS properties again becuase the JavaScript was overwrting the CSS 
  restartButton.style.color = "white";
  restartButton.style.width = "10%";
  restartButton.style.cursor = "pointer";
  restartButton.style.textAlign = "center";
  restartButton.style.padding = "8px 16px";
  restartButton.style.marginTop = "100px";
}

function checkRows(){
  let enterWord = ""; // if the key entered is in the correctPlace append it here to check the game status at the end

  for( let j = 0; j < width; j++) {
    let currentBox = document.getElementById(row.toString() + j.toString()); //gets the currentBox (in row "" and col j
    let letter = currentBox.innerText; // letter = (what's in the currentBox) and is used to test the positions

    if(word[j] == letter){
      currentBox.classList.add("correctPlace"); // Style the box accordingly to "correctPlace"
      enterWord += letter; // Add the correct letters to userWord
    }
    else if (word.includes(letter)){ // If the word has that letter style it accordingly to "WrongPlace"
      currentBox.classList.add("wrongPlace");
    }
    else{
      currentBox.classList.add("noExistence");// If it isn't part of the word give it the style of "noExistence"
    }
  }
  if (enterWord == word) { // if the user guess correctly showCongrats()
    showCongrats();
  } else if (row == height - 1) { // if the number of guesses are done showLost()
    showLost();
  }
}

  function showCongrats() {
    // Replaces the board with the congratsImg div (since it needed the same place) and adds styling, text and visiblity of rightAnswer
    document.getElementById('board').innerHTML = '<div id="congratsImg"><img src="https://res.cloudinary.com/mkf/image/upload/v1675467141/ENSF-381/labs/congrats_fkscna.gif" alt="Congrats!"></div>';
    document.getElementById('rightAnswer').innerText = "You guessed the word " + word + " correctly!";
    document.getElementById('rightAnswer').style.backgroundColor = "green";
    document.getElementById('rightAnswer').style.display = "block";
  }

  function showLost(){
    //adds styling, text and visiblity of rightAnswer
    document.getElementById('rightAnswer').innerText = "You missed the word " + word + " and lost!";
    document.getElementById('rightAnswer').style.backgroundColor = "red";
    document.getElementById('rightAnswer').style.display = "block";
  }
  
  