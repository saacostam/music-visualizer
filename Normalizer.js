class Normalizer{
    // SINGLETON PATTERN

    constructor(audio){
        // If a instance already exists, return that instance (Singleton Pattern)
        if (typeof Normalizer.instance === 'object'){
            return Normalizer.instance;
        }

        // //////////// //
        // AUDIO CONFIG //
        // //////////// //

        this.audio = audio;
        this.audio.play();

        this.audio.crossOrigin = "anonymous";

        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        this.audioSource = this.audioCtx.createMediaElementSource(this.audio);
        this.analyser = this.audioCtx.createAnalyser();

        this.audioSource.connect(this.analyser);
        this.analyser.connect(this.audioCtx.destination);

        this.analyser.fftSize = 1024;

        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);

        // /////////// //
        // INIT VALUES //
        // /////////// //
        this.bassMax = 240;
        this.midMax = 180;
        this.trebleMax = 150;

        // Define only instance as a Class Variable
        Normalizer.instance = this;
        return this
    }

    input() {
        // GET INPUT DATA
        this.analyser.getByteFrequencyData(this.dataArray);

        let bass = this.dataArray[0];

        let tempArray = []
        for (let i=0; i<16; i++){tempArray.push(this.dataArray[4+i]);}
        let mid = tempArray.reduce((a, b) => a + b, 0) / tempArray.length;

        tempArray = []
        for (let i=0; i<99; i++){tempArray.push(this.dataArray[24+i]);}
        let treble = tempArray.reduce((a, b) => a + b, 0) / tempArray.length;
        
        // SLOW REDUCTION
        // const reductionRate = 0.99;

        // this.bassMax    *= reductionRate;
        // this.midMax     *= reductionRate;
        // this.trebleMax  *= reductionRate;

        // // UPDATE MAX VALUES
        // this.bassMax = Math.max(this.bassMax, bass*reductionRate);
        // this.midMax = Math.max(this.midMax, mid*reductionRate);
        // this.trebleMax = Math.max(this.trebleMax, treble*reductionRate);

        bass = (bass/this.bassMax);
        mid = (mid/this.midMax);
        treble = (treble/this.trebleMax);

        const func = (x)=>{return x*x*x*x*x}

        return {
            bass: func(bass),
            mid: func(mid),
            treble: func(treble)
        };
    }

    setMidMax(value){this.midMax = value;}
    setBassMax(value){this.bassMax = value;}
    setTrebleMax(value){this.trebleMax = value;}

    getMidMax(){return this.midMax;}
    getBassMax(){return this.bassMax;}
    getTrebleMax(){return this.trebleMax;}
}

export default Normalizer;