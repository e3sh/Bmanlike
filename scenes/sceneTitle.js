
class TitleScene extends Phaser.Scene {
  constructor() {
    super({key:"Title", active:false});
  }

  cursors;
  starttext;

  startf;

  preload() {}

  create() {
    this.add.text(20, 20, 'phaser3 funcion try/practice program ', { fontSize: '12px', fill: '#FFF' });
    this.add.text(400-120, 130, 'BombManLike', { fontSize: '40px', fill: '#FFF' });
    this.add.text(400-100, 200, 'MAKE PROJECT BASE', { fontSize: '24px', fill: '#FFF' });
    
    this.add.text(
      440, 288
      , 'player\n\ndoor\n\nenemy\n\nblocks'
      , { fontSize: '16px', fill: '#FFF' }
    );
    this.starttext = this.add.text(400-140, 450, 'push Space to Start', { fontSize: '32px', fill: '#FFF' });

    const spg = this.physics.add.group();
    
    const pl = spg.get(380,288,"sp_asset");
    pl.anims.play('down_p',true);
    pl.setScale(2,2);  

    const en = spg.get(380,288+64,"sp_asset");
    en.anims.play('down_e',true);
    en.setScale(2,2);  

    const b1 = spg.get(380-16,288+96,"sp_asset");
    b1.anims.play('bbox',true);
    b1.setScale(2,2);  

    const b2 = spg.get(380+16,288+96,"sp_asset");
    b2.anims.play('hboxt',true);
    b2.setScale(2,2);  

    const fl = spg.get(380,288+32,"sp_asset");
    fl.anims.play('flag',true);
    fl.setScale(2,2);  

    this.cursors = this.input.keyboard.createCursorKeys();

    this.startf = false;

    this.cameras.main.fadeIn(240, 0, 0, 0);
  }

  update() {

    if (this.cursors.space.isDown && !this.startf) {
      this.starttext.setText("= Wait a morment =");
      this.startf = true;
      //this.starttext.setVisible(false);
      this.cameras.main.fadeOut(500, 0, 0, 0);
      // このシーンが完全にフェードアウトしてから次のシーンをstartする
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        this.scene.start("GameMain");
      });
      //this.scene.start("GameMain");
    }
  }
}