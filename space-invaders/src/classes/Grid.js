import Invader from "./Invader.js";

class Grid {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        
        this.direction = "right";
        this.moveDown = false;

        this.invadersSpeed = 1;
        this.invaders = this.init();
    }
    
    // O método `init` cria uma matriz (array) de objetos `Invader`
    // que representa os inimigos no formato de grid.
    init() {
        // Array vazio para armazenar os objetos `Invader`.
        const arr = [];
        
        // Usa dois loops aninhados para percorrer linhas e colunas do Grid
        // com base nas propriedades `this.rows` e `this.cols` da instancia da classe.
        // Em cada iteracao, cria um novo objeto `Invader` passando para ele dois argumentos:
        // - Um objeto com as propriedades x e y para a posicao do invader na tela,
        // calculado conforme a posicao da coluna e linha multiplicada por valores fixos
        // (50 para colunas e 38 para linhas), acrescido de um deslocamente de 20 pixels para
        // ambos os eixos.
        // - A velocidade dos invasores, que é passada pela propriedade `this.invaderSpeed`.
        // Adiciona o novo objeto `Invader` criado ao array `arr`.
        // Após preencher todas as posicoes da grade com invasores, retorna o array `arr`
        // contendo todos os objetos `Invader`.
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const invader = new Invader(
                    {
                        x: col * 50 + 20,
                        y: row * 38 + 80,
                    },
                    this.invadersSpeed,
                ); 

                arr.push(invader);
            }   
        }

        return arr;
    }

    drawGrid(ctx) {
        this.invaders.forEach((invader) => {
            invader.drawInvader(ctx);
        });
    }

    update(playerStatus) {
        if (this.reachedRightEdge()) {
            this.direction = "left";
            this.moveDown = true;
        } else if (this.reachedLeftEdge()) {
            this.direction = "right";
            this.moveDown = true;
        }

        if (!playerStatus) this.moveDown = false;

        this.invaders.forEach((invader) => {
            if (this.moveDown) {
                invader.moveDown();
                invader.incrementInvaderSpeed(0.5);
                this.invadersSpeed = invader.speed;
            }

            if (this.direction === "right") {
                invader.moveRight();
            } else if (this.direction === "left") {
                invader.moveLeft();
            }
        });

        this.moveDown = false;
    }

    reachedRightEdge() {
        return this.invaders.some((invader) => {
           return invader.position.x + invader.width >= window.innerWidth; 
        });
    }

    reachedLeftEdge() {
        return this.invaders.some((invader) => {
           return invader.position.x <= 0; 
        });
    }

    getRandomInvader() {
        const index = Math.floor(Math.random() * this.invaders.length);
        return this.invaders[index];
    }

    restartGrid() {
        this.invaders = this.init();
        this.direction = "right";
    }
}

export default Grid;

