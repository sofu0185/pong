import { GameObject } from "./gameObject";
import { Framerate } from "./framerate";
import { Vector } from "./vector";
import { Player } from "./player";
import { Ball } from "./ball";
import { Powerup, PowerupType } from "./powerup";

/*
    THis is the main PONG GAME script
*/

export class GameEngine
{
    // items in the game
    public balls:Ball[] = [];
    public players: Player[] = [];
 
    // canvas info
    public canvasWidth:number;
    public canvasHeight:number;

    // keep track of key states
    public playerKeys: { upKey:boolean, downKey:boolean }[];

    private canvas:HTMLCanvasElement;
    private ctx:CanvasRenderingContext2D;
    
    // array with all gameobjects in the game - If you want more objects in the game add them to this array!
    public objects:GameObject[] = new Array<GameObject>();

    // kepp track of time between loops
    private date: Date = new Date();
    private timeZero: number = this.date.getTime();
    private timeNow: number;

    constructor()
    {
        this.canvas = <HTMLCanvasElement> document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");

        this.canvas.width = 1000;
        this.canvas.height = 500;

        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;

        this.playerKeys = [{upKey: false, downKey: false}, {upKey: false, downKey: false}];

        // listen for keyboard input
        document.addEventListener('keyup', this.keyUp.bind(this));
        document.addEventListener('keydown', this.keyDown.bind(this));

        //ceate gameobjects
        this.objects.push(new Framerate(new Vector(10,10)));
        
        this.players.push(new Player(new Vector(10,10), this, 0));
        this.objects.push(this.players[0]);

        this.players.push(new Player(new Vector(this.canvasWidth - 15,10), this, 1));
        this.objects.push(this.players[1]);

        this.balls.push(new Ball(new Vector(this.canvasWidth/2, this.canvasHeight/2), this, new Vector(.7, .2)));
        this.objects.push(this.balls[0]);

        this.balls.push(new Ball(new Vector(this.canvasWidth/ 3, this.canvasHeight/2), this, new Vector(2, .2)));
        this.objects.push(this.balls[1])

        this.objects.push(new Powerup(new Vector(500, 60), this));

        setInterval(() => {
            let randNumb: number = GameEngine.getRndInteger(1, 100);

            if(randNumb > 90){
                this.objects.push(new Powerup(new Vector(GameEngine.getRndInteger(200, 800), GameEngine.getRndInteger(100, 400)), this))
            }
        }, 1000);

        this.gameLoop();
    }

    // keyboard event
    private keyDown(event:KeyboardEvent): void
    {
        if (event.repeat) {return};
        switch (event.key) {
            // player 1 up
            case "q":
                this.playerKeys[0].upKey = true;
                break;
            // player 1 down
            case "a":
                this.playerKeys[0].downKey = true;
                break;
            // player 2 up
            case "ArrowUp":
                this.playerKeys[1].upKey = true;
                break;
            // player 2 down
            case "ArrowDown":
                this.playerKeys[1].downKey = true;
                break;
        }
    }

    // keyboard event
    private keyUp(event: KeyboardEvent): void
    {
        switch (event.key) {
            // player 1 up
            case "q":
                this.playerKeys[0].upKey = false;
                break;
            // player 1 down
            case "a":
                this.playerKeys[0].downKey = false;
                break;
            // player 2 up
            case "ArrowUp":
                this.playerKeys[1].upKey = false;
                break;
            // player 2 down
            case "ArrowDown":
                this.playerKeys[1].downKey = false;
                break;
        }  
    } 
    
    // a very good explanation of how rectangular collision works: https://silentmatt.com/rectangle-intersection/
    private Collide(a:GameObject, b:GameObject): boolean {
        if (a.position.x < (b.position.x+b.width) &&
            (a.position.x+a.width) > b.position.x &&
            a.position.y < (b.position.y+b.height) &&
            a.position.y+a.height > b.position.y)
            {
                return true;
            }
        
    }

    // the main game loop
    private gameLoop()
    {
        // clear the screen in every update
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

        this.date = new Date();
        this.timeNow = this.date.getTime()
        var time = this.timeNow-this.timeZero;
        this.timeZero=this.timeNow;

        // run throght all objects
        this.objects.forEach(element => {
            //all objects are testeted for collisions on all objects
            this.objects.forEach(other => {  
                if (element !== other)
                {
                    if (this.Collide(element, other))
                    {
                        element.onColliosion(other);
                    }
                }
            });
        });
        this.objects.forEach(element => {
             //every element is updated
             element.update(time);

             // every element is drawn on canvasqa
             element.draw(this.ctx);
        })
        
        // call the main gamelop again (~60fps by default)
        window.requestAnimationFrame(this.gameLoop.bind(this));



    }

    static getRndInteger(min: number, max: number): number{
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}

//start gameengine
new GameEngine();

