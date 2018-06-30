(() => {
    const init = () => {
        // console.log('started');
        //DOM references
        const newGameBtn = document.getElementById('newGameBtn');
        const resetBtn = document.getElementById('resetBtn');
        // const easyBtn = document.getElementById('easyBtn');
        // const hardBtn = document.getElementById('hardBtn');
        const mode = document.querySelector('.switch>input');
        const scoreCount = document.getElementById('scoreCount');
        const mainArea = document.querySelector('.main');
        const hardTiles = Array.from(document.getElementsByClassName('tileHard'));
        const tiles = Array.from(document.getElementsByClassName('tile'));
        const defaultBackground = {
            background: `radial-gradient(rgba(255,255,255,0) 0, rgba(255,255,255,.15) 30%, rgba(255,255,255,.3) 32%, rgba(255,255,255,0) 33%) 0 0,
radial-gradient(rgba(255,255,255,0) 0, rgba(255,255,255,.1) 11%, rgba(255,255,255,.3) 13%, rgba(255,255,255,0) 14%) 0 0,
radial-gradient(rgba(255,255,255,0) 0, rgba(255,255,255,.2) 17%, rgba(255,255,255,.43) 19%, rgba(255,255,255,0) 20%) 0 110px,
radial-gradient(rgba(255,255,255,0) 0, rgba(255,255,255,.2) 11%, rgba(255,255,255,.4) 13%, rgba(255,255,255,0) 14%) -130px -170px,
radial-gradient(rgba(255,255,255,0) 0, rgba(255,255,255,.2) 11%, rgba(255,255,255,.4) 13%, rgba(255,255,255,0) 14%) 130px 370px,
radial-gradient(rgba(255,255,255,0) 0, rgba(255,255,255,.1) 11%, rgba(255,255,255,.2) 13%, rgba(255,255,255,0) 14%) 0 0,
linear-gradient(45deg, #343702 0%, #184500 20%, #187546 30%, #006782 40%, #0b1284 50%, #760ea1 60%, #83096e 70%, #840b2a 80%, #b13e12 90%, #e27412 100%);`,
            backgroundSize: `470px 470px, 970px 970px, 410px 410px, 610px 610px, 530px 530px, 730px 730px, 100% 100%;`,
            backgroundColor: '#840b2a;'
        };

        let tile1;
        let tile2;
        let score = 0;
        let uncoveredTiles = 0;
        let maxTiles = 3; //number of pairs of tiles

        const makeColorsArray = () => {
            let colorArray = new Array(maxTiles * 2);
            const generateRGB = () => {
                const r = Math.floor(Math.random() * 256);
                const g = Math.floor(Math.random() * 256);
                const b = Math.floor(Math.random() * 256);
                return `rgb(${r}, ${g}, ${b})`;
            }
            const populateColorArray = () => {
                const generatePosition = () => Math.floor(Math.random() * colorArray.length);

                const assignPosition = (position, color) => {
                    if (!colorArray[position]) {
                        colorArray[position] = color;
                    } else {
                        assignPosition(generatePosition(), color);
                    }
                }
                for (let i = 0; i < maxTiles; i++) {
                    //generate color once and position it in the array twice
                    const generatedColor = generateRGB();
                    assignPosition(generatePosition(), generatedColor);
                    assignPosition(generatePosition(), generatedColor);
                }
            };
            populateColorArray();
            return colorArray;
        };



        const changeMode = (e) => {
            if (!mode.checked) {
                hardTiles.forEach(tile => {
                    tile.classList.add('hide')
                });
                mainArea.classList.remove('hard');
                maxTiles = 3;
            } else {
                hardTiles.forEach(tile => {
                    tile.classList.remove('hide')
                });
                mainArea.classList.add('hard');
                maxTiles = 8;
            }

            //if hard then add class hard to main and tileHard display = '';
        };

        const flipSide = (e) => {
            const flip = (tile) => {
                if (tile.dataset.shown == '0') {
                    tile.dataset.shown = '1';
                    console.log(tile.dataset.color);
                    tile.style.background = `${tile.dataset.color}`;
                } else {
                    tile.dataset.shown = '0';
                    // tile.style.background = defaultBackground;
                    tile.style = Object.assign(tile.style, defaultBackground);
                    score++;
                    scoreCount.innerText = score;
                }
            };
            const tile = e.target;
            if (!tile1) {
                console.log('this is the first tile');
                tile1 = tile;
                flip(tile);
            } else if (tile1 && !tile2) {
                console.log('this is the second tile');
                flip(tile);
                tile2 = tile;
                console.log({ tile1 });
                console.log({ tile2 });
                if (tile1.style.background === tile2.style.background && tile1 != tile2) {
                    //compare if the same
                    //if so lock them, reset tile1 and tile2, leave those two uncovered
                    console.log('tile1 and tile2 have the same background');
                    tile1.removeEventListener('click', flipSide);
                    tile2.removeEventListener('click', flipSide);
                    tile1 = tile2 = null;
                    uncoveredTiles++;
                    console.log(`uncoveredTiles ${uncoveredTiles}`);
                    if (uncoveredTiles === maxTiles) {
                        newGame.over();
                    }
                }
            } else if (tile1 && tile2) {
                console.log('both tiles are already uncovered');
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
            // console.log(tile);

        }

        //newGame starts new game and adds event listener for tiles, assigns random colors to the tiles
        const newGame = {
            start() {
                newGameBtn.disabled = true;
                mode.disabled = true;
                // add test for easy/hard mode
                // console.log('game started');
                const colorArray = makeColorsArray();
                const randomColorFor = tile => {
                    const random = () => Math.floor(Math.random() * colorArray.length);
                    tile.dataset.color = colorArray.splice(random(), 1);
                };

                tiles.forEach(tile => {
                    tile.style = Object.assign(tile.style, defaultBackground);
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
                    tile.style = Object.assign(tile.style, defaultBackground);
                    tile.dataset.shown = '0';
                });
                newGameBtn.disabled = false;
                mode.disabled = false;
            },
            over() {
                alert(`Game over!\nYou scored ${score} points`);
                this.reset();
            }
        };
        // const newGame = new Game();
        newGameBtn.addEventListener('click', newGame.start, false);
        resetBtn.addEventListener('click', newGame.reset, false);
        // easyBtn.addEventListener('click', changeMode, false);
        // hardBtn.addEventListener('click', changeMode, false);
        mode.addEventListener('click', changeMode, false);
    };

    document.addEventListener('DOMContentLoaded', init);
})();