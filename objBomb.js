function gObjectBomb(scene, x, y){

  this.name = "bomb";

  let sprite;
  this.gameobject;

  this.active = false;
  this.living = true;

  let mobs = scene.mobs;;
  let bombs = scene.bombs;
  let layer = scene.layer;;
  let blocks = scene.blocks;
  let effcts = scene.effcts;
  let fires = scene.fires;

  let BG = scene.maze.BG;

  let growcount;
  let growtime;

  this.create = ()=>{

    sprite = bombs.get(x, y, "sp_asset");
    sprite.setCollideWorldBounds(true);
    sprite.setScale(1);

    this.gameobject = sprite;
    sprite.anims.play('bomb',true);   

    growcount = 0;
    growtime = game.getTime();
  }
  this.create();

  this.destroy =()=>{
    sprite.destroy();
    this.living = false;
    this.active = false;
  }

  this.reborn = ()=>{
    growcount = 0;
    sprite.setVelocityX(0);
    sprite.setVelocityY(0);
    sprite.setVisible(true);
    sprite.clearTint();
  }

  this.update = ()=>{

    if (!this.active) return;

    let trig = false;
    if ("bombexp" in sprite){
      if (sprite.bombexp){
        sprite.anims.play("popup_p");
        trig = true;
      }
    }

    let num = game.getTime()-growtime;
    if (num > 3000 || trig) {
      growtime += num;

      //sprite.deadstate = false;

      const ctrldata = [
        {x:  0, y:  0, arm:false, edge:"fire_body", branch:"fire_body"},
        {x:  0, y:-16, arm:true , edge:"fire_up",   branch:"fire_branch_h"},
        {x: 16, y:  0, arm:true , edge:"fire_right", branch:"fire_branch_w"},
        {x:  0, y: 16, arm:true , edge:"fire_down", branch:"fire_branch_h"},
        {x:-16, y:  0, arm:true , edge:"fire_left", branch:"fire_branch_w"}
      ];

      const armlength = 4;

      for (let i in ctrldata){
        let wx = sprite.x;
        let wy = sprite.y;

        let c = ctrldata[i];

        const spset = (c, x, y)=>{
          const f = fires.get(x, y, "sp_asset");
          f.setScale(1);
          f.setPushable(false);
          f.anims.play(c);
          f.on(Phaser.Animations.Events.ANIMATION_COMPLETE, ()=>{
            f.destroy();
          },this);

          const gt = layer.getTileAtWorldXY(x, y);

          if (gt.index == BG.BLOCK){
            layer.putTileAtWorldXY(BG.FLOOR,x, y);//BMARK?
            effectbreak(
              Math.trunc(x/16)*16+8,
              Math.trunc(y/16)*16+8
            );
          };
        }

        bomlevel = armlength;        
        if (c.arm){
          while( bomlevel>0){
            const gt = layer.getTileAtWorldXY(wx+c.x, wy+c.y);

            if (gt.index == BG.FLOOR || gt.index == BG.BMARK || gt.index == BG.BLOCK){
              let bupgti = gt.index;  
              if (bomlevel == 1){
                spset(c.edge, wx+c.x, wy+c.y);
              }else{
                spset(c.branch, wx+c.x, wy+c.y);
              }
              if (bupgti == BG.BLOCK) bomlevel = 1;
              //dexecf = true;
            }else{
              bomlevel =1;
            };

            wx += c.x;
            wy += c.y;

            bomlevel--;
          }
        }else{
          spset(c.edge, wx+c.x, wy+c.y);
        }
      }
      this.destroy();
      scene.seffect[10].play();
    }
  }
  
  function effectbreak(x,y){
    let box = effcts.get(x, y,"sp_asset");
      box.setCollideWorldBounds(false);
      box.setScale(1);
      box.setPushable(false);
      box.anims.play("break");
      box.on(Phaser.Animations.Events.ANIMATION_COMPLETE, ()=>{
        box.destroy();
    },this);
  }
} 



