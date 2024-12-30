export default class LoadingScene extends Phaser.Scene {
    constructor() {
        super('LoadingScene');
    }

    preload() {
        this.load.spritesheet('loading', 'assets/images/loader_spritesheet_1.png', {
            frameWidth: 64,  
            frameHeight: 64,
            endFrame: 9
        });
        this.load.image('logo','assets/images/logo.png');
    }
    
    create() {

        // this.add.image(100,100,'logo').setOrigin(0.5,0.5).setDisplaySize(100,100);

        const titleText = this.add.text(this.scale.width / 2 , this.scale.height / 2 - 80, 'Addition Scale', {
            fontSize: '30px Arial',
            fontStyle: "bold",
            color: 'black'
        }).setOrigin(0.5).setResolution(2);

        const loadingText = this.add.text(this.scale.width / 2 , this.scale.height / 2 + 65, 'LOADING', {
            fontSize: '15px Arial',
            color: 'black'
        }).setOrigin(0.5).setResolution(2);

        this.anims.create({
            key: 'falling',     
            frames: this.anims.generateFrameNumbers('loading', { start: 0, end: 9 }),
            frameRate: 10,        
            repeat: -1         
        });

        const fruit = this.add.sprite(this.scale.width / 2, this.scale.height / 2, 'fruitFall');
        fruit.play('falling');

        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.launch('GamePlayScene');



        });

        // this.cameras.main.fadeOut(1000); 
    }

    update() {
    }
}
