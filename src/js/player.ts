import { Vector } from "./vector";
import { GameObject } from "./gameObject";
import { GameEngine } from "./index";
import { Ball } from "./ball";

export class Player implements GameObject
{   
    public playerId: number;
    public position:Vector
    public get centerPoint(): Vector {
        return new Vector(this.position.x + (this.width / 2), this.position.y + (this.height / 2));
    };
    private gameEngine:GameEngine;

    private speed:number = 160;
    public height:number = 60;
    public width:number = 5;
    public points: number = 0;

    constructor(position:Vector, gameEngine:GameEngine, id: number)
    {
        this.position = position;
        this.gameEngine = gameEngine;
        this.playerId = id; 
    }

    update(time: number): void {
        //testing for collisions with walls -> stop moving
        if (this.position.y < this.width)  {
            this.position.y = this.width;
            return;
        }
        else if (this.position.y > this.gameEngine.canvasHeight- this.height - this.width) {
            this.position.y = this.gameEngine.canvasHeight-this.height - this.width;
            return;
        }


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
        ctx.fillStyle = '#000000'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    onColliosion(other: GameObject): void {
        // not doing anything at the moment...
    }
}