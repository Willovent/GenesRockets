import 'pixi.js';
import { Vector } from './vector';
import { VectorDna } from './vectorDna';
import { Rocket } from './rocket';
import { Population } from './genetics/population';
import { Obstacle } from './obstacle';

var renderer = PIXI.autoDetectRenderer(800, 800, { backgroundColor: 0 });
document.body.appendChild(renderer.view);
let stage = new PIXI.Container();

var init = () => {
    generateBackground(stage);
    let obstacles = generateObstacles(stage, 10);
    let target = generateTarget(400, 70, stage);
    let rockets: Rocket[] = generateRockets(stage, target, 50);
    let population = new Population<Vector[], VectorDna>(rockets.map(x => x.dna));
    animate(rockets, obstacles, population, target);
};

let animate = (rockets: Rocket[], obstacles: Obstacle[], population: Population<Vector[], VectorDna>, target: Vector) => {
    let needReset = false;
    rockets.forEach(rocket => {
        rocket.show();
        if (obstacles.some(obs => obs.checkColision(rocket.position))) {
            rocket.isCrashed = true;
        }

        if (rocket.position.x > 800 || rocket.position.x < 0 || rocket.position.y > 800 || rocket.position.y < 0) {
            rocket.isCrashed = true;
        }

        if (rocket.update(target)) {
            needReset = true;
        }
    });
    if (needReset) {
        resetRocket(rockets, population);
    }
    renderer.render(stage);
    requestAnimationFrame(() => animate(rockets, obstacles, population, target));
}

let resetRocket = (rockets: Rocket[], population: Population<Vector[], VectorDna>) => {
    let newDnas = population.nextGeneration();
    let i = 0;
    rockets.forEach(rocket => {
        rocket.resetRocket(newDnas[i++]);
    });
}

let generateTarget = (x: number, y: number, stage: PIXI.Container): Vector => {
    let target = new Vector(x, y);
    let targetGraph = PIXI.Sprite.fromImage('./moon.png');
    targetGraph.anchor.set(0.5, 0.5);
    targetGraph.x = target.x; targetGraph.y = target.y;
    stage.addChild(targetGraph);
    return target;
}

let generateRockets = (stage: PIXI.Container, target: Vector, popSize: number): Rocket[] => {
    let rockets: Rocket[] = []
    for (let i = 0; i < popSize; i++) {
        let dna = new VectorDna(generateDnaGenes(), target);
        let rocket = new Rocket(stage, dna);
        rockets.push(rocket);
    }
    return rockets
}

let generateDnaGenes = () => {
    let genes = [];
    for (let i = 0; i < 300; i++) {
        genes[i] = Vector.random().mult(.2);
    }
    return genes;
}

let generateBackground = (stage: PIXI.Container) => {
    let landscapeTexture = PIXI.Texture.fromImage('./background.jpg');
    let texture2 = new PIXI.Texture(<any>landscapeTexture, new PIXI.Rectangle(0, 0, 800, 800));
    let background = new PIXI.Sprite(texture2);
    background.anchor.x = 0;
    background.anchor.y = 0;
    background.position.x = 0;
    background.position.y = 0;
    stage.addChild(background);
}

let generateObstacles = (stage: PIXI.Container, size: number): Obstacle[] => {
    let obstacles = [];
    for (let i = 0; i < size; i++) {
        var x = Math.floor(Math.random() * 800);
        var y = Math.floor(Math.random() * 800);
        var radius = Math.floor(Math.random() * 40) + 20;
        obstacles.push(new Obstacle(stage, new Vector(x, y), radius));
    }
    return obstacles;
}

init();