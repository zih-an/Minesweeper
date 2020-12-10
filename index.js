let LEVEL = 0;  //0-easy:9*9, 1-medium:16*16, 2-hard:16*30
let rSize = 9, cSize=9;  //size of map
let numMines = 10, flagMines = 0, closed = 81;  //number of miens
let MAP = [[]];  //0:unknown; 1-8:numbers; -1: mines
let FLAG = [[]];  //0:close; 1:open; -1:flag; -2:unknown
let over = false;
let leftButtonDown = false;
let rightButtonDown = false;

document.oncontextmenu = function(e){
    return false;
}
initMap();


function GameOver(r,c) {
    let block = document.getElementById(`r${r}c${c}`);
    block.setAttribute("style", `
        background-color: rgb(170, 40, 0);
        background-image: url(images/flag.png);
        background-size: contain;
    `);

    for(let i=0; i<rSize; i++) {
        for(let j=0; j<cSize; j++) {
            if(MAP[i][j]===-1 && FLAG[i][j]!==-1) {
                block = document.getElementById(`r${i}c${j}`);
                if(i==r&&j==c) { // click on
                    block.setAttribute("style", `
                        background-color: rgb(255, 0, 0, 0.7);
                        background-image: url(images/bomb.png);
                        background-size: contain;
                    `);
                }
                else {
                    block.setAttribute("style", `
                        background-image: url(images/bomb.png);
                        background-size: contain;
                    `);
                }
            }
        }
    }

    let mapDisplay = document.getElementById("mapDisplay");
    let pg = document.createElement("p");
    pg.setAttribute("id", "overhint");
    pg.setAttribute("style", `
        font-size: 70px;
        color: rgb(255,0,0);
        font-weight: bold;
        border: 1px solid rgb(255, 0, 0);
        background-color: rgb(255, 255, 255);
        width: 500px;
        position: relative;
        top: -180px;
        padding: 5px 5px 5px 5px;
    `);
    pg.textContent = "GAME OVER";
    mapDisplay.appendChild(pg);
    over = true;
    return;
}
function victory() {
    let mapDisplay = document.getElementById("mapDisplay");
    let pg = document.createElement("p");
    pg.setAttribute("id", "overhint");
    pg.setAttribute("style", `
        font-size: 70px;
        color: rgb(0, 0, 255);
        font-weight: bold;
        border: 1px solid rgb(0, 0, 255);
        background-color: rgb(255, 255, 255);
        width: 500px;
        position: relative;
        top: -180px;
        padding: 5px 5px 5px 5px;
    `);
    pg.textContent = "VICTORY";
    mapDisplay.appendChild(pg);
    return;
}

/* change level */
function chngLevel() {
    let val = document.getElementById("chLevel").value;
    if(val == "Easy") { LEVEL = 0; }
    else if(val == "Medium") { LEVEL = 1; }
    else if(val == "Hard") { LEVEL = 2; }
    initMap();
}

