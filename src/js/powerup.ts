import { GameObject } from './gameObject';
import { Vector } from './vector';
import { GameEngine } from './index';
import { Ball } from './ball';

export class Powerup implements GameObject {
    public position: Vector;    
    public get centerPoint(): Vector { return new Vector(this.position.x + (this.width / 2), this.position.y + (this.height / 2))};
    public height: number;
    public width: number;
    private size: number = 20;
    private gameEngine: GameEngine;
    public powerupType: PowerupType;


    constructor(position: Vector, gameEngine: GameEngine)
    {
        this.position = position;
        this.height = this.size;
        this.width = this.size;
        this.gameEngine = gameEngine;
        this.powerupType = GameEngine.getRndInteger(1, 4.9);
    }

    onColliosion(other: GameObject): void {
        // only activates if hit by a ball
        if(other instanceof Ball){
            this.gameEngine.objects.splice(this.gameEngine.objects.indexOf(this), 1);

            switch(this.powerupType){
                // increase speed of all balls 10 times
                case PowerupType.speed:{
                    this.gameEngine.balls.forEach(element => {
                        element.speed += 10 * element.initialSpeed;
                    });
                    break;
                }
                // shift players position
                case PowerupType.reverse:{
                    let playeroneID: number = this.gameEngine.players[0].playerId;
                    this.gameEngine.players[0].playerId = this.gameEngine.players[1].playerId;
                    this.gameEngine.players[1].playerId = playeroneID;
                    break;
                }
                // adds a new ball to the game at a random position
                case PowerupType.addBall:{
                    let newBall: Ball = new Ball(
                        new Vector(
                            GameEngine.getRndInteger(200, 800), 
                            GameEngine.getRndInteger(200, 300)
                        ), 
                        this.gameEngine, 
                        new Vector(Math.random() * 4  - 2, Math.random() * 4  - 2)
                    )
                    this.gameEngine.balls.push(newBall);
                    this.gameEngine.objects.push(newBall);
                    break;
                }
                // remove ball that takes powerup from list og balls and list og gameobjects
                // only if there is more than 1 ball in the game
                case PowerupType.removeBall:{
                    if(this.gameEngine.balls.length > 1){   
                        this.gameEngine.balls.splice(this.gameEngine.balls.indexOf(other), 1);
                        this.gameEngine.objects.splice(this.gameEngine.objects.indexOf(other), 1);
                    }
                }
            }
        }
        
    }

    update(time: number): void {
        
    }
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = '#890404'
        ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
    }
}
export enum PowerupType { 'speed' = 1, 'reverse', 'addBall', 'removeBall' }