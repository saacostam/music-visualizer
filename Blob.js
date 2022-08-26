import Visual  from "./Visual.js";

class Blob{
    constructor(ctx, x, y, radius, velocity, vector, listener){
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocity = velocity;
        this.vector = vector;
        this.listener = listener;

        this.death = 1000;
        this.life = 0;
    }

    update(elapsedTime, values){
        const intensity = values[this.listener];

        this.x += elapsedTime*this.velocity*this.vector.x*intensity;
        this.y += elapsedTime*this.velocity*this.vector.y*intensity;

        if (this.x < 0 || this.x > this.ctx.canvas.width || this.y < 0 || this.y>this.ctx.canvas.height){
            const visual = new Visual()
            visual.removeEntity(this);
        }

        this.life += elapsedTime;

        if (this.life >= this.death && this.listener != 'bass'){
            const visual = new Visual()
            visual.removeEntity(this);
        }
    }

    render(ctx, values){
        let life = 1;
        if (this.listener != 'bass'){
            life = ( 1-(this.life/this.death))
        }

        const intensity = values[this.listener]*life;

        let rgb = '255, 93, 104';
        if (this.listener === 'bass'){
            rgb = '110, 194, 122';
        }else if (this.listener === 'mid'){
            rgb = '80, 20, 255';
        }else if (this.listener === 'treble'){
            rgb = '255, 93, 104';
        }

        ctx.beginPath();
        ctx.lineWidth = 0;
        ctx.arc(this.x, this.y, this.radius*intensity, 0, 2 * Math.PI, false);
        ctx.fillStyle = `rgba(${rgb}, ${intensity})`;
        ctx.fill();
    }
}

export default Blob;