/* left single click */
function leftClick(r, c) {
    if(over) return;
    if(MAP[r][c]===-1 && FLAG[r][c]===0) {
        GameOver(r,c);
        return;
    }
    leftOpen(r, c);
}
// recrusion open blocks
function leftOpen(r, c) {
    if(r<0 || c<0 || r>=rSize || c>=cSize || MAP[r][c]===-1 || FLAG[r][c]===1) return;
    if(FLAG[r][c]===-1 && MAP[r][c]!==-1) {
        GameOver(r,c);
        return;
    }
    if(FLAG[r][c]===-1) return;

    FLAG[r][c] = 1;
    closed--;

    let block = document.getElementById(`r${r}c${c}`);
    block.setAttribute("style", `
        background-color: rgb(189, 188, 184);
        background-image: ;
        background-size: ;
    `);

    let dr = [-1, 1, 0, 0, 1, 1, -1, -1];
    let dc = [0, 0, -1, 1, 1, -1, -1, 1];

    if(MAP[r][c]===0) {
        for(let i=0; i<8; i++)
            leftOpen(r+dr[i], c+dc[i]);
    }
    else {
        block.textContent=MAP[r][c];
        switch(MAP[r][c]) {
            case 1:
                block.setAttribute("style", `
                    background-color: rgb(189, 188, 184);
                    color: rgb(9, 47, 218);
                `);
                break;
            case 2:
                block.setAttribute("style", `
                    background-color: rgb(189, 188, 184);
                    color: rgb(3, 109, 77);
                `);
                break;
            case 3:
                block.setAttribute("style", `
                    color: rgb(109, 3, 26);
                    background-color: rgb(189, 188, 184);
                `);
                break;
            case 4:
                block.setAttribute("style", `
                    color: rgb(61, 3, 109);
                    background-color: rgb(189, 188, 184);
                `);
                break;
            case 5:
                block.setAttribute("style", `
                    color: rgb(0, 0, 0);
                    background-color: rgb(189, 188, 184);
                `);
                break;
            case 6:
                block.setAttribute("style", `
                    color: rgb(212, 62, 16);
                    background-color: rgb(189, 188, 184);
                `);
                break;
            case 7:
                block.setAttribute("style", `
                    color: rgb(71, 69, 68);
                    background-color: rgb(189, 188, 184);
                `);
                break;
            case 8:
                block.setAttribute("style", `
                    color: rgb(89, 236, 255);
                    background-color: rgb(189, 188, 184);
                `);
                break;
        }
    }

    // victory!
    if(closed===numMines && flagMines===numMines) {
        victory();
    }
    return;
}

/* right single click */
function rightClick(r, c) {
    if(FLAG[r][c]===1 || over) return;
    let block = document.getElementById(`r${r}c${c}`);
    let pg = document.getElementById("numMine");

    if(FLAG[r][c]===0) {
        FLAG[r][c]=-1;
        // flag mine!
        flagMines++;
        pg.textContent = numMines - flagMines;

        block.setAttribute("style", `
            background-image: url(images/flag.png);
            background-size: contain;
        `);
        // victory!
        if(closed===numMines && flagMines===numMines) {
            victory();
            return;
        }
    }
    else if(FLAG[r][c]===-1) {
        FLAG[r][c]=-2;
        // flag mine!
        flagMines--;
        pg.textContent = numMines - flagMines;
        block.setAttribute("style", `
            background-image: url(images/question.png);
            background-size: contain;
        `);
    }
    else if(FLAG[r][c]===-2) {
        FLAG[r][c]=0;
        block.setAttribute("style", `
            background-image: ;
            background-size: ;
        `);
    }
}

/* left&right single click */
function lrtDown(r,c) {
    if(over) return;
    // just give some hints
    let dr = [-1, 1, 0, 0, 1, 1, -1, -1];
    let dc = [0, 0, -1, 1, 1, -1, -1, 1];
    for(let i=0;i<8;i++) {
        let nr = r + dr[i];
        let nc = c + dc[i];
        if(nr>=0 && nc>=0 && nr<rSize && nc<cSize && FLAG[nr][nc]===0) {
            let block = document.getElementById(`r${nr}c${nc}`);
            block.setAttribute("style", `
                background-color: rgb(229, 195, 143);
            `);
        }
    }
}
// up
function lrtUp(r,c) {
    if(over) return;

    let dr = [-1, 1, 0, 0, 1, 1, -1, -1];
    let dc = [0, 0, -1, 1, 1, -1, -1, 1];
    // recover the color
    for(let i=0;i<8;i++) {
        let nr = r + dr[i];
        let nc = c + dc[i];
        if(nr>=0 && nc>=0 && nr<rSize && nc<cSize && FLAG[nr][nc]===0) {
            let block = document.getElementById(`r${nr}c${nc}`);
            block.setAttribute("style", `
                background-color: rgb(233, 226, 186);
            `);
        }
    }
    if(MAP[r][c]===0 || MAP[r][c]===-1) return;

    // only open numbers can detect again
    if(FLAG[r][c]===1) {
        let cnt=0;
        // check
        for(let i=0;i<8;i++) {
            let nr = r + dr[i];
            let nc = c + dc[i];
            if(nr>=0 && nc>=0 && nr<rSize && nc<cSize) {
                if(MAP[nr][nc]===-1 && FLAG[nr][nc]===-1)
                    cnt++;
                else if(MAP[nr][nc]!==-1 && FLAG[nr][nc]===-1) {
                    GameOver(nr,nc);  // detect wrong answer!
                    return;
                }
            }
        }
        // open then
        if(cnt===MAP[r][c]) {
            for(let i=0;i<8;i++) {
                let nr = r + dr[i];
                let nc = c + dc[i];
                leftOpen(nr,nc);
            }
        }
    }
}

