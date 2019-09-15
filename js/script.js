// select the container
let ul = document.querySelectorAll('li');;
let letters= ["A", "B", "C", "D", "E", "F", "G", "H", ""]
let numbers = letters;
const number_of_grid = 3;

function setUp() {
    removeDroppable(ul);
    // fill the grid with numbers
    fillGrid(ul, numbers);
    // get the content and dimension of the grid
    state.content = getState(ul);
    state.dimension = getDimension(state);
    setId(ul)
    // set up the droppable and dragabble contents
    setDroppable(ul) ;
    setDraggable(ul);
    
}

// the app state
const state = {}
state.content = numbers;

const isCorrect = (solution, game_dimension) => {
    if(JSON.stringify(solution) == JSON.stringify(game_dimension)) return true;
    return false;
}

/**
 * Getters
 */
const getDimension = (state) => {
    let j = 0;
    let arr = [];
    const {content} = state;
    for(let i = 0; i < number_of_grid; i++) {
        arr.push(content.slice(j, j+number_of_grid));
        j+=number_of_grid;
    }

    return arr;
}

const getState = (items) => {
    const state = [];
    items.forEach((item, i) => {
        state.push(item.innerText)
    });
    return state;
}
const getEmptyCell = () => {
    const emptyCell = state.emptyCellIndex+1;
    const emptyCellRow = Math.ceil(emptyCell/number_of_grid);
    const emptyCellCol = number_of_grid - (number_of_grid * emptyCellRow - emptyCell);
    return [emptyCellRow-1, emptyCellCol-1]
}
/**
 * Setters
 */
const setDroppable = (items) => {
    items.forEach((item, i) => {
        if(!item.innerText) {
            state.emptyCellIndex = i;
            item.setAttribute("ondrop", "drop_handler(event);");
            item.setAttribute("ondragover", "dragover_handler(event);");
            item.setAttribute("class", "empty");
            item.setAttribute("draggable", "false");
            item.setAttribute("ondragstart", "");
            item.setAttribute("ondragend", "")
        }
        return;
        
    })
}

const removeDroppable = (items) => {
    items.forEach((item, i) => {
            state.emptyCellIndex = i;
            item.setAttribute("ondrop", "");
            item.setAttribute("ondragover", "");
            item.setAttribute("draggable", "false");
            item.setAttribute("ondragstart", "");
            item.setAttribute("ondragend", "");
            item.classList.remove("empty"); 
    })
}
const setDraggable = (items) => {
    const [row, col] = getEmptyCell();
    console.log(state)
    let left, right, top, bottom = null;
    if(state.dimension[row][col-1]) left = state.dimension[row][col-1];
    if(state.dimension[row][col+1]) right = state.dimension[row][col+1];

    if(state.dimension[row-1] != undefined) top = state.dimension[row-1][col];
    if(state.dimension[row+1] != undefined) bottom = state.dimension[row+1][col];


    // make its right and left dragabble
    items.forEach(item => {
        if(item.innerText == top || 
            item.innerText == bottom || 
            item.innerText == right ||
            item.innerText == left) {
                item.setAttribute("draggable", "true");
                item.setAttribute("ondragstart", "dragstart_handler(event)");
                item.setAttribute("ondragend", "dragend_handler(event)")
            }
        
    })
}

const setId = (ul) => {
    for(let i = 0; i < ul.length; i++) {
        ul[i].setAttribute("id", `li${i}`)
    }
}


/**
 * Drag and drop handlers
 */
const dragstart_handler = ev => {
    console.log("dragstart")
    ev.dataTransfer.setData("text/plain", ev.target.id)
    ev.dataTransfer.dropEffect = "move";
}

const dragover_handler = ev => {
    console.log("dragOver");
 // Change the target element's border to signify a drag over event
 // has occurred
 ev.preventDefault();
}

const drop_handler = ev => {
    console.log("drag")
    ev.preventDefault();
    // Get the id of the target and add the moved element to the target's DOM
    const data = ev.dataTransfer.getData("text/plain");
    ev.target.innerText = document.getElementById(data).innerText;
    
    // once dropped, unempty the cell :)
    ev.target.classList.remove("empty")
    ev.target.setAttribute("ondrop", "");
    ev.target.setAttribute("ondragover", "");
    document.getElementById(data).innerText = "";

    // get new state
    state.content = getState(ul);
    // get new dimention from the state
    state.dimension = getDimension(state);
}

function dragend_handler(ev) {
  console.log("dragEnd");
  // Remove all of the drag data
  ev.dataTransfer.clearData();
  // remove all droppable attributes
  removeDroppable(document.querySelectorAll('li'));
  // set new droppable and draggable attributes
  setDroppable(document.querySelectorAll('li'));
  setDraggable(document.querySelectorAll('li'))
  console.log(state.content)
  console.log(numbers)

  // if correct
  if(isCorrect(numbers, state.content)) {
      showModal();
  }
  console.log("isCorrect", isCorrect(numbers, state.content))
}


/*
* This part contains utility functions
*
*/


const isSolvable = (arr) => {
    let number_of_inv = 0;
    // get the number of inversions
    for(let i =0; i<arr.length; i++){
        for(let j = i+1; j < arr.length; j++) {
            if((arr[i] && arr[j]) && arr[i] > arr[j]) number_of_inv++;
        }
    }
    // if the number of inversions is even
    // the puzzle is solvable
    return (number_of_inv % 2 == 0);
}

// shuffle the array
const shuffle = (arr) => {
    const copy = [...arr];
    // loop over half or full of the array
    for(let i = 0; i < copy.length; i++) {
        // for each index,i pick a random index j 
        let j = parseInt(Math.random()*copy.length);
        // swap elements at i and j
        let temp = copy[i];
        copy[i] = copy[j];
        copy[j] = temp;
    }   
    return copy;
 }

 const fillGrid = (items, numbers) => {
    let shuffled = shuffle(numbers);
    // shuffle the numbers until there is a combination that is solvable
    while(!isSolvable(shuffled)) {
        shuffled = shuffle(numbers);
    }
    items.forEach((item, i) => {
        item.innerText = shuffled[i];
    })
}

const showModal = () => {
    document.getElementById('message').innerText = "You Won!";
    document.getElementById('modal').classList.remove("hide");

}

const hideModal = () => {
    document.getElementById('modal').classList.add("hide");
}
