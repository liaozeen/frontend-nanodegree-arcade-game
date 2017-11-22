//在任意两个整数间随机返回一个整数
function getrandom(min,max){
    return Math.floor(Math.random()*(max-min+1))+min;
}

// 这是我们的玩家要躲避的敌人
var Enemy = function() {
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多

    this.x = -10;
    this.y = 83*getrandom(0,2)+55;
    this.speed = getrandom(100,400);  //
    // 敌人的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/enemy-bug.png';

};

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的

   this.x += dt*this.speed;
    if (this.x >= 505) {
        this.x = 0;
        this.y = 83*getrandom(0,2)+55;
        this.speed = getrandom(100,400);
    }
    checkCollision(this);

};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
//星星的属性和方法
var Star = function() {
    this.x = -10;
    this.y = 83*getrandom(0,2)+55;
    this.speed = getrandom(100,400);
    this.sprite = 'images/Star.png';

};
//更新星星的位置
Star.prototype.update = function(dt) {
    this.x += dt*this.speed;
    if (this.x >= 505) {
        this.x = 0;
        this.y = 83*getrandom(0,2)+55;
    }
    checkStarCollision(this);
};

Star.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
var Player = function(x,y){
    this.x = x;
    this.y = y;
    this.sprite = 'images/char-boy.png';  //玩家的初始图像
    this.score=0;       //记录分值
    this.starNum=0;     //记录吃掉的星星数量
    this.crushCount=0;  //记录剩余秒杀的次数

};

Player.prototype.update = function(dt){

};
//用于显示玩家和计分器
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.font="26px roboto";
    ctx.fillText("星星: " + this.starNum+ "         经验值："+this.score+"          剩余秒杀："+player.crushCount, 0, 30);
};
//控制玩家上下左右移动和检测玩家是否在对岸
Player.prototype.handleInput = function(movement){
    if(0<this.x){
        switch(movement){
        case 'left':this.x -=101;
    }};

      if(404>this.x){
        switch(movement){
        case 'right':this.x +=101;
    }};

     if(387>this.y){
        switch(movement){
        case 'down':this.y +=83;
    }};

     if(0<this.y){
        switch(movement){
        case 'up':this.y -=83;
    }};

    if(this.y<55){
        setTimeout(function(){
            alert("成功到达对面！");
            player.x=202;
            player.y=83*4+55;
        },100);

    }
};
//用于重置玩家的属性和方法
var resetPlayer=function(){
        player.x=202;
        player.y=83*4+55;
        player.starNum=0;
        player.score=0;
        player.sprite = 'images/char-boy.png';
};
//用于增加星星的数目，每增加5个星星就拥有3次杀死虫子的机会，还附带变装！
Player.prototype.addStarNum = function() {
    this.starNum += 1;
    if(this.starNum%5===0){
        if(this.starNum===5){
           alert("变装！\n\n拥有秒杀虫子的能力\n\n每吃掉5个星星就增加3次杀死虫子的机会");
        }
        this.sprite = 'images/char-cat-girl.png';
        this.crushCount+=3;
    }
};

// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面

//检测玩家和虫子的碰撞
var checkCollision = function (onEnemy) {
    if (player.y + 131 >= onEnemy.y + 90
        && player.x + 25 <= onEnemy.x + 88
        && player.y + 73 <= onEnemy.y + 135
        && player.x + 76 >= onEnemy.x + 11){
        if(player.sprite==='images/char-cat-girl.png' && player.crushCount>0){
            onEnemy.x=-1000;
            onEnemy.y = 83*getrandom(0,2)+55;
            onEnemy.speed = getrandom(100,400);
            player.crushCount-=1;
            player.score+=3;
            if(player.crushCount===0){
                player.sprite = 'images/char-boy.png';
            }
            }else{
                alert("老司机，慢点开！");
                resetPlayer();
            }
   }
};
//检测玩家和星星的碰撞
var checkStarCollision = function (onStar) {
    if (player.y + 131 >= onStar.y + 90
        && player.x + 25 <= onStar.x + 88
        && player.y + 73 <= onStar.y + 135
        && player.x + 76 >= onStar.x + 11){
        star.x = -1000;
        star.y = 83*getrandom(0,2)+55;
        star.speed = getrandom(100,400);
        player.addStarNum();
        player.score+=1;
   }
};
var allEnemies=[];
var star = new Star();
allEnemies.push(star);
for (var i = 0; 3 > i; i++) {
    var enemy=new Enemy();
    allEnemies.push(enemy);
}
var player= new Player(101*2,83*4+55);

// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