function mouseDown(r, c) {
    let e = window.event;
    switch(e.button) {
        case 0:
            leftButtonDown = true;
            break;
        case 2:
            rightButtonDown = true;
            break;
    }
    //
    if(leftButtonDown && rightButtonDown){ lrtDown(r, c); }
    else if(leftButtonDown) { leftClick(r, c); }
    else if(rightButtonDown) { rightClick(r, c); }
}



/* initialize map */
function initMap() {
    initTable();
    initMines();
    initNumbers();
}


//initialize table
function initTable() {
    // clear
    document.getElementById('mapDisplay').innerHTML = "";
    let rgnMap = document.getElementById("mapDisplay");
    // get the level and build the map
    flagMines = 0;
    if(LEVEL==0) { rSize = 9, cSize = 9; numMines = 10; }
    else if(LEVEL==1) { rSize = 16, cSize = 16; numMines = 40; }
    else if(LEVEL==2) { rSize = 16, cSize = 30; numMines = 99; }
    MAP = new Array(rSize);
    FLAG = new Array(rSize);
    closed = rSize * cSize;
    over = false;

    // create a paragraph
    let pg = document.createElement("p");
    pg.setAttribute("id", "numMine");
    pg.textContent = numMines;
    rgnMap.appendChild(pg);
    // create a table
    let tbl_map = document.createElement("table");
    rgnMap.appendChild(tbl_map);
    
    // set the cell
    for(let i=0; i<rSize; i++) {  //row
        let row = tbl_map.insertRow();
        MAP[i] = new Array(cSize);
        FLAG[i] = new Array(cSize);
        row.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        }); // Right click
        for(let j=0; j<cSize; j++) { //column
            let cell = row.insertCell();
            cell.setAttribute("id", "r"+i+"c"+j);
            cell.addEventListener("mousedown", function(){ mouseDown(i,j); });
            cell.addEventListener("mouseup", function(){
                if(leftButtonDown&&rightButtonDown)
                    lrtUp(i,j);
                if(leftButtonDown) { leftButtonDown = false; }
                if(rightButtonDown) { rightButtonDown = false; }
            }); 
            
            MAP[i][j] = 0;
            FLAG[i][j] = 0;
        }
    }
}
//initialize mines
function initMines() {
    // randomly generate mines
    for(let i=0; i<numMines; ) {
        let r = Math.floor(Math.random()*rSize);
        let c = Math.floor(Math.random()*cSize);
        if(MAP[r][c] === 0) { MAP[r][c] = -1; }
        else continue;
        i++;
    }
}
//initialize numbers
function initNumbers() {
    let dir_r = [-1, 1, 0, 0, 1, 1, -1, -1];
    let dir_c = [0, 0, -1, 1, 1, -1, -1, 1];
    for(let i=0; i<rSize; i++) {
        for(let j=0; j<cSize; j++) {
            if(MAP[i][j]===-1) continue;

            let cnt = 0;
            for(let d=0; d<8; d++) {
                let nr = i + dir_r[d];
                let nc = j + dir_c[d];
                if(nr>=0 && nc>=0 && nr<rSize && nc<cSize && MAP[nr][nc]===-1)
                    cnt++;
            }
            MAP[i][j] = cnt;
        }
    }
}

