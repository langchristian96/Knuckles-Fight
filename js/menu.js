var MenuScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function MenuScene() {
            Phaser.Scene.call(this, {key: 'menuScene'});
        },

    create: function () {
        var namedLabel = this.add.text(300, 80, 'Knuckles Fight! Press on the screen to start', {
            font: '50px Arial',
            fill: '#ffffff'
        })
        this.input.once('pointerdown', function (event) {

            console.log('Starting game');

            this.scene.start('playScene');

        }, this);
    }

});
