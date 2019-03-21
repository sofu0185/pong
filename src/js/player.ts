import { Vector } from "./vector";
import { GameObject } from "./gameObject";
import { GameEngine } from "./index";

export class Player implements GameObject
{   
    public playerId: number;
    public position:Vector 
    private gameEngine:GameEngine;

    private speed:number = 140;
    public height:number = 50;
    public width:number =10;

    constructor(position:Vector, gameEngine:GameEngine, id: number)
    {
        this.position = position;
        this.gameEngine = gameEngine;
        this.playerId = id;
    }

    update(time: number): void {
        if (this.gameEngine.playerKeys[this.playerId].downKey)
        {
            //move down
            this.position.y += time/1000 * this.speed 
        }
        if (this.gameEngine.playerKeys[this.playerId].upKey)
        {
            //move up
            this.position.y -= time/1000 * this.speed
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    onColliosion(other: GameObject): void {
        // not doing anything at the moment...
    }
}