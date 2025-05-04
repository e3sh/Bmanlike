
class loadScene extends Phaser.Scene {
  constructor() {
    super({key:"Load", active:true});
  }

  preload() {
    this.load.image("bg_asset", "assets/Bomberman.png");
    this.load.image('ascfont', 'assets/aschr.png');
    this.load.image('SPBG', 'assets/SPPTN.png');

    this.load.spritesheet('sp_asset', 'assets/Bomberman.png', { frameWidth: 16, frameHeight: 16 });

    this.load.audio("push", ["assets/push.mp3"]);
    this.load.audio("pop", ["assets/pop.mp3"]);
    this.load.audio("break", ["assets/break.mp3"]);
    this.load.audio("clear", ["assets/clear.mp3"]);
    this.load.audio("bow", ["assets/08bow.mp3"]);
    this.load.audio("use", ["assets/10use.mp3"]);
    this.load.audio("get", ["assets/11hit.mp3"]);
    this.load.audio("damage", ["assets/12damage.mp3"]);
    this.load.audio("miss", ["assets/05miss.mp3"]);
    this.load.audio("powup", ["assets/14powup.mp3"]);
    this.load.audio("bomb", ["assets/13bomb.mp3"]);

    this.load.start();
  }

  create() {

    this.cache.bitmapFont.add(
      'font', Phaser.GameObjects.RetroFont.Parse(
        this,{
          image: 'ascfont',
          width: 8,
          height: 8,
          offset: { x: 0, y: 0 },
          chars: Phaser.GameObjects.RetroFont.TEXT_SET1,
          charsPerRow: 16,
          spacing: { x: 0, y: 0 }
        }
      )
    );

    this.cache.bitmapFont.add(
      'pcgfont', Phaser.GameObjects.RetroFont.Parse(
        this,{
          image: 'SPBG',
          width: 16,
          height: 16,
          offset: { x: 0, y: 0 },
          chars: Phaser.GameObjects.RetroFont.TEXT_SET1,
          charsPerRow: 16,
          spacing: { x: 0, y: 0 }
        }
      )
    );

    setupAnims( this );

    this.add.text(0, 0, 'Loading...', { fontSize: '16px', fill: '#FFF' });
  }

  update() {
    //this.scene.start("GameMain");
    this.scene.start("Title");
  }
}