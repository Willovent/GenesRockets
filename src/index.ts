import 'pixi.js';
import { Vector } from './vector';
import { VectorDna } from './vectorDna';
import { Rocket } from './rocket';
import { Population } from './GeneticFramework/population';

var renderer = PIXI.autoDetectRenderer(800, 800, { backgroundColor: 0 });
document.body.appendChild(renderer.view);

var stage = new PIXI.Container();

let initPop: VectorDna[] = [];
let target = new Vector(400,100);
let targetGraph = new PIXI.Graphics();
targetGraph.beginFill(0xff0000);
targetGraph.drawCircle(0,0,10);
targetGraph.x = target.x; targetGraph.y = target.y;
stage.addChild(targetGraph);
let rockets: Rocket[] = []
let generateDnaGenes = () => {
    let genes = [];
    for (let i = 0; i < 200; i++) {
        genes[i] = Vector.random(2, 2).add(-1);
    }
    return genes
}
for (let i = 0; i < 200; i++) {
    let dna = new VectorDna(generateDnaGenes(),target);
    let rocket = new Rocket(stage, dna);
    initPop.push(dna);
    rockets.push(rocket);
    dna.position = rocket.position;
}

let population = new Population(initPop);

requestAnimationFrame(animate);
function animate() {
    let needReset = false;
    rockets.forEach(rocket => {
        rocket.show();
        if(rocket.update()){
            needReset = true;
        }
    });
    if(needReset){
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
        (<VectorDna>rocket.dna).position = rocket.position;
    });
}