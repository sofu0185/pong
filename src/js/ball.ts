import { Vector } from "./vector";
import { GameObject } from "./gameObject";
import { GameEngine } from "./index";
import { Player } from "./player";
import { Framerate } from "./framerate";
import { Powerup } from "./powerup";

export class Ball implements GameObject
{
    public height: number;
    public width: number;
    private gameEngine:GameEngine;
    public position:Vector;
    public direction:Vector;
    public speed:number = 80;
    public initialSpeed: number;
    private size:number= 20;
    private color: string = "white";
    public get centerPoint(): Vector {
        return new Vector(this.position.x + (this.width / 2), this.position.y + (this.height / 2));
    };

    constructor (position:Vector, gameEngine:GameEngine, direction:Vector)
    {
        this.position = position;
        this.direction = direction;//new Vector(0.7, 1);
        this.gameEngine = gameEngine;
        this.height = this.size;
        this.width = this.size;
        this.initialSpeed = this.speed;
    }

    // Update method takes care of all logic
    update(time: number): void {
        //testing for collisions with walls -> change direction
        if (this.position.x <=0) {
            this.direction.x *= -1;
            this.position.x = 0;
        }
        else if(this.position.x >= this.gameEngine.canvasWidth-this.size){
            this.direction.x *= -1;
            this.position.x = this.gameEngine.canvasWidth-this.size;
        }

        if (this.position.y <=0)  {
            this.direction.y *= -1;
            this.position.y = 0;
        }
        else if (this.position.y >= this.gameEngine.canvasHeight-this.size) {
            this.direction.y *= -1;
            this.position.y = this.gameEngine.canvasHeight-this.size;
        }

        //testing for Collision with any gameobject
        //this.gameEngine.objects.forEach(elegameobj => {
        //});

        // hard limit of 500 speed
        if(this.speed > 500)
            this.speed = 500;

        // slow ball down
        if(this.speed > this.initialSpeed)
            this.speed -= 20  * time / 1000;

        this.position.x += this.direction.x * this.speed * time/1000;
        this.position.y += this.direction.y * this.speed * time/1000;
    }
    
    // draw ball on canvas
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        // cirel is drawn from center, so x and y needs to be offset by the balls radius
        ctx.arc(this.position.x + this.size / 2, this.position.y + this.size / 2, this.size / 2, 0, 2 * Math.PI);
        ctx.fill();
        //ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
    }
    
    // in case of any collision this method is called
    onColliosion(other: GameObject): void {
        // reverse direction if ball collides with any object other than framerate
        if(!(other instanceof Framerate) && !(other instanceof Powerup))
        {
            if(other instanceof Ball){
                // change color of ball if it collides with another ball
                this.changeColor();

                // speed ball up if two ball going same direction hit each other
                if(other.direction.x > 0 && this.direction.x > 0){
                    if(this.position.x < other.position.x){
                        this.direction.x *= -1;
                    }
                    else 
                        this.speed += 5 * this.initialSpeed;
                        
                }
                else if(other.direction.x < 0 && this.direction.x < 0){
                    if(this.position.x > other.position.x){
                        this.direction.x *= -1;
                    }
                    else
                        this.speed += 5 * this.initialSpeed;
                }
                else 
                    this.direction.x *= -1;     
            }
            else
                this.direction.x *= -1;
        } 
    }

    changeColor(){
        if(this.color == "white")
            this.color = "blue";
        else if(this.color == "blue")
            this.color = "green";
        else
            this.color = "white";
    }
}