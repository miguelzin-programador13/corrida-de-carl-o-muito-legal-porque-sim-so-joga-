class Game {
    constructor() {
        this.resetTitle = createElement("h2");
        this.resetButton = createButton("");

        this.leadeboardTitle = createElement("h2");

        this.leader1 = createElement("h2");
        this.leader2 = createElement("h2");
    }

    getState() {
        var gameStateRef = database.ref("gameState");
        gameStateRef.on("value", function (data) {
            gameState = data.val();
        });
    }
    update(state) {
        database.ref("/").update({
            gameState: state,
        });
    }
    start() {
        player = new Player();
        playerCount = player.getCount();

        form = new Form();
        form.display();

        car1 = createSprite(width / 2 - 300, height - 100);
        car1.addImage("car1", car1_img);
        car1.scale = 0.07;

        car2 = createSprite(width / 2 - 100, height - 100);
        car2.addImage("car2", car2_img);
        car2.scale = 0.07;

        car3 = createSprite(width / 2 + 200, height - 100);
        car3.addImage("car3", car3_img);
        car3.scale = 0.17;

        car4 = createSprite(width / 2 + 70, height - 100);
        car4.addImage("car4", car4_img);
        car4.scale = 0.1;

        cars = [car1, car2, car3, car4];
    }

    handleElements() {
        form.hide();
        form.titleImg.position(40, 50);
        form.titleImg.class("gameTitleAfterEffect");

        //C39
        this.resetTitle.html("Reinicar Jogo");
        this.resetTitle.class("resetText");
        this.resetTitle.position(width / 2 + 200, 40);

        this.resetButton.class("resetButton");
        this.resetButton.position(width / 2 + 230, 100);

        this.leadeboardTitle.html("Placar");
        this.leadeboardTitle.class("resetText");
        this.leadeboardTitle.position(width / 3 - 60, 40);

        this.leader1.class("leadersText");
        this.leader1.position(width / 3 - 50, 80);

        this.leader2.class("leadersText");
        this.leader2.position(width / 3 - 50, 130);
    }

    play() {
        this.handleElements();
        this.handleResetButton();
        Player.getPlayersInfo();

        if (allPlayers !== undefined) {
            image(track, 0, -height * 5, width, height * 6);

            //índice da matriz
            var index = 0;
            for (var plr in allPlayers) {
                //adicione 1 ao índice para cada loop
                index = index + 1;

                //use os dados do banco de dados para exibir os carros nas direções x e y
                var x = allPlayers[plr].positionX;
                var y = height - allPlayers[plr].positionY;

                cars[index - 1].position.x = x;
                cars[index - 1].position.y = y;

                if (index === player.index) {
                    stroke(10);
                    fill("silver");
                    ellipse(x, y, 60, 60);

                    //alterar a posição da câmera na direção y

                    camera.position.y = cars[index - 1].position.y;
                }
            }

            this.handlePlayerControls();

            drawSprites();
        }
    }
    handleResetButton() {
        this.resetButton.mousePressed(() => {
            database.ref("/").set({
                playerCount: 0,
                gameState: 0,
                players: {},
            });
            window.location.reload();
        });
    }
    handlePlayerControls() {
        // manipulando eventos de teclado
        if (keyIsDown(UP_ARROW)) {
            player.positionY += 10;
            player.update();
        }
        if (keyIsDown(DOWN_ARROW)) {
            player.positionY -= 10;
            player.update();
        }
        if (keyIsDown(LEFT_ARROW)&&player.positionX>width/3-50) {
            player.positionX -= 10;
            player.update();
        }
        if (keyIsDown(RIGHT_ARROW)&&player.positionX<width/2+300) {
            player.positionX += 10;
            player.update();
        }
    }
}