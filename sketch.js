/*--------------------------------------------------------*/
var PLAY = 1;
var END = 0;
var WIN = 2;
var STOP = 4;

var lifes = 3;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var jungle, piso, invisiblejungle;

var obstaclesGroup, obstacle1;

var score=0;

var gameOver, restart;

function preload(){
  kangaroo_running =   loadAnimation("assets/frame-1.gif","assets/frame-2.gif","assets/frame-3.gif","assets/frame-4.gif","assets/frame-5.gif","assets/frame-6.gif","assets/frame-7.gif","assets/frame-8.gif","assets/frame-9.gif");
  kangaroo_collided = loadAnimation("assets/frame-1.gif");
  jungleImage = loadImage("assets/fondo.jpg");
  pisoImage = loadImage("assets/piso.jpg");
  examen = loadImage("assets/examen.png");
  libro = loadImage("assets/libro.png");
  lapiz = loadImage("assets/lapiz.png");
  celular = loadImage("assets/celular.png");
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
  jumpSound = loadSound("assets/jump.wav");
  collidedSound = loadSound("assets/collided.wav");
  hnImg = loadImage("assets/pngwing.com (4).png")
  hrImg = loadImage("assets/pngwing.com (5).png")
}
function setup() {
  createCanvas(800, 400);

  hn1= createSprite(20,20,20,20)
  hn1.addImage("negro",hnImg)
  hn1.scale=.05

  hn2= createSprite(50,20,20,20)
  hn2.addImage("negro",hnImg)
  hn2.scale=.05

  hn3= createSprite(80,20,20,20)
  hn3.addImage("negro",hnImg)
  hn3.scale=.05

  hr1= createSprite(20,20,20,20)
  hr1.addImage("rojo",hrImg)
  hr1.scale=.05

  hr2= createSprite(50,20,20,20)
  hr2.addImage("rojo",hrImg)
  hr2.scale=.05

  hr3= createSprite(80,20,20,20)
  hr3.addImage("rojo",hrImg)
  hr3.scale=.05

  jungle = createSprite(400,330,800,400);
  jungle.addImage("piso",pisoImage);
  jungle.scale= 0.35;
  jungle.x = width /2;

  kangaroo = createSprite(50,200,20,50);
  kangaroo.addAnimation("running", kangaroo_running);
  kangaroo.addAnimation("collided", kangaroo_collided);
  kangaroo.scale = 0.4;
  kangaroo.setCollider("circle",0,0,150)
    
  invisibleGround = createSprite(400,350,1600,10);
  invisibleGround.visible = false;

  gameOver = createSprite(400,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(550,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
  
  shrubsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;

}

function draw() {
  background(255);
  imageMode(CENTER); 
  image(jungleImage,400,200,800,400)
  
  kangaroo.x=camera.position.x-270;
   
  if (gameState===PLAY){

    jungle.velocityX=-3

    if(jungle.x<100)
    {
       jungle.x=400
    }

    if(keyDown("space")&& kangaroo.y>270) {
      jumpSound.play();
      kangaroo.velocityY = -16;
    }
  
    kangaroo.velocityY = kangaroo.velocityY + 0.8
    spawnShrubs();
    spawnObstacles();

    kangaroo.collide(invisibleGround);
    
    if(obstaclesGroup.isTouching(kangaroo)){
      collidedSound.play();
      
      if (lifes > 0) {
        lifes = lifes -1;
        if (lifes ===2) {
          hr3.visible= false;
        }
        if (lifes ===1) {
          hr2.visible= false;
        }
        if (lifes ===0) {
          hr1.visible= false;
        }


        gameState = STOP
        console.log("STOP")
        console.log(lifes)    
      } else if (lifes <= 0) {
        gameState = END;
        
        console.log("END")  
      }
    }
    if(shrubsGroup.isTouching(kangaroo)){
      score = score + 1;
      shrubsGroup.destroyEach();
    }
  }
  else if (gameState === END) {
    gameOver.x=camera.position.x;
    restart.x=camera.position.x;
    gameOver.visible = true;
    restart.visible = true;
    kangaroo.velocityY = 0;
    jungle.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    shrubsGroup.setVelocityXEach(0);

    kangaroo.changeAnimation("collided",kangaroo_collided);
    
    obstaclesGroup.setLifetimeEach(-1);
    shrubsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
        reset();
    }
  }

  else if (gameState === WIN) {
    jungle.velocityX = 0;
    kangaroo.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    shrubsGroup.setVelocityXEach(0);

    kangaroo.changeAnimation("collided",kangaroo_collided);

    obstaclesGroup.setLifetimeEach(-1);
    shrubsGroup.setLifetimeEach(-1);
  }
  else if (gameState===STOP) {
    restart.x=camera.position.x;
    restart.visible = true;
    kangaroo.velocityY = 0;
    jungle.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    shrubsGroup.setVelocityXEach(0);

    kangaroo.changeAnimation("collided",kangaroo_collided);
    
    obstaclesGroup.setLifetimeEach(-1);
    shrubsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();

  textSize(20);
  stroke(3);
  fill("black")
  text("Puntuación: "+ score, camera.position.x,50);
  
  if(score >= 10){
    kangaroo.visible = false;
    textSize(30);
    stroke(3);
    fill("black");
    text("¡Felicidades! ¡Ganaste el juego! ", 70,200);
    gameState = WIN;
  }
}

function spawnShrubs() {
 
  if (frameCount % 150 === 0) {

    var shrub = createSprite(camera.position.x+500,330,40,10);

    shrub.velocityX = -(6 + 3*score/100)
    shrub.scale = 0.6;

    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: shrub.addImage(examen);
              break;
      case 2: shrub.addImage(libro);
              break;
      case 3: shrub.addImage(lapiz);
              break;
      default: break;
    }
       
    shrub.scale = 0.13;
    shrub.lifetime = 400;
    
    shrub.setCollider("rectangle",0,0,shrub.width/2,shrub.height/2)
    shrubsGroup.add(shrub);
    
  }
  
}

function spawnObstacles() {
  if(frameCount % 120 === 0) {

    var obstacle = createSprite(camera.position.x+400,330,40,40);
    obstacle.setCollider("rectangle",0,0,200,200)
    obstacle.addImage(celular);
    obstacle.velocityX = -(6 + 3*score/100)
    obstacle.scale = 0.09; 
         
    obstacle.lifetime = 400;
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  kangaroo.visible = true;
  kangaroo.changeAnimation("running",
               kangaroo_running);
  obstaclesGroup.destroyEach();
  shrubsGroup.destroyEach();
  if (lifes <= 0) {
     score = 0;
     hr1.visible= true;
     hr2.visible= true;
     hr3.visible= true;
  }
 
   

 
}

