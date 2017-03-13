import 'pixi.js';
import { Vector } from './vector';
import { VectorDna } from './vectorDna';
import { Rocket } from './rocket';
import { Population } from './GeneticFramework/population';

var renderer = PIXI.autoDetectRenderer(800, 800, { backgroundColor: 0 });
document.body.appendChild(renderer.view);

let generateTarget = (x: number, y: number): Vector => {
    let target = new Vector(x, y);
    let targetGraph = PIXI.Sprite.fromImage('./moon.png');
    targetGraph.anchor.set(0.5,0.5);
    targetGraph.x = target.x; targetGraph.y = target.y;
    stage.addChild(targetGraph);
    return target;
}

var landscapeTexture = PIXI.Texture.fromImage('./background.jpg');
// crop the texture to show just 100 px
var texture2 = new PIXI.Texture(<any>landscapeTexture, new PIXI.Rectangle(0, 0, 800, 800));

// new sprite
var background = new PIXI.Sprite(texture2);


background.anchor.x = 0;
background.anchor.y = 0;

background.position.x = 0;
background.position.y = 0;


let generateDnaGenes = () => {
    let genes = [];
    for (let i = 0; i < 300; i++) {
        genes[i] = Vector.random().mult(.2);
    }
    return genes;
}

var stage = new PIXI.Container();
stage.addChild( background );

let rockets: Rocket[] = [];
let target = generateTarget(400,70);

for (let i = 0; i < 15; i++) {
    let dna = new VectorDna(generateDnaGenes(), target);
    let rocket = new Rocket(stage, dna);
    rockets.push(rocket);
}

let population = new Population(rockets.map(x => x.dna));

requestAnimationFrame(animate);
function animate() {
    let needReset = false;
    rockets.forEach(rocket => {
        rocket.show();
        if (rocket.update()) {
            needReset = true;
        }
    });
    if (needReset) {
        resetRocket();
    }
    renderer.render(stage);
    requestAnimationFrame(animate);
}

let resetRocket = () => {
    let newDnas = population.nextGeneration();
    let i = 0;
    rockets.forEach(rocket => {
        rocket.resetRocket(newDnas[i++]);
    });
}

