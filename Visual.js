import Normalizer  from "./Normalizer.js";
import Blob from './Blob.js';

class Visual{
    constructor(audio, canvas){
        if (typeof Visual.instance === 'object'){
            return Visual.instance;
        }

        this.Normalizer = new Normalizer(audio);
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;

        this.entities = [];

        this.lastInput = new Date();

        this.bassRadius = 0.2;
        this.midRadius = 0.04;
        this.trebleRadius = 0.02;

        // Define only instance as a Class Variable
        Visual.instance = this;
        return this
    }

    start(){
        this.addEntity(new Blob(this.ctx, this.canvas.width*1/4, this.canvas.height*2/3, this.canvas.height/5, 0.1, {x:0, y:0},'bass'));
        this.addEntity(new Blob(this.ctx, this.canvas.width/2, this.canvas.height/3, this.canvas.height/5, 0.1, {x:0, y:0},'bass'));
        this.addEntity(new Blob(this.ctx, this.canvas.width*3/4, this.canvas.height*2/3, this.canvas.height/5, 0.1, {x:0, y:0},'bass'));

        window.requestAnimationFrame(this.main.bind(this));
    }

    main(){
        const values = this.Normalizer.input();

        this.update(values);
        this.render(values);

        window.requestAnimationFrame(this.main.bind(this));
    }

    update(values){
        const currTime = new Date();
        const elapsedTime = currTime.getTime() - this.lastInput.getTime();

        // Adding new Entities
        this.addEntity(new Blob(this.ctx, Math.random()*this.canvas.width, Math.random()*this.canvas.height, this.canvas.height*this.midRadius, 0.4, this.getRandomNormalizedVector(),'mid'));

        this.addEntity(new Blob(this.ctx, Math.random()*this.canvas.width, Math.random()*this.canvas.height, this.canvas.height*this.trebleRadius, 0.5, this.getRandomNormalizedVector(),'treble'));

        // Update Current Entities
        for (let i=0; i<this.entities.length;i++){
            const entity = this.entities[i];
            entity.update( elapsedTime, values );
        }
        this.lastInput = currTime;
    }

    render(values){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i=0; i<this.entities.length;i++){
            const entity = this.entities[i];
            entity.render(this.ctx, values);
        }
    }

    getEntityIndex(entity){
        for (let i=0; i<this.entities.length;i++){
            if (this.entities[i] === entity){
                return i;
            }
        }
        return -1;
    }

    removeEntity(entity){
        const index = this.getEntityIndex(entity);
        if (index != -1){
            this.entities.splice(index, 1);
        }
    }

    addEntity(entity){
        this.entities.push(entity);
    }

    getRandomNormalizedVector(){
        const x = (Math.random()*2)-1;
        const y = (Math.random()*2)-1;

        const norm = Math.sqrt(x*x+y*y);
        
        return {
            x: x/norm,
            y: y/norm
        }
    }

    getBassRadius(){return this.bassRadius;}
    getMidRadius(){return this.midRadius;}
    getTrebleRadius(){return this.trebleRadius;}

    setBassRadius(value){this.bassRadius = value;}
    setMidRadius(value){this.midRadius = value;}
    setTrebleRadius(value){this.trebleRadius = value;}
}

export default Visual;