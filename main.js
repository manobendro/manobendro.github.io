const D_UP = 0;
const D_DOWN = 1;
const D_LEFT = 2;
const D_RIGHT = 3;

class Snake{
    head = {gx:15, gy:30}
    tails = [
        {gx:14, gy:30},
        {gx:13, gy:30},
        {gx:12, gy:30}
    ];
    food = {gx:15, gy:20};
    moving_direc= D_RIGHT;

    prev_time = 0;

    score = 0;

    speed = 330;

    constructor(){
        this.prev_time = millis();
    }

    _move(dir){

        if(dir == D_UP){
            if(this.moving_direc != D_DOWN){
                this.moving_direc = dir;
            }
        }else if(dir == D_DOWN){
            if(this.moving_direc != D_UP){
                this.moving_direc = dir;
            }
        }else if(dir == D_LEFT){
            if(this.moving_direc != D_RIGHT){
                this.moving_direc = dir;
            }
        }else if(dir == D_RIGHT){
            if(this.moving_direc != D_LEFT){
                this.moving_direc = dir;
            }
        }
        _lg("Move "+dir);

    }
    move(){

        for(let i = this.tails.length - 1;i>=1; i--){
            //let _x = this.tails[i-1].gx;
            //let _y = this.tails[i-1].gy;
            this.tails[i].gx = this.tails[i-1].gx;
            this.tails[i].gy = this.tails[i-1].gy;
        }
        this.tails[0].gx = this.head.gx;
        this.tails[0].gy = this.head.gy;

        if(this.moving_direc == D_UP){
            this.head.gy -= 1;

        }else if(this.moving_direc == D_DOWN){
            this.head.gy += 1;
        }else if(this.moving_direc == D_LEFT){
            this.head.gx -= 1;
        }else if(this.moving_direc == D_RIGHT){
            this.head.gx += 1;
        }

        

        //console.log(this.tails);
        _lg(this.moving_direc);

    }
    eat(){
        if(this.head.gx == this.food.gx && this.head.gy == this.food.gy){
            this.score ++;
            this.tails.push({
                gx:this.tails[this.tails.length - 1].gx,
                gy:this.tails[this.tails.length - 1].gy
            });
            this.food.gx = floor(random(2, 30));
            this.food.gy = floor(random(2, 60));
            //console.log(this.food);
            if(this.speed > 10){
                this.speed = this.speed - this.speed * 0.1;
            } 
        }
    }
    isSnakeDied(){
        return (this.head.gx == 1 || this.head.gx == 30 || this.head.gy == 1 || this.head.gy == 60) || this.bodyTouch();
    }
    bodyTouch(){
        for(let tail of this.tails){
            if(this.head.gx == tail.gx && this.head.gy == tail.gy){
                return true;
            }
        }
        return false;
    }
    getScore(){
        return this.score;
    }

    draw(){

        if(floor(millis()-this.prev_time) > this.speed){
            //console.log("...");
            if(!this.isSnakeDied()){
                this.move();
                this.eat();
            }
            this.prev_time = millis();
        }

        //Drawing food
        fill('blue');
        drawSblock({gx:this.food.gx, gy:this.food.gy});
        //Drawing head
        fill('red');
        drawSblock({gx:this.head.gx, gy:this.head.gy});
        //Drawing tail
        fill('white');
        this.drawTail();
    }
    drawTail(){
        for (let tail of this.tails){
            drawSblock({gx:tail.gx, gy:tail.gy});
        }
    }
}


let snake = null;
function setup(){
    snake = new Snake();
    swipedetect(document.getElementById('defaultCanvas0'), tuchSwipe);
    createCanvas(300, 600);
}

function draw(){
    background('#00cc00');
    drawHorizontalWall();
    drawVerticalWall();
    if(snake.isSnakeDied()){
        text("Your Score: "+snake.getScore(),110,300);
        //console.log(snake.getScore());
    }
    snake.draw();
}

function keyPressed(){
    if(keyCode == UP_ARROW){
        _lg("UP");
        snake._move(D_UP);
    }else if(keyCode == DOWN_ARROW){
        _lg("DOWN");
        snake._move(D_DOWN);
    }else if(keyCode == LEFT_ARROW){
        _lg("LEFT");
        snake._move(D_LEFT);
    }else if(keyCode == RIGHT_ARROW){
        _lg("RIGHT");
        snake._move(D_RIGHT);
    }
}
function tuchSwipe(swipeDir){
    if(swipeDir == 'up'){
        snake._move(D_UP);
    }else if(swipeDir == 'down'){
        snake._move(D_DOWN);
    }else if(swipeDir == 'left'){
        snake._move(D_LEFT);
    }else if(swipeDir == 'right'){
        snake._move(D_RIGHT);
    }
}

function drawHorizontalWall(){
    var gx = 1;
    var gy = 1;
    var gy2 = gy + 59;
    while(gx <= 30){
        drawSblock({gx:gx, gy:gy})
        drawSblock({gx:gx, gy:gy2})
        gx ++;
    }
}

function drawVerticalWall(){
    var gx = 1;
    var gx2 = gx + 29;
    var gy = 1;
    while(gy <= 60){
        drawSblock({gx:gx, gy:gy})
        drawSblock({gx:gx2, gy:gy})
        gy ++;
    }
}

function drawSblock(pnt){
    var x = pnt.gx - 1;
    var y = pnt.gy - 1;
    x *= 10; // x = x*10;
    y *= 10; //y = y*10;

    rect(x+1, y+1, 8, 8);
}


//----Function for debugging perpose
function _lg(msg){
    //console.log(msg);
}