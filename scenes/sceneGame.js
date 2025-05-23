class GameScene extends Phaser.Scene {
    constructor() {
      super({key:"GameMain", active:false});

      this.GAMECONFIG = {
        INITALHP:3, //GameStartHP
        WAVEBONUS:0,//WaveChangeBonus
        XTALBONUS:5,//BoxLineBounus
        RESETCOST:30, //

        BG: {BLOCK:15,
          TOP:18, 
          BONUS:6, 
          FLOOR:0, 
          WALL:14, 
          FLAG:16, 
          BFLAG:17, 
          BMARK:12,

          HOME:18,
          BOX:34,

          ITEMP:{LOW:5, HIGH:23},

          MAP_W:35,//17,  MAP縦横幅は奇数である必要があります
          MAP_H:17 //17 
        },

        PLAYER:{SPEED:80, LAMP:2 }, //SLOW < FAST //move vector Default:60
        ENEMY:{ INITCOUNT:1, WAIT:30}   //FAST < SLOW //wait step   Default:30
      }
    }

    maze;
    dangeon;
    rf;

    player;   
    friends;
    bombs;
    blocks;
    mobs;
    fires;

    layer;
    itemlayer;
    toptile;
    infoLayer;

    inputc;

    seffect;
    //music;

    gText;

    stage;
    result;
    killcount;
    basehp;
    invitems;
    fielditemMax;

    wave;
    mapchange;

    goverf;
    endwait;

    xtalblockerr;

    zoom;

    bombinterval;

    preload() {

      //map create
      const MAP_W = this.GAMECONFIG.BG.MAP_W;
      const MAP_H = this.GAMECONFIG.BG.MAP_H;

      //const BGBLOCK = this.GAMECONFIG.BG.BLOCK;

      let level = [[]];
      //init 
      for (let i=0; i<MAP_H; i++){//y
        level[i] = [];
        for (let j=0; j<MAP_W; j++){//x
          level[i][j] = Phaser.Math.Between(0,39);//BGBLOCK;
        }
      }

      const map = this.make.tilemap({ data: level, tileWidth: 16, tileHeight: 16 });
      const tiles = map.addTilesetImage("bg_asset");//"bgtiles");
      this.layer = map.createLayer(0, tiles, 0, 0).setPipeline('Light2D');

      this.itemlayer =  map.createBlankLayer(1, tiles, 0, 0);//.setPipeline('Light2D');
      this.itemlayer.setDepth(0.1);

      this.toptile =  map.createBlankLayer(2, tiles, 0, 0).setPipeline('Light2D');
      this.toptile.setDepth(1);

      //for (let i=0; i< MAP_H; i++){
      //  for (let j=0; j< MAP_W; j++){
      //   this.toptile.putTileAt(this.GAMECONFIG.BG.TOP, j, i);            
      //  }
      //}

      //const tiles2 = map.addTilesetImage("SPBG");
      this.infolayer = map.createBlankLayer(3, tiles, 0, 0);
      this.infolayer.setDepth(2);

      this.infolayer.setVisible(false);


      //this.maze = new mazemake( this.layer, MAP_W, MAP_H, this.GAMECONFIG.BG);
      this.maze = new stageGen( this.layer, MAP_W, MAP_H, this.GAMECONFIG.BG);

      //this.maze.init();

      //this.dangeon =  new Dangeon(MAP_W, MAP_H);
      //this.dangeon.create(); 

      this.physics.world.setBounds(0, 0, (MAP_W-1)*16, (MAP_H-1)*16);

      //game object physics.sprite.body setup
      this.friends = this.physics.add.group();
      this.bombs = this.physics.add.group();
      this.mobs = this.physics.add.group();
      this.blocks = this.physics.add.group();
      this.fires = this.physics.add.group();
      
      this.blocks.children.iterate(function(child){
        child.setScale(1);
        child.anims.play("break");
      });

      this.effcts = this.physics.add.group();

      //BG collison
      //white 0 red +128 green +256 blue +384
      //

      //this.layer.setCollisionBetween(384, 384+95, true, false, this.layer); 
      this.layer.setCollisionBetween(14, 15, true, false, this.layer); 
      
      const blockstop = (p, b)=>{
        this.layer.putTileAtWorldXY(p.boxtype, p.x, p.y);
        if (p.boxtype == this.maze.BG.BLOCK){
          //this.toptile.putTileAtWorldXY(this.maze.BG.TOP, p.x, p.y);
        }
        if (p.boxtype == this.maze.BG.BONUS){
          //this.toptile.putTileAtWorldXY(this.maze.BG.BONUS, p.x, p.y);
        }
        this.seffect[1].play();
        p.destroy();
        //this.events.emit("layerChange");
      }
      
      this.physics.add.collider(this.blocks, this.layer, blockstop, null, this);

      //  Input Events
      this.inputc = this.scene.get("Input");//this.input.keyboard.createCursorKeys();

      // audio events
      this.seffect = [];

      this.seffect[ 0] = this.sound.add("push");
      this.seffect[ 1] = this.sound.add("pop");
      this.seffect[ 2] = this.sound.add("break");
      this.seffect[ 3] = this.sound.add("clear");
      this.seffect[ 4] = this.sound.add("use");
      this.seffect[ 5] = this.sound.add("get");
      this.seffect[ 6] = this.sound.add("bow");
      this.seffect[ 7] = this.sound.add("damage");
      this.seffect[ 8] = this.sound.add("miss");
      this.seffect[ 9] = this.sound.add("powup");
      this.seffect[10] = this.sound.add("bomb");
      
      //this.music = this.sound.add("bgm");
    
        //camera setup
      this.cameras.main.setViewport((800-640)/2,48,640,600-48);

      this.zoom = 2.0

      this.cameras.main.zoom = this.zoom;
      //this.cameras.main.centerOn(132, 150);
      this.cameras.main.setBounds(
        0,
        0,
        MAP_W*16,
        MAP_H*16
        //this.game.canvas.width-16,
        //this.game.canvas.height
      );
      this.cameras.main.fadeIn(500, 0, 0, 0);
      
      //collision setting
      const hitenemy = (p, b)=>{
        if ("deadstate" in b){
          if (!("BONUSreceived" in b)) this.basehp++;
          b.x = 0;
          b.y = 0;
          b.setVisible(false);
          this.seffect[4].play();
          b.BONUSreceived = true;
          //console.log("!");
          return;    
        } 

        if ("invincible" in p) return;
        if ("pausestate" in p){
          if (p.pausestate) return;
        }
        if (!Boolean(p.pausestate)){
          p.anims.play("kout_p");
          this.seffect[6].play();
          this.basehp--;
        }
        p.pausestate = true;
        this.timerOneShot = this.time.delayedCall(300, ()=>{
            p.pausestate = false;
            p.invincible = true;
          }, this
        );

        this.timerOneShot = this.time.delayedCall(500, ()=>{
            delete p.invincible; 
          }, this
        );
      }

      this.physics.add.collider(this.friends, this.mobs, hitenemy,null, this);
      //this.physics.add.overlap(this.friends, this.mobs, hitenemy,null, this);
      this.physics.add.collider(this.friends, this.layer);
      //this.physics.add.collider(this.friends, this.blocks);;
      this.physics.add.collider(this.bombs, this.layer);
      this.physics.add.collider(this.bombs, this.bombs);
      this.physics.add.collider(this.friends, this.bombs);
      this.physics.add.collider(this.mobs, this.bombs);

      //this.physics.add.overlap(this.fires, this.layer, (f, l)=>{f.destroy(); },null, this);
      this.physics.add.overlap(this.fires, this.bombs, (f, b)=>{b.bombexp = true;},null, this);

      //this.physics.add.collider(this.mobs, this.mobs);
      this.physics.add.collider(this.mobs, this.layer);

      const hitblock = (p, b)=>{
        if (!('deadstate' in p)){
          //p.setTint("0xff7f7f");
          this.killcount++;
          p.deadstate = true;

          //if ("tween" in p) p.tween.stop();
          p.setVelocityX(b.body.velocity.x);
          p.setVelocityY(b.body.velocity.y);
          
          /*
          this.timerOneShot = this.time.delayedCall(500, ()=>{
            const tween = this.tweens.add({
              targets: p,
              x: this.player.x,//b.x,
              y: this.player.y,//b.y,
              ease: "BounceOut",//'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
              duration: 250,
              repeat: 0,            // -1: infinity
              yoyo: false
            });
            tween.play();
            
          }, this
          );
          */
          p.anims.play("kout_e");
        }
      }

      this.physics.add.overlap(this.mobs, this.blocks, hitblock, null, this);
      this.physics.add.overlap(this.mobs, this.fires, hitblock, null, this);

      //[SCROLL config]
      //this.cameras.main.startFollow(this.player);
      //
      this.events.on("baseattack",()=>{
        this.basehp--;
        this.seffect[7].play();
        if (this.basehp<=0){
          let bf = this.maze.blockposlist(this.maze.BG.FLAG);
          if (bf.length >0){
            this.layer.putTileAt(this.maze.BG.BFLAG, bf[0].x, bf[0].y);
          }
        }
      });

      this.events.on("shutdown", ()=>{
        //this.events.removeAllListeners(); //NG

        this.events.removeListener("baseattack");
        this.events.removeListener("shutdown");
        //this.lights.removeLight(this.lamp);

        for (let i in this.wp){
          this.wp[i].destroy();
        }
      });
    }
 
    create() {
      //game running status
      this.rf = false;
      this.ft = 0;

      this.stage = 0;
      this.result = "...";

      this.wave = 1;
      this.mapchange = 0;

      //Game Moving Object setup
      this.wp = [];

      this.wp.push(new gObjectPlayer(this, (this.maze.MW/2+1)*16,(this.maze.MH/2+1)*16));
      this.player = this.wp[0].gameobject;
      //this.wp[0].active = false;
      //this.player.setSize(16,16);
      this.cameras.main.startFollow(this.player);
      this.lights.enable().setAmbientColor(0xFFFFFF);

      //  Our spotlight. 100px radius and white in color.
      //this.lamp = this.lights.addLight(180, 80, 100).setColor(0xffffff).setIntensity(2);
   

      for (let i=0; i<this.GAMECONFIG.ENEMY.INITCOUNT; i++){
        const w = new gObjectEnemyRd(this, 0, 0);
        w.gameobject.deadstate = true;
        w.gameobject.BONUSreceived = true;
        w.gameobject.setVisible(false);
        this.wp.push(w);
      }

      const w = new gObjectEnemyRt(this, 0, 0);
      w.gameobject.deadstate = true;
      w.gameobject.BONUSreceived = true;
      w.gameobject.setVisible(false);
      this.wp.push(w);

      const w2 = new gObjectEnemyWp(this, 0, 0);
      w2.gameobject.deadstate = true;
      w2.gameobject.BONUSreceived = true;
      w2.gameobject.setVisible(false);
      this.wp.push(w2);


      this.scene.launch("UI");
      this.scene.launch("Debug");

      this.killcount = 0;
      this.basehp = this.GAMECONFIG.INITALHP;

      this.invitems = [];
      this.fielditemMax = 0;

      this.goverf = false;

      this.bombinterval = 0;

      //this.music.setVolume(0.6);
      //this.music.play({volume:0.5, loop:true, rate:1.0});
      this.seffect[3].play();

    }

    ////======================
    update() {

      if (this.inputc.space){
        if (this.goverf && this.endwait){
          //Title Return;
          this.scene.stop("UI");
          this.scene.stop("Debug");
          this.scene.start("Title");//restart();
        }
      }

      if (this.inputc.pageup || this.inputc.pagedown){
        this.zoom -= (this.inputc.pageup)?0.1:0;
        this.zoom += (this.inputc.pagedown)?0.1:0;

        if (this.zoom < 1.0) this.zoom = 1.0;
        if (this.zoom > 3.0) this.zoom = 3.0;
        
        this.cameras.main.zoom = this.zoom;
      }

      if (this.rf) 
        for (let i in this.wp){
          
          if (Boolean(this.wp[i].living)){
            if (!this.wp[i].living){
              delete this.wp[i];                    
            }
          }

          this.wp[i].update();
        }
      
      let gt = this.layer.getTileAtWorldXY( this.player.x, this.player.y);
      if (gt.index != this.maze.BG.FLOOR){ 
        this.xtalblockerr = true;
        this.events.emit("popupPG");
      }else{
        this.xtalblockerr = false;
        this.events.emit("eracePG");
      }

      const restartStage = ()=>{

        this.toptile.setVisible(true);

        for (let i=0; i< this.maze.MH; i++){
          for (let j=0; j< this.maze.MW; j++){
            //this.toptile.putTileAt(this.maze.BG.TOP, j, i);            
          }
        }

        this.maze.init();
  
        for (let i in this.wp){
          this.wp[i].active = false;
          if (i != 0 && Boolean(this.wp[i].sprite)){
            this.wp[i].gameobject.deadstate = true;
            this.wp[i].gameobject.setVisible(false);
            //this.wp[i].gameobject.x = 0;
            //this.wp[i].gameobject.y = 0;
          }
        }

        this.player.x = (this.maze.MW/2)*16+8;
        this.player.y = (this.maze.MH/2)*16+8;
        delete this.player.invincible;
        this.player.body.checkCollision.none = true;

        this.mapchange++;

        this.goverf = false;
        this.endwait = false;

        this.layer.putTileAt(this.maze.BG.FLAG,
            Math.trunc(this.maze.MW/2)+1, Math.trunc(this.maze.MH/2)+5
          );

        //this.zkey.lock = false;

        for (let i in this.wp){this.wp[i].active = true;}

        const lamp = this.GAMECONFIG.PLAYER.LAMP;
        for (let i=-lamp; i<= lamp; i++){
          for (let j=-lamp; j<= lamp; j++){
            this.toptile.removeTileAtWorldXY(this.player.x + j*16, this.player.y + i*16);            
          }
        }

        this.rf = true;

        return;
      }
     
      if (this.rf){

        //this.result = "";//(this.killcount)?"KILL:"+this.killcount:"";//" lx:" + count_x + " ly:" +count_y;

        if (this.wave*3 <= this.killcount){
          this.wave++;  
          this.basehp += this.GAMECONFIG.WAVEBONUS; //wave clear bonus
          this.killcount = 0;
          this.result = "NEXTWAVE";
          this.seffect[3].play();
          this.events.emit("wavec");
          //if (this.wave > 3){
            const w = new gObjectEnemyRd(this, 0, 0);
            w.gameobject.deadstate = true;
            w.BONUSreceived = true;
            w.gameobject.setVisible(false);
            w.active = true;
            this.wp.push(w);
          //}
          let rate = 1.0 + (0.3/20)*this.wave;
          //this.music.setRate(rate);
        }

        const BG = this.maze.BG;
  
        if ((this.inputc.zkey)&&(this.bombinterval < game.getTime())){
          this.bombinterval = game.getTime()+300;

          if (this.xtalblockerr) {
            //if (this.basehp <= this.GAMECONFIG.RESETCOST) this.basehp += this.GAMECONFIG.RESETCOST;
            this.events.emit("eracePG");
            this.xtalblockerr = false;
          }
          /*
          if (this.basehp > this.GAMECONFIG.RESETCOST) {
            this.player.anims.play('ship_p',true);
            if (this.inputc.duration.z > 750){
              this.basehp -= this.GAMECONFIG.RESETCOST;
              this.player.anims.play('popup_p',true);
              this.seffect[2].play();
              this.result ="RESET";
              //this.maze.init();
              this.rf = false;
            }
          }
          */
          let gt = this.layer.getTileAtWorldXY(this.player.x, this.player.y);
          if (gt.index == BG.FLOOR){
            //const bl = this.layer.putTileAtWorldXY(BG.BMARK, this.player.x, this.player.y);
            //console.log(gt);
            const w = new gObjectBomb(this, 
              Math.trunc(this.player.x/16)*16+8,
              Math.trunc(this.player.y/16)*16+8
            );
            w.active = true;
            this.wp.push(w);

            //this.timerOneShot = this.time.delayedCall(3000, ()=>{
            //    bl.index = BG.FLOOR;
                //console.log(gt);
            //  }, this
            //);
          }
        }

        if (this.basehp <= 0){
          this.basehp = 0;
          this.result ="GAMEOVER";

          if (!this.goverf){
            this.wp[0].active = false;
            this.player.anims.play("kout_p");
            this.seffect[8].play();
            this.player.invincible = true;

            //this.music.stop();

            this.events.emit("gameover");

            this.timerOneShot = this.time.delayedCall(3000, ()=>{
            for (let i in this.wp){
                this.wp[i].active = false;
              }
              this.events.emit("retTitle");
              this.endwait = true;
            }, this
          );
          this.goverf = true;
          } else {
            this.player.invincible = true;
          }
        }

      } else restartStage();
    }
}
