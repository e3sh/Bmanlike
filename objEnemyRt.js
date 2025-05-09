function gObjectEnemyRt(scene, x, y){

  let sprite;
  this.gameobject;

  this.active = false;

  let mobs = scene.mobs;;
  let layer = scene.layer;;
  let blocks = scene.blocks;
  let effcts = scene.effcts;

  let BG = scene.maze.BG;

  let seffect;

  let growcount;

  let gamemain;
  let tween;

  let moveparam;

  const WAIT = scene.GAMECONFIG.ENEMY.WAIT;

  this.create = ()=>{

    sprite = mobs.get(x, y, "enemy");
    sprite.setCollideWorldBounds(true);
    sprite.setSize(16,16).setOffset(0,0);
    //sprite.setCircle(10);

    this.gameobject = sprite;
    sprite.anims.play('wisp_e',true);   

    growcount = 0;
  }
  this.create();

  this.destroy =()=>{}

  this.reborn = ()=>{
    sprite.x = Phaser.Math.Between(1, BG.MAP_W-2)*16+8;
    sprite.y = Phaser.Math.Between(1, BG.MAP_H-2)*16+8;

    sprite.setVisible(true);
    sprite.anims.play('wisp_e',true);   
    growcount = -120;
    sprite.setVelocityX(0);
    sprite.setVelocityY(0);
    sprite.setVisible(true);
    //sprite.isCircle = true;
    sprite.clearTint();

    gamemain = scene.scene.get("GameMain");

    moveparam = {v:0, ox:0, oy:0, vx:0, vy:0, exc:false, ct:0 };
  }

  this.update = ()=>{

    const htbl = [
      {vx: 0, vy:-1, anm:"up_p"},
      {vx: 1, vy: 0, anm:"right_p"},
      {vx: 0, vy: 1, anm:"down_p"},
      {vx:-1, vy: 0, anm:"left_p"}
    ];

    if (!this.active) return;

    if ("deadstate" in sprite){
      if (!sprite.deadstate) return; 
      growcount = -120;
      if ((Math.abs(sprite.body.velocity.x)<2)
        &&(Math.abs(sprite.body.velocity.y)<2)) {
        sprite.setVelocityX(0);
        sprite.setVelocityY(0);
        sprite.deadstate = false;

        if (Boolean(tween))tween.stop();
        scene.timerOneShot = scene.time.delayedCall(3000, ()=>{
          delete sprite.deadstate;
          delete sprite.BONUSreceived; 
          sprite.setVisible(false);
          this.reborn();
          }, this
        );
      }
      return;
    }

    growcount++;
    if (true){//(growcount > 0){

      if ((Math.trunc(moveparam.ox) == Math.trunc(sprite.x)) 
        && (Math.trunc(moveparam.oy) == Math.trunc(sprite.y))){
        //sprite.setTint("0xff00ff");
        //console.log(".");//growcount
        growcount++;
      }else{
        moveparam.ox = Math.trunc(sprite.x);
        moveparam.oy = Math.trunc(sprite.y);
        growcount = 0;
      }

      let turnf = false;
      //if ((((sprite.x-8)%16)<1) && (((sprite.y-8)%16)<1)){
      if (growcount > 30){
        const gtf = layer.getTileAtWorldXY(
          sprite.x + htbl[moveparam.v].vx*9 , 
          sprite.y + htbl[moveparam.v].vy*9
        );
        const gtl = layer.getTileAtWorldXY(
          sprite.x + htbl[(moveparam.v+3)%4].vx*9, 
          sprite.y + htbl[(moveparam.v+3)%4].vy*9
        );
        const gtr = layer.getTileAtWorldXY(
          sprite.x + htbl[(moveparam.v+1)%4].vx*9, 
          sprite.y + htbl[(moveparam.v+1)%4].vy*9
        );

        const ff = (gtf.index != BG.FLOOR)?true:false; 
        const fl = (gtl.index != BG.FLOOR)?true:false; 
        const fr = (gtr.index != BG.FLOOR)?true:false; 

        let vv = 0;
        //if (ff && fl && fr) vv = 2;
        if (ff){
          if (fl){
            vv = (fr)? 2:1;
          }else{
            vv = -1;
            //vv = (fr)?-1:Phaser.Math.Between(1,3); 
          }
        }

        //if (moveparam.ct < game.getTime()){
          //moveparam.ct = game.getTime() + 1200;
          moveparam.v = (moveparam.v+vv+4)%4;
          //console.log("f:" + ff + "l:" + fl + "r:" + fr + "v:"+vv + "movep.v:" + moveparam.v);
          growcount -= 30;
        //}

        if (vv !=0) turnf = true;
      }
    
      if (turnf){
        //moveparam.v = (moveparam.v+3)%4;
        moveparam.vx = htbl[moveparam.v].vx;
        moveparam.vy = htbl[moveparam.v].vy;
        //sprite.setTint("0xff00000");
      }else{
        moveparam.vx = htbl[moveparam.v].vx;
        moveparam.vy = htbl[moveparam.v].vy;
        //sprite.clearTint();
        moveparam.exc = false;
      }
      moveparam.exc = true;
      
    }
    if (moveparam.exc){
      //if (moveparam.vx != 0) sprite.setVelocityX(moveparam.vx*30);
      //if (moveparam.vy != 0) sprite.setVelocityY(moveparam.vy*30);
      sprite.setVelocityX(moveparam.vx*50);
      sprite.setVelocityY(moveparam.vy*50);
      moveparam.exc = false;  
      //const an = ["right_p","down_p","left_p","up_p"];
      sprite.anims.play( htbl[moveparam.v].anm,true);  

    }else{
      sprite.setVelocityX(0);
      sprite.setVelocityY(0);
    }
    
  }
  
  function effectbreak(x,y){
    let box = effcts.get(x, y,"blocks");
      box.setCollideWorldBounds(false);
      box.setScale(1);
      box.setPushable(false);
      box.anims.play("break");
      box.on(Phaser.Animations.Events.ANIMATION_COMPLETE, ()=>{
        box.destroy();
    },this);
  }
} 



