(() => {
    const init = () => {
        //DOM references
        const newGameBtn = document.getElementById('newGameBtn');
        const resetBtn = document.getElementById('resetBtn');
        const easyBtn = document.getElementById('easyBtn');
        const hardBtn = document.getElementById('hardBtn');
        const scoreCount = document.getElementById('scoreCount');

        const tiles = Array.from(document.getElementsByClassName('tile'));
        const defaultColor = 'yellow';
        let tile1;
        let tile2;
        let score = 0;
        let uncoveredTiles = 0;
        
        
        const flipSide = (e) => {
            const flip = (tile) => {
                if (tile.dataset.shown == '0') {
                    tile.dataset.shown = '1';
                    tile.style.backgroundColor = tile.dataset.color;
                } else {
                    tile.dataset.shown = '0';
                    tile.style.backgroundColor = defaultColor;
                    score++;
                    scoreCount.innerText = score;
                }
            };
            const tile = e.target;
            if (!tile1) {
                tile1 = tile;
                flip(tile);
            } else if (tile1 && !tile2) {
                flip(tile);
                tile2 = tile;
                if (tile1.style.backgroundColor === tile2.style.backgroundColor && tile1!=tile2) {
                    //compare if the same
                    //if so lock them, reset tile1 and tile2, leave those two uncovered
                    tile1.removeEventListener('click', flipSide);
                    tile2.removeEventListener('click', flipSide);
                    tile1 = tile2 = null;
                    uncoveredTiles++;
                    console.log(`uncoveredTiles ${uncoveredTiles}`);
                    if (uncoveredTiles === 3) {
                        newGame.over();
                    }
                }
            } else if (tile1 && tile2) {
                flip(tile1);
                flip(tile2);
                flip(tile);
                // tile1.style.backgroundColor = defaultColor;
                // tile2.style.backgroundColor = defaultColor;
                tile1 = tile;
                tile2 = null;
            } else {
                console.log("SOMETHING WENT WRONG IN FLIPPING TILES!!!!");
            }
            console.log(tile);
            
        }
        
        //newGame starts new game and adds event listener for tiles, assigns random colors to the tiles
        const newGame = {
            start() {
                newGameBtn.disabled = true;
                // add test for easy/hard mode
                console.log('game started');
                const colorArray = ['red', 'red', 'blue', 'blue', 'green', 'green'];
                const randomColorFor = (tile) => {
                    const random = () => Math.floor(Math.random() * colorArray.length);
                    tile.dataset.color = colorArray.splice(random(), 1);
                };
                tiles.forEach(tile => {
                    tile.style.backgroundColor = defaultColor;
                    randomColorFor(tile);
                });
                
                //reset score to 0
                scoreCount.innerText = '0';
                score = 0;
                //assign random colors
                //add event listeners
                tiles.forEach(tile => {
                    tile.addEventListener('click', flipSide, false);
                });
                //every click increase score
                //when third tile is uncovered hide first tile
                //when second tile is the same as first tile lock them and reset uncovered tiles to 0
                //when all tiles are uncovered game over

            },
            reset() {
                //reset ALL variables
                tile1 = tile2 = null;
                score = 0;
                uncoveredTiles = 0;
                tiles.forEach(tile => {
                    tile.removeEventListener('click', flipSide);
                    tile.style.backgroundColor = defaultColor;
                    tile.dataset.shown = '0';
                });
                newGameBtn.disabled = false;
            },
            over() {
                alert(`Game over!\nYou scored ${score} points`);
            }
        };
        // const newGame = new Game();
        newGameBtn.addEventListener('click', newGame.start, false);
        resetBtn.addEventListener('click', newGame.reset, false);
    };

    document.addEventListener('DOMContentLoaded', init);
})();