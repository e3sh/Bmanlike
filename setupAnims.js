function setupAnims(scene){

    //if (scene.events.listenerCount("AnimSupComp")>0) return;
    

    
    //PLAYER
    scene.anims.create({ key: 'left_p',
        frames: scene.anims.generateFrameNumbers('sp_asset', { start: 36, end: 38 }),//{ frames:[36, 37, 38, 37]}),
        frameRate: 8, repeat: -1
    });
    scene.anims.create({ key: 'right_p',
        frames: scene.anims.generateFrameNumbers('sp_asset', { start: 42, end: 44 }),
        frameRate: 8, repeat: -1
    });
    scene.anims.create({ key: 'up_p',
        frames: scene.anims.generateFrameNumbers('sp_asset', { start: 45, end: 47 }),
        frameRate: 8, repeat: -1
    });
    scene.anims.create({ key: 'down_p',
        frames: scene.anims.generateFrameNumbers('sp_asset', { start: 39, end: 41 }),
        frameRate: 8, repeat: -1
    });
    /*
    scene.anims.create({ key: 'push_left_p',
        frames: scene.anims.generateFrameNumbers('sp_asset', { start: 6+128, end: 6+128 }),
        frameRate: 8, repeat: -1
    });
    scene.anims.create({ key: 'push_right_p',
        frames: scene.anims.generateFrameNumbers('sp_asset', { start: 6+128, end: 6+128 }),
        frameRate: 8, repeat: -1
    });
    scene.anims.create({ key: 'push_up_p',
        frames: scene.anims.generateFrameNumbers('sp_asset', { start: 6+128, end: 6+128 }),
        frameRate: 8, repeat: -1
    });
    scene.anims.create({ key: 'push_down_p',
        frames: scene.anims.generateFrameNumbers('sp_asset', { start: 6+128, end: 6+128 }),
        frameRate: 8, repeat: -1
    });
    */
    scene.anims.create({ key: 'popup_p',
        frames: scene.anims.generateFrameNumbers('sp_asset', { start: 93, end: 95 }),
        frameRate: 3, repeat: -1
    });
    scene.anims.create({ key: 'kout_p',
        frames: scene.anims.generateFrameNumbers('sp_asset', { start: 48, end: 55 }),
        frameRate: 4, repeat: 0
    });
    scene.anims.create({ key: 'bomb',
        frames: scene.anims.generateFrameNumbers('sp_asset', { start: 56, end: 58 }),
        frameRate: 6, repeat: -1
    });

    //ENEMY
    scene.anims.create({ key: 'left_e',
        frames: scene.anims.generateFrameNumbers('sp_asset', { start: 111, end: 113 }),
        frameRate: 8, repeat: -1
    });
    scene.anims.create({ key: 'right_e',
        frames: scene.anims.generateFrameNumbers('sp_asset', { start: 108, end: 110 }),
        frameRate: 8, repeat: -1
    });
    scene.anims.create({ key: 'up_e',
        frames: scene.anims.generateFrameNumbers('sp_asset', { start: 108, end: 110 }),
        frameRate: 8, repeat: -1
    });
    scene.anims.create({ key: 'down_e',
        frames: scene.anims.generateFrameNumbers('sp_asset', { start: 111, end: 113 }),
        frameRate: 8, repeat: -1
    });

    scene.anims.create({ key: 'wisp_e',
        frames: scene.anims.generateFrameNumbers('sp_asset', { frames:[120, 121, 122, 123]}),
        frameRate: 8, repeat: -1
    });

    scene.anims.create({ key: 'popup_e',
        frames: scene.anims.generateFrameNumbers('sp_asset', { start: 0, end: 5 }),
        frameRate: 3, repeat: 0
    });
    scene.anims.create({ key: 'kout_e',
        frames: scene.anims.generateFrameNumbers('sp_asset', { start: 114, end: 119}),
        frameRate: 2, repeat: -1
    });

    //BLOCKS
    scene.anims.create({ key: 'bbox',
        frames: scene.anims.generateFrameNumbers('sp_asset', { start: 62, end: 62 }),
        frameRate: 1, repeat: -1
    });
    scene.anims.create({ key: 'break',
        frames: scene.anims.generateFrameNumbers('sp_asset', { start: 63, end: 68 }),
        frameRate: 8, repeat: 0
    });
    scene.anims.create({ key: 'hbox',
        frames: scene.anims.generateFrameNumbers('sp_asset', { start: 61, end: 61 }),
        frameRate: 8, repeat: -1
    });
    scene.anims.create({ key: 'hboxt',
        frames: scene.anims.generateFrameNumbers('sp_asset', { start: 61, end: 61 }),
        frameRate: 8, repeat: -1
    });
    scene.anims.create({ key: 'flag',
        frames: scene.anims.generateFrameNumbers('sp_asset', { start: 69, end: 69 }),
        frameRate: 8, repeat: -1
    });

    //FIRE
    scene.anims.create({ key: 'fire_up',
        frames: scene.anims.generateFrameNumbers('sp_asset', { frames:[72, 73, 74, 75, 74, 73, 72]}),
        frameRate: 8, repeat: 0
    });
    scene.anims.create({ key: 'fire_down',
        frames: scene.anims.generateFrameNumbers('sp_asset', { frames:[80, 81, 82, 83, 82, 81, 80]}),
        frameRate: 8, repeat: 0
    });
    scene.anims.create({ key: 'fire_left',
        frames: scene.anims.generateFrameNumbers('sp_asset', { frames:[76, 77, 78, 79, 78, 77, 76]}),
        frameRate: 8, repeat: 0
    });
    scene.anims.create({ key: 'fire_right',
        frames: scene.anims.generateFrameNumbers('sp_asset', { frames:[84, 85, 86, 87, 86, 85, 84]}),
        frameRate: 8, repeat: 0
    });
    scene.anims.create({ key: 'fire_branch_h',
        frames: scene.anims.generateFrameNumbers('sp_asset', { frames:[96, 97, 98, 99, 98, 97, 96]}),
        frameRate: 8, repeat: 0
    });
    scene.anims.create({ key: 'fire_branch_w',
        frames: scene.anims.generateFrameNumbers('sp_asset', { frames:[100, 101, 102, 103, 102, 101, 100]}),
        frameRate: 8, repeat: 0
    });
    scene.anims.create({ key: 'fire_body',
        frames: scene.anims.generateFrameNumbers('sp_asset', { frames:[104, 105, 106, 107, 106, 105, 104]}),
        frameRate: 8, repeat: 0
    });

    //scene.events.on("AnimSupComp",()=>{},this);

}