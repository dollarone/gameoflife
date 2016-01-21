var PlatfomerGame = PlatformerGame || {};

//title screen
PlatformerGame.Game = function(){};

PlatformerGame.Game.prototype = {
    create: function() {

        //  A simple background for our game
        this.game.stage.backgroundColor = "#9CFFCE";
        this.music = this.game.add.audio('music');
        this.music.loop = true;
//        this.music.play();

        this.timer = 0;
        this.speed = 5;

        this.speedStep = 1;

        this.plusKey = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
        this.plusKey.onDown.add(this.incSpeed, this);
        this.minusKey = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
        this.minusKey.onDown.add(this.decSpeed, this);
        this.rKey = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
        this.rKey.onDown.add(this.restart, this);
        this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        this.enterKey.onDown.add(this.pressEnter, this);

        this.graphics = this.game.add.graphics(0, 0);

        this.foregroundCol = 0xFFF8E7;
        this.backgroundCol = 0x9CFFCE;

        this.grid = {};
        this.nextGrid = {};

        this.allTimeMinimumX = -1;
        this.allTimeMaximumX = -1;

        this.allTimeMinimumY = -1;
        this.allTimeMaximumY = -1;

        this.minimumX = -1;
        this.maximumX = -1;
        this.minimumY = -1;
        this.maximumY = -1;


        this.generateRandomGrid();

        this.scoreText = this.game.add.text(16, 16, 'Speed: ' + this.speed, { fontSize: '32px', fill: '#000' });
        this.scoreText.fixedToCamera = true;

        this.manualSteps = false;
        this.enterPressed = false;

    },

    generateGrid: function() {
        this.grid[40] = {};
        this.grid[41] = {};
        this.grid[42] = {};
        this.grid[40][30] = true;
        this.grid[40][31] = true;
        this.grid[40][32] = true;
        this.grid[41][32] = true;
        this.grid[42][31] = true;
        for (var a in this.grid) {
            for (var b in this.grid[a]) {
                this.graphics.beginFill(this.foregroundCol, 1);
                this.graphics.drawRect(a * 10 + 1, b * 10 + 1, 8, 8);
            }
        }
        this.minimumX = 39;
        this.maximumX = 43;
        this.minimumY = 29;
        this.maximumY = 33;
    },

    generateRandomGrid: function() {
        var max = Math.floor((Math.random() * 20) + 20);
       // this.game.rnd.integerInRange(10, 30);
        for (var j = 0; j < max; j++) {
            var randX = 30 + parseInt(this.game.rnd.integerInRange(5, 15));
            var randY = 20 + parseInt(this.game.rnd.integerInRange(5, 15));
            //var randY = this.game.rnd.integerInRange(5, 15);

            if (this.minimumX == -1 || randX <= this.minimumX) {
                this.minimumX = parseInt(randX) - 1;
                this.allTimeMinimumX = this.minimumX;
            }
            if (this.maximumX == -1 || randX >= this.maximumX) {
                this.maximumX = parseInt(randX) + 1;
                this.allTimeMaximumX = this.maximumX;
            }
            if (this.minimumY == -1 || randY <= this.minimumY) {
                this.minimumY = parseInt(randY) - 1;
                this.allTimeMinimumY = this.minimumY;
            }
            if (this.maximumY == -1 || randY >= this.maximumY) {
                this.maximumY = parseInt(randY) + 1;
                this.allTimeMaximumY = this.maximumY;
            }

            if (randX in this.grid) {
                this.grid[randX][randY] = true;
            }
            else {
                this.grid[randX] = {};
                this.grid[randX][randY] = true;
            }
            this.graphics.beginFill(this.foregroundCol, 1);
            this.graphics.drawRect(randX * 10 + 1, randY * 10 + 1, 8, 8);
        }
    },

    restart: function() {
        this.game.paused = true;

        for (var x = this.allTimeMinimumX; x <= this.allTimeMaximumX; x++) {
            for (var y = this.allTimeMinimumY; y <= this.allTimeMaximumY; y++) {
                this.graphics.beginFill(this.backgroundCol, 1);
                this.graphics.drawRect(x*10 + 1, y*10 + 1, 8, 8);
            }
        }

        delete this.grid;
        delete this.nextGrid;
        this.grid = {};
        this.nextGrid = {};
        this.minimumX = -1;
        this.maximumX = -1;
        this.minimumY = -1;
        this.maximumY = -1;

        this.generateRandomGrid();
        this.game.paused = false;
    },

    update: function() {
        this.timer++;
        /*

Any live cell with fewer than two live neighbours dies, as if caused by under-population.
Any live cell with two or three live neighbours lives on to the next generation.
Any live cell with more than three live neighbours dies, as if by over-population.
Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
*/
        if ((this.manualSteps && this.enterPressed) || (!this.manualSteps && this.timer % this.speed == 0)) {

            this.minimumX = -1;
            this.maximumX = -1;
            this.minimumY = -1;
            this.maximumY = -1;

            for (var x in this.grid) {
                for (var y in this.grid[x]) {
                    var i = this.countNeighbours(x, y);
                    if (i < 2 || i > 3) {
                        if (x in this.grid && y in this.grid[x]) {

                            if (x in this.nextGrid && y in this.nextGrid[x]) {
                                if (Object.keys(this.nextGrid[x]).length == 1) {
                                    delete this.nextGrid[x];
                                }
                                else {
                                    delete this.nextGrid[x][y];
                                }
                            }
                            
                            this.graphics.beginFill(this.backgroundCol, 1);
                            this.graphics.drawRect(x*10 + 1, y*10 + 1, 8, 8);
                        }
                    }
                    else {
                        if (x in this.nextGrid) {
                            this.nextGrid[x][y] = true;
                        }
                        else {
                            this.nextGrid[x] = {};
                            this.nextGrid[x][y] = true;
                        }

                        if (this.minimumX == -1 || x <= this.minimumX) {
                            this.minimumX = parseInt(x) - 1;
                        }
                        if (this.maximumX == -1 || x >= this.maximumX) {
                            this.maximumX = parseInt(x) + 1;
                        }
                        if (this.minimumY == -1 || y <= this.minimumY) {
                            this.minimumY = parseInt(y) - 1;
                        }
                        if (this.maximumY == -1 || y >= this.maximumY) {
                            this.maximumY = parseInt(y) + 1;
                        }
                    }
                    // could check dead neightbour cells here, but that means doing double work a lot

                }
            }


            for (var x = this.minimumX; x <= this.maximumX; x++) {
                for (var y = this.minimumY; y <= this.maximumY; y++) {
                    if (!(x in this.grid && y in this.grid[x])) {
                        // e.g. dead cells
                        var i = this.countNeighbours(x, y);
                        
                        if (i == 3) {
                            if (x in this.nextGrid) {
                                this.nextGrid[x][y] = true;
                            }
                            else {
                                this.nextGrid[x] = {};
                                this.nextGrid[x][y] = true;
                            }
                            this.graphics.beginFill(this.foregroundCol, 1);
                            this.graphics.drawRect(x*10 + 1, y*10 + 1, 8, 8);

                            if (this.minimumX == -1 || x <= this.minimumX) {
                                this.minimumX = parseInt(x) - 1;
                            }
                            if (this.maximumX == -1 || x >= this.maximumX) {
                                this.maximumX = parseInt(x) + 1;
                            }
                            if (this.minimumY == -1 || y <= this.minimumY) {
                                this.minimumY = parseInt(y) - 1;
                            }
                            if (this.maximumY == -1 || y >= this.maximumY) {
                                this.maximumY = parseInt(y) + 1;
                            }
                        }
                    }
                }
            }
            if (this.minimumX < this.allTimeMinimumX) {
                this.allTimeMinimumX = this.minimumX;
            }
            if (this.maximumX > this.allTimeMaximumX) {
                this.allTimeMaximumX = this.maximumX;
            } 
            if (this.minimumY < this.allTimeMinimumY) {
                this.allTimeMinimumY = this.minimumY;
            }
            if (this.maximumY > this.allTimeMaximumY) {
                this.allTimeMaximumY = this.maximumY;
            }

            delete this.grid;
            this.grid = {};
            for (var x2 in this.nextGrid) {
                for (var y2 in this.nextGrid[x2]) {
                    if (x2 in this.grid) {
                        this.grid[x2][y2] = true;

                    }
                    else {
                        this.grid[x2] = {};
                        this.grid[x2][y2] = true;
                    }
                }
            }

            this.enterPressed = false;
        }
    },

    pressEnter: function() {
        this.enterPressed = true;
    },

    clone: function(obj) {
        if (null == obj || "object" != typeof obj) return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    },

    checkGrid: function(my_x, my_y) {
        if (my_x in this.grid && my_y in this.grid[my_x]) {
            return true;
        }
        else {
            return false;
        }
    },

    countNeighbours: function(_x, _y) {
        var n = 0;

        if (this.checkGrid(parseInt(_x)-1, parseInt(_y)-1)) {
            n++;
        }
        if (this.checkGrid(parseInt(_x), parseInt(_y)-1)) {
            n++;
        }
        if (this.checkGrid(parseInt(_x)+1, parseInt(_y)-1)) {
            n++;
        }
        if (this.checkGrid(parseInt(_x)-1, parseInt(_y))) {
            n++;
        }
        if (this.checkGrid(parseInt(_x)+1, parseInt(_y))) {
            n++;
        }
        if (this.checkGrid(parseInt(_x)-1, parseInt(_y)+1)) {
            n++;
        }
        if (this.checkGrid(parseInt(_x), parseInt(_y)+1)) {
            n++;
        }
        if (this.checkGrid(parseInt(_x)+1, parseInt(_y)+1)) {
            n++;
        }
        return n;
    },

    incSpeed: function() {
        this.speed += this.speedStep;
        this.scoreText.text = "Speed: " + this.speed
        this.manualSteps = false;
    },
    decSpeed: function() {
        this.speed -= this.speedStep;
        if (this.speed <= 0) {
            this.speed = 0;
            this.scoreText.text = "Speed: Manual - press enter for next step.";
            this.manualSteps = true;
        }
        else {
            this.scoreText.text = "Speed: " + this.speed;
        }
    },
};