function gObjectEnemyRd(scene, x, y){

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

  let route;
  let routeresult;
  let stepCount;

  let nextr; 

  let gamemain;
  let tween;

  const WAIT = scene.GAMECONFIG.ENEMY.WAIT;

  this.create = ()=>{

    sprite = mobs.get(x, y, "enemy");
    sprite.setCollideWorldBounds(true);
    sprite.setSize(16,16).setOffset(0,0);
    //sprite.setCircle(10);

    this.gameobject = sprite;
    sprite.anims.play('popup_e',true);   

    growcount = 0;

    route = [];
    //route[0] = new routecheck(scene.maze,0);
    //route[1] = new routecheck(scene.maze,1);

    routeresult = [];
  }
  this.create();

  this.destroy =()=>{}

  this.reborn = ()=>{
    //console.log("reborn" + sprite.x + "," + sprite.y);
    const bplist  = scene.maze.blockposlist();
    const fllist = scene.maze.blockposlist(BG.FLAG);
    //console.log("st FL"+fllist.length + "  BP"+bplist.length);

    //check flag area 3*3
    let cblist = [];
    if (fllist.length > 0){
      for (let i in bplist){
        if ((Math.abs(fllist[0].x - bplist[i].x)>1)||
        (Math.abs(fllist[0].y - bplist[i].y)>1)){
          cblist.push(bplist[i]);
        }
        //check func 3*3
      }
      //console.log("s FL"+fllist.length + " BL:"+cblist.length + "/" + bplist.length);
      for (let i in cblist){
        //effectbreak(cblist[i].x*16+8, cblist[i].y*16+8);
      }
    }
    if (cblist.length > 0){
      let num = Phaser.Math.Between(0, cblist.length-1);
      let bp = cblist[num];  
      layer.putTileAt(BG.FLOOR,bp.x,bp.y);
      //scene.toptile.removeTileAt(bp.x, bp.y);

      sprite.x = bp.x*16+8;
      sprite.y = bp.y*16+8;
      effectbreak(sprite.x, sprite.y);
    }else{
      sprite.x = Phaser.Math.Between(1, BG.MAP_W-2)*16+8;
      sprite.y = Phaser.Math.Between(1, BG.MAP_H-2)*16+8;
    }
    sprite.setVisible(true);
    sprite.anims.play('left_e',true);   
    growcount = -120;
    sprite.setVelocityX(0);
    sprite.setVelocityY(0);
    sprite.setVisible(true);
    //sprite.isCircle = true;
    sprite.clearTint();

    gamemain = scene.scene.get("GameMain");

    nextr = {x: Math.trunc((sprite.x+8)/16), y:Math.trunc((sprite.y+8)/16), vx:0, vy:0 };
    routeresult = [];
  }

  this.update = ()=>{

    if (!this.active) return;

    if ("deadstate" in sprite){
      if (!sprite.deadstate) return; 
      growcount = -120;
      if ((Math.abs(sprite.body.velocity.x)<1)
        &&(Math.abs(sprite.body.velocity.y)<1)) {
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

    let mvmode = {anim:"", type:false, vx:0, vy:0};
    let inputc = {
      left:{isDown: false},
      right:{isDown: false},
      up:{isDown: false},
      down:{isDown: false},
    }

    growcount++;
    if (growcount > WAIT){

      inputc = {
        left:{isDown: (Math.random()*10>3)?true:false},
        right:{isDown: (Math.random()*10>6)?true:false},
        up:{isDown: (Math.random()*10>3)?true:false},
        down:{isDown: (Math.random()*10>6)?true:false},
      }
      growcount = 0;
      

      if (inputc.left.isDown){
        mvmode.anim = 'left_e';
        mvmode.type = true;
        mvmode.vx =-1;
      }
      if (inputc.right.isDown){
        mvmode.anim = 'right_e';
        mvmode.type = true;
        mvmode.vx =1;
      }
      if (inputc.up.isDown){
        mvmode.anim = 'up_e';
        mvmode.type = true;
        mvmode.vy =-1;
      }
      if (inputc.down.isDown){
        mvmode.anim = 'down_e';
        mvmode.type = true;
        mvmode.vy =1;
      }

      if (mvmode.type){
        sprite.setVelocityX(mvmode.vx*30);
        sprite.setVelocityY(mvmode.vy*30);
        if (Boolean(mvmode.anim)){
          sprite.anims.play(mvmode.anim, true);
        }
          
      }else{
          //sprite.setVelocityX(0);
          //sprite.setVelocityY(0);
      }
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



