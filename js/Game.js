var PlatfomerGame = PlatformerGame || {};

//title screen
PlatformerGame.Game = function(){};

PlatformerGame.Game.prototype = {
    create: function() {

        //  A simple background for our game
        this.game.stage.backgroundColor = "#fff"; //#77bbcc";
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

        this.graphics = this.game.add.graphics(0, 0);

        this.foregroundCol = 0xFFF8E7;
        this.backgroundCol = 0x9CFFCE;

        this.grid = new Array(80);
        this.nextGrid = new Array(80);

        this.generateGrid();

        this.scoreText = this.game.add.text(16, 16, 'Speed: ' + this.speed, { fontSize: '32px', fill: '#000' });
        this.scoreText.fixedToCamera = true;

/*
        this.grid[40][30] = true;
        this.grid[40][31] = true;
        this.grid[40][32] = true;
        this.grid[41][32] = true;
        this.grid[42][31] = true;

        // draw a rectangle
        this.graphics.beginFill(this.foregroundCol, 1);
//        this.graphics.lineStyle(1, 0xFFF8E7, 1);
        this.graphics.drawRect(400 + 1, 300 + 1, 8, 8);
//        this.graphics.endFill();
        this.graphics.beginFill(this.foregroundCol, 1);
        this.graphics.drawRect(400 + 1, 310 + 1, 8, 8);
        this.graphics.beginFill(this.foregroundCol, 1);
        this.graphics.drawRect(400 + 1, 320 + 1, 8, 8);
        this.graphics.beginFill(this.foregroundCol, 1);
        this.graphics.drawRect(410 + 1, 320 + 1, 8, 8);
        this.graphics.beginFill(this.foregroundCol, 1);
        this.graphics.drawRect(420 + 1, 310 + 1, 8, 8);
*/
    },

    generateGrid: function() {
        for (var x = 0; x < 80; x++) {
            this.grid[x] = new Array(60);
            this.nextGrid[x] = new Array(60);
            for (var y = 0; y < 60; y++) {
                this.grid[x][y] = false;
                this.nextGrid[x][y] = false;
                this.graphics.beginFill(this.backgroundCol, 1);
                this.graphics.drawRect(x*10 + 1, y*10 + 1, 8, 8);

            }
        }
        var max = Math.floor((Math.random() * 20) + 20);
       // this.game.rnd.integerInRange(10, 30);
        for (var j = 0; j < max; j++) {
            var randX = Math.floor((Math.random() * 10) + 3); //this.game.rnd.integerInRange(5, 15);
            var randY = Math.floor((Math.random() * 10) + 3); //this.game.rnd.integerInRange(5, 15);
            //var randY = this.game.rnd.integerInRange(5, 15);
            this.grid[30 + randX][20 + randY] = true;
            this.graphics.beginFill(this.foregroundCol, 1);
            this.graphics.drawRect((30 + randX) * 10 + 1, (20 + randY) * 10 + 1, 8, 8);
        }

    },

    restart: function() {
        this.game.paused = true;
        this.generateGrid();
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
if (this.timer % this.speed == 0) {
        for (var x = 0; x < 80; x++) {
            for (var y = 0; y < 60; y++) {
                var i = this.countNeighbours(x, y);
                if (this.grid[x][y] == false && i == 3) {
                    this.nextGrid[x][y] = true;
                }
                else if (i < 2 || i > 3) {
                    this.nextGrid[x][y] = false;
                }
                else {
                    this.nextGrid[x][y] = this.grid[x][y];
                }
            }
        }
        for (var x = 0; x < 80; x++) {
            for (var y = 0; y < 60; y++) {
                if (this.grid[x][y] != this.nextGrid[x][y]) {
                    this.grid[x][y] = this.nextGrid[x][y];
                    if (this.grid[x][y]) {
                        this.graphics.beginFill(0xFFF8E7, 1);
                        this.graphics.drawRect(x*10 + 1, y*10 + 1, 8, 8);
                    }
                    else {
                        this.graphics.beginFill(0x9CFFCE, 1);
                        this.graphics.drawRect(x*10 + 1, y*10 + 1, 8, 8);

                    }
            }
        }
}
}
    },

    countNeighbours: function(x, y) {
        var n = 0;

        if (x > 0 && y > 0 && this.grid[x-1][y-1]) {
            n++;
        }
        if (y > 0 && this.grid[x][y-1]) {
            n++;
        }
        if (x < 79 && y > 0 && this.grid[x+1][y-1]) {
            n++;
        }
        if (x > 0 && this.grid[x-1][y]) {
            n++;
        }
        if (x < 79 && this.grid[x+1][y]) {
            n++;
        }
        if (x > 0 && y < 59 && this.grid[x-1][y+1]) {
            n++;
        }
        if (y < 59 && this.grid[x][y+1]) {
            n++;
        }
        if (x < 79 && y < 59 && this.grid[x+1][y+1]) {
            n++;
        }
        return n;
    },

    incSpeed: function() {
        this.speed += this.speedStep;
        this.scoreText.text = "Speed: " + this.speed
    },
    decSpeed: function() {
        this.speed -= this.speedStep;
        if (this.speed < 0) {
            this.speed = 1;
        }
        this.scoreText.text = "Speed: " + this.speed
    },
};