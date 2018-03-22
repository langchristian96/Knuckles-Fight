var PlayScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function PlayScene() {
            Phaser.Scene.call(this, {key: 'playScene'});
        },

    preload: preload,

    create: create,

    update: update

});

var player2;
var player1;
var platforms;
var score1 = 0;
var scoreText1;
var score2 = 0;
var scoreText2;
var finalText;
var shootAudio;
var ctx = new AudioContext();
var gameOver = false;
var explosionEffect = {
    frequency: 16,
    decay: 1,
    type: 'sawtooth',
    dissonance: 50
};

function preload() {
    this.load.audio('shoot', './assets/audio/shoot_cutted.mp3')
    this.load.image('sky', './assets/sky.png');
    this.load.image('ground', './assets/platform.png');
    this.load.image('vertical', './assets/vertical.png');
    this.load.image('star', './assets/star.png');
    this.load.image('bomb', './assets/bomb.png');
    this.load.image('projectile', './assets/projectile.png');
    this.load.spritesheet('dude', './assets/smaller.png', {frameWidth: 117, frameHeight: 108});
}

function create() {
    // shootAudio = this.add.sound('shoot');
    this.add.image(400, 300, 'sky');
    this.add.image(1200, 300, 'sky');
    // this.sound.setDecodedCallback([ shootAudio ], start, this);
    scoreText1 = this.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000'});
    scoreText2 = this.add.text(1350, 16, 'score: 0', {fontSize: '32px', fill: '#000'});
    finalText = this.add.text(750, 300, '', {fontSize: '32px', fill: '#000'});
    platforms = this.physics.add.staticGroup();
    spits = this.physics.add.group();
    cursors = this.input.keyboard.createCursorKeys();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(1200, 568, 'ground').setScale(2).refreshBody();

    platforms.create(760, 600, 'vertical');
    platforms.create(600, 400, 'ground');
    platforms.create(900, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(1450, 250, 'ground');
    platforms.create(750, 220, 'ground');

    player2 = this.physics.add.sprite(1400, 450, 'dude');

    player2.setBounce(0.2);
    player2.setCollideWorldBounds(true);
    player2.body.setSize(100,70);

    player1 = this.physics.add.sprite(100, 450, 'dude');

    player1.setBounce(0.2);
    player1.setCollideWorldBounds(true);
    player1.body.setSize(100,70);


    upButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    shootButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
    leftButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    rightButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    this.anims.create({
        key: 'left',
        frames: [{key: 'dude', frame: 2}],
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{key: 'dude', frame: 2}],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: [{key: 'dude', frame: 2}],
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'spitCharacter',
        frames: this.anims.generateFrameNumbers('dude', {start: 0, end: 2}),
        frameRate: 10,
        repeat: -1
    });
    this.physics.add.collider(player2, platforms);
    player2.body.setGravityY(300);

    this.physics.add.collider(player1, platforms);
    player1.body.setGravityY(300);


    bombs = this.physics.add.group();
//
//        this.physics.add.collider(spits, platforms);


    this.physics.add.collider(player2, spits, hitBomb, null, this);
    this.physics.add.collider(player1, spits, hitBomb, null, this);
    this.physics.add.collider(spits, platforms, dissappear, null, this);
}

var flipFlop2, flipFlop1;

function update() {

    if (gameOver) {
        return;
    }

    if (cursors.left.isDown) {
        player2.setVelocityX(-160);
        player2.flipX = 0;
        player2.anims.play('left', true);
    }
    else if (cursors.right.isDown) {
        player2.setVelocityX(160);
        player2.flipX = -1;
        player2.anims.play('right', true);
    }
    else {
        player2.setVelocityX(0);

        player2.anims.play('turn');
    }

    if (shootButton.isDown) {


        player2.anims.play('spitCharacter', true);
//            shootAudio.play();
        if (!flipFlop2) {
            var bomb = spits.create(player2.x, player2.y, 'projectile');
//                bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            if (player2.flipX == 0) {
                bomb.setVelocity(-1200, 0);
            }
            else {

                bomb.setVelocity(1200, 0);
            }
            bomb.allowGravity = false;
            bomb.setCollideWorldBounds(false);
            flipFlop2 = true;
        }

    }


    if (leftButton.isDown) {
        player1.setVelocityX(-160);
        player1.flipX = 0;
        player1.anims.play('left', true);
    }
    else if (rightButton.isDown) {
        player1.setVelocityX(160);
        player1.flipX = -1;
        player1.anims.play('right', true);
    }
    else {
        player1.setVelocityX(0);

        player1.anims.play('turn');
    }

    if (cursors.space.isDown) {

        player1.anims.play('spitCharacter', true);
        //            shootAudio.play();
        if (!flipFlop1) {
            var bomb;
            if (player1.flipX == 0) {
                bomb = spits.create(player1.x, player1.y, 'projectile');
                //                bomb.setBounce(1);
//                    bomb.setCollideWorldBounds(true);
                bomb.setVelocity(-1000, 0);
            }
            else {
                bomb = spits.create(player1.x, player1.y, 'projectile');
                //                bomb.setBounce(1);
//                    bomb.setCollideWorldBounds(true);

                bomb.setVelocity(1000, 0);
            }
            bomb.allowGravity = false;
            bomb.setCollideWorldBounds(false);
            flipFlop1 = true;
        }

    }


    if (cursors.space.isUp) {
        flipFlop1 = false;
    }

    if (shootButton.isUp) {
        flipFlop2 = false;
    }

    if (cursors.up.isDown && player2.body.touching.down) {
        player2.setVelocityY(-530);
    }

    if (upButton.isDown && player1.body.touching.down) {
        player1.setVelocityY(-530);
    }

}

function hitBomb(player, bomb) {
    this.physics.pause();
    if (player == player1) {

        score2 += 1;
        scoreText2.setText('Score: ' + score2);
        finalText.setText('Player 2 won!');
    }
    else {
        score1 += 1;
        scoreText1.setText('Score: ' + score1);
        finalText.setText('Player 1 won!');
    }
//        player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
    var bla = this;
    sleep(3000).then(function () {

        spits.children.iterate(function (child) {

            child.disableBody(true, true);

        });
        finalText.setText('');
        gameOver = false;
        bla.physics.resume();

        player1.x = 100;
        player1.y = 450;
        player2.x = 1400;
        player2.y = 450;
    });
//        player
}

function dissappear(spit, platform) {
    spit.disableBody(true, true);
}

function sleep(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

