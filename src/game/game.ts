import 'pixi.js';
import { Vector } from '../physics/vector';
import { VectorDna } from '../genetics/vectorDna';
import { Rocket } from './rocket';
import { Population } from '../genetics/population';
import { Obstacle } from './obstacle';

export class Game {
    renderer: PIXI.WebGLRenderer;
    stage = new PIXI.Container();
    obstacles: Obstacle[];
    target: Vector;
    rockets: Rocket[];
    population: Population<Vector[], VectorDna>;

    public init(obstacleNumber: number, rocketNumber: number, targetPositon: Vector, rendererSize: { height: number, width: number }, rocketLifeSpan: number) {
        this.renderer = new PIXI.WebGLRenderer(rendererSize.width, rendererSize.height, { antialias: false, transparent: false });
        document.body.appendChild(this.renderer.view);
        this.generateBackground(this.stage);
        this.obstacles = this.generateObstacles(obstacleNumber);
        this.target = targetPositon;
        this.generateTargetSprite();
        this.rockets = this.generateRockets(rocketNumber, rocketLifeSpan);
        this.population = new Population<Vector[], VectorDna>(this.rockets.map(x => x.dna));
        this.gameLoop();
    }

    private resetRocket() {
        let newDnas = this.population.nextGeneration();
        let i = 0;
        this.rockets.forEach(rocket => {
            rocket.resetRocket(newDnas[i++]);
        });
    }

    private generateTargetSprite = (): Vector => {
        let targetGraph = PIXI.Sprite.fromImage('./moon.png');
        targetGraph.anchor.set(0.5, 0.5);
        targetGraph.x = this.target.x; targetGraph.y = this.target.y;
        this.stage.addChild(targetGraph);
        return this.target;
    }

    private generateRockets = (popSize: number, lifeSpan: number): Rocket[] => {
        let rockets: Rocket[] = []
        for (let i = 0; i < popSize; i++) {
            let dna = new VectorDna(this.generateDnaGenes(lifeSpan), this.target);
            let rocket = new Rocket(this.stage, dna, new Vector(this.renderer.width / 2, this.renderer.height));
            rockets.push(rocket);
        }
        return rockets
    }

    private generateDnaGenes = (lifeSpan: number) => {
        let genes = [];
        for (let i = 0; i < lifeSpan; i++) {
            genes[i] = Vector.random().mult(.2);
        }
        return genes;
    }


    private generateBackground = (stage: PIXI.Container) => {
        let landscapeTexture = PIXI.Texture.fromImage('./background.jpg');
        let texture2 = new PIXI.Texture(<any>landscapeTexture, new PIXI.Rectangle(0, 0, this.renderer.width, this.renderer.height));
        let background = new PIXI.Sprite(texture2);
        background.anchor.x = 0;
        background.anchor.y = 0;
        background.position.x = 0;
        background.position.y = 0;
        stage.addChild(background);
    }

    private generateObstacles = (size: number): Obstacle[] => {
        let obstacles = [];
        for (let i = 0; i < size; i++) {
            var x = Math.floor(Math.random() * this.renderer.width);
            var y = Math.floor(Math.random() * this.renderer.height);
            var radius = Math.floor(Math.random() * 40) + 20;
            obstacles.push(new Obstacle(this.stage, new Vector(x, y), radius));
        }
        return obstacles;
    }

    private gameLoop() {
        let needReset = false;
        this.rockets.forEach(rocket => {
            rocket.show();
            if (this.obstacles.some(obs => obs.checkColision(rocket.position))) {
                rocket.isCrashed = true;
            }

            if (rocket.position.x > this.renderer.width || rocket.position.x < 0 || rocket.position.y > this.renderer.height || rocket.position.y < 0) {
                rocket.isCrashed = true;
            }

            if (rocket.update(this.target)) {
                needReset = true;
            }
        });
        if (needReset) {
            this.resetRocket();
        }
        this.renderer.render(this.stage);
        requestAnimationFrame(() => this.gameLoop());
    }
}
