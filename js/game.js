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
var winAudio;
var gameOver = false;
var flipFlop2 = false, flipFlop1 = false;

function preload() {
    this.load.audio('shoot', './assets/audio/shoot_cutted.mp3');
    this.load.audio('win', './assets/audio/win.mp3');
    this.load.image('sky', './assets/sky.png');
    this.load.image('ground', './assets/platform.png');
    this.load.image('vertical', './assets/vertical.png');
    this.load.image('star', './assets/star.png');
    this.load.image('bomb', './assets/bomb.png');
    this.load.image('projectile', './assets/projectile.png');
    this.load.spritesheet('dude', './assets/smaller.png', {frameWidth: 117, frameHeight: 108});
}

function createPlatforms() {
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(1200, 568, 'ground').setScale(2).refreshBody();
    platforms.create(760, 600, 'vertical');
    platforms.create(600, 400, 'ground');
    platforms.create(900, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(1450, 250, 'ground');
    platforms.create(750, 220, 'ground');
}

function createPlayer(game, x, y) {
    player = game.physics.add.sprite(x, y, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.body.setSize(100, 70);
    return player;
}

function addKeys() {
    upButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    shootButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
    leftButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    rightButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
}

function createAnimations() {
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
}

function addCollidersAndGravity() {
    this.physics.add.collider(player2, platforms);
    player2.body.setGravityY(300);
    this.physics.add.collider(player1, platforms);
    player1.body.setGravityY(300);
    bombs = this.physics.add.group();
    this.physics.add.collider(player2, spits, hitBomb, null, this);
    this.physics.add.collider(player1, spits, hitBomb, null, this);
    this.physics.add.collider(spits, platforms, dissappear, null, this);
    this.physics.add.collider(player1, player2);
}

function create() {
    shootAudio = this.sound.add('shoot');
    winAudio = this.sound.add('win');
    this.add.image(400, 300, 'sky');
    this.add.image(1200, 300, 'sky');
    scoreText1 = this.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000'});
    scoreText2 = this.add.text(1350, 16, 'score: 0', {fontSize: '32px', fill: '#000'});
    finalText = this.add.text(750, 300, '', {fontSize: '32px', fill: '#000'});
    platforms = this.physics.add.staticGroup();
    spits = this.physics.add.group();
    cursors = this.input.keyboard.createCursorKeys();

    createPlatforms();

    player1 = createPlayer(this, 100, 450);
    player2 = createPlayer(this, 1400, 450);
    addKeys.call(this);
    createAnimations.call(this);
    addCollidersAndGravity.call(this);
}

function shootProjectile(player) {
    var flipFlop;
    if (player == player1) {
        flipFlop = flipFlop1;
    }
    else {
        flipFlop = flipFlop2;
    }
    if (!flipFlop) {
        if (player == player1) {
            flipFlop1 = true;
        }
        else {
            flipFlop2 = true;
        }
        player.anims.play('spitCharacter', true);
        shootAudio.play();
        var bomb;
        if (player.flipX == 0) {
            bomb = spits.create(player.x, player.y, 'projectile');
            bomb.flipX = -1;
            bomb.setVelocity(-1000, 0);
        }
        else {
            bomb = spits.create(player.x, player.y, 'projectile');
            bomb.flipX = 0;
            bomb.setVelocity(1000, 0);
        }
        bomb.allowGravity = false;
        bomb.body.setGravity(0);
        bomb.setCollideWorldBounds(false);

        if (player == player1) {
            sleep(1500).then(function () {
                flipFlop1 = false;
            });
        }
        else {
            sleep(1500).then(function () {
                flipFlop2 = false;
            });
        }
    }
}

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
        shootProjectile(player2);
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
        shootProjectile(player1);
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
    winAudio.play();
    if (player == player1) {

        score2 += 1;
        scoreText2.setText('Score: ' + score2);
        finalText.setText('Player 2 won!');
        player2.anims.play('spitCharacter');
        player2.anims.play('spitCharacter');
        player2.anims.play('spitCharacter');
        player2.anims.play('spitCharacter');
        player2.anims.play('spitCharacter');
        player2.anims.play('spitCharacter');
    }
    else {
        score1 += 1;
        scoreText1.setText('Score: ' + score1);
        finalText.setText('Player 1 won!');
        player1.anims.play('spitCharacter');
        player1.anims.play('spitCharacter');
        player1.anims.play('spitCharacter');
        player1.anims.play('spitCharacter');
        player1.anims.play('spitCharacter');
        player1.anims.play('spitCharacter');
    }
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
}

function dissappear(spit, platform) {
    spit.disableBody(true, true);
}

function sleep(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

