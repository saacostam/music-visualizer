import Visual from './Visual.js'
import Normalizer  from './Normalizer.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.font = "48px Arial";
ctx.fillStyle = "lightGreen";
ctx.fillText("Welcome to Music Visualizer! 🎵", 60, 100);
ctx.font = "32px Arial";
ctx.fillStyle = "white";
ctx.fillText("<< Press 'start' to begin >>", 60, 160);

function init(){
    const audio = new Audio();

    audio.src = "music/BLR · Rave & Crave - Taj (Extended Mix).mp3";
    audio.currentTime = 0;

    const visual = new Visual(audio, canvas);
    visual.start();
    createSettings(visual);
}

function createSettings(visual){
    const vm = new Vue({
        template: `
            <div class="container">
                <div class="row d-flex justify-content-center mb-2">
                    <div class="control col-12 col-lg-8 d-flex mb-4">
                        <a class="mr-3 playback-control" v-if="!this.playing" @click="play"> ▶️ </a>
                        <a class="mr-3 playback-control" v-else @click="pause"> ⏸️ </a>

                        <input type="range" class="flex-auto" id="songSlider" min="0" :max="totalTime" :value="currTime" style="width: 100%;" @input="setPlaybackTime">
                    </div>
                </div>

                <h4 class="text-center">Settings</h4>
                <div class="row d-flex justify-content-center mb-2">
                    <form class="col-12 col-lg-4">
                        <h5 class="text-center m-2">Thresholds</h5>
                        <div class="form-group mb-3 ranger">
                            <label for="bassThreshold" class="form-label">Bass Threshold</label>
                            <input type="range" class="form-range" id="bassThreshold" v-model="bassThreshold" min="0" max="400" @input="setBassMax">
                            <span class="ml-2">{{bassThreshold}}</span>
                        </div>
                        <div class="form-group mb-3 ranger">
                            <label for="midThreshold" class="form-label">Mid Threshold</label>
                            <input type="range" class="form-range" id="midThreshold" v-model="midThreshold" min="0" max="400" @input="setMidMax">
                            <span class="ml-2">{{midThreshold}}</span>
                        </div>
                        <div class="form-group mb-3 ranger">
                            <label for="trebleThreshold" class="form-label">Treble Threshold</label>
                            <input type="range" class="form-range" id="trebleThreshold" v-model="trebleThreshold" min="0" max="400" @input="setTrebleMax">
                            <span class="ml-2">{{trebleThreshold}}</span>
                        </div>
                    </form>
    
                    <form class="col-12 col-lg-4">
                        <h5 class="text-center m-2">Radii</h5>
                        <div class="form-group mb-3 ranger">
                            <label for="midRadius" class="form-label">Mid Radius</label>
                            <input type="range" class="form-range" id="midRadius" v-model="midRadius" min="0" max="0.2" step="0.01" @input="setMidRadius">
                            <span class="ml-2" style="width: 1rem;">{{midRadius}}</span>
                        </div>
                        <div class="form-group mb-3 ranger">
                            <label for="trebleRadius" class="form-label">Treble Radius</label>
                            <input type="range" class="form-range" id="trebleRadius" v-model="trebleRadius" min="0" max="0.2" step="0.01" @input="setTrebleRadius">
                            <span class="ml-2" style="width: 1rem;">{{trebleRadius}}</span>
                        </div>
                    </form>
                </div>

                <h4 class="text-center mb-3">Songs</h4>
                <div class="row d-flex justify-content-center mb-4">
                    <div class="control col-12 col-lg-8">
                        <div class="btn-group-vertical w-100">
                            <button type="button" class="btn btn-light d-block" v-for="song in this.songs" @click="changeSong(song)">{{song.name}}</button>
                        </div>
                    </div>
                </div>
            </div>
        `,
        data(){
            const normalizer  = new Normalizer();
            return {
                visual: visual,
                normalizer,
                audio: normalizer.audio,
                bassThreshold: normalizer.getBassMax(),
                midThreshold: normalizer.getMidMax(),
                trebleThreshold: normalizer.getTrebleMax(),
                midRadius: visual.getMidRadius(),
                trebleRadius: visual.getTrebleRadius(),
                currTime: normalizer.audio.currTime,
                totalTime: normalizer.audio.duration,
                audioListener: null,
                playing: false,
                songs:[
                    {name: 'Armin Van Buuren (Lost Frequencies 2.0 Remix) - In And Out Of Love', src: 'music/Armin Van Buuren (Lost Frequencies 2.0 Remix) - In And Out Of Love.mp3'},
                    {name: 'Ben Bohmer & Malou - Lost In Mind (Volen Sentir Vision)', src: 'music/Ben Bohmer & Malou - Lost In Mind (Volen Sentir Vision).mp3'},
                    {name: 'Bleu Clair & OOTORO - Beat Like This', src: 'music/Bleu Clair & OOTORO - Beat Like This.mp3'},
                    {name: 'BLR · Rave & Crave - Taj (Extended Mix)', src: 'music/BLR · Rave & Crave - Taj (Extended Mix).mp3'},
                    {name: 'Deadmau5 - Strobe (Original Extended Mix)', src: 'music/Deadmau5 - Strobe (Original Extended Mix).mp3'},
                    {name: 'Marten Hørger x Otosan - Feel So Right (Extended Mix)', src: 'music/Marten Hørger x Otosan - Feel So Right (Extended Mix).mp3'},
                    {name: 'Roberto Surace - Joys (Purple Disco Machine Extended Remix)', src: 'music/Roberto Surace - Joys (Purple Disco Machine Extended Remix).mp3'},
                    {name: '911 - Sech Ft DJ SERGIO RIVEROS', src: 'music/911 - Sech Ft DJ SERGIO RIVEROS.mp3'},
                    {name: 'Noir Désir - Le vent nous portera ( Lost Frequencies Edit )', src: 'music/Noir Désir - Le vent nous portera ( Lost Frequencies Edit ).mp3'}
                ]
            }
        },
        created(){
            this.audio.ontimeupdate = this.updateTime.bind(this);
            this.audio.onpause = this.pause;
            this.audio.onplaying = this.play;
            this.audio.onerror = this.pause;
        },
        methods:{
            setMidRadius(e){this.visual.setMidRadius(e.target.value)},
            setTrebleRadius(e){this.visual.setTrebleRadius(e.target.value)},
            setBassMax(e){this.normalizer.setBassMax(e.target.value)},
            setMidMax(e){this.normalizer.setMidMax(e.target.value)},
            setTrebleMax(e){this.normalizer.setTrebleMax(e.target.value)},
            updateTime(e){
                this.currTime = e.target.currentTime;
                this.totalTime = e.target.duration;
            },
            setPlaybackTime(e){this.audio.currentTime = e.target.value;},
            pause(){
                this.audio.pause();
                this.playing = false;
            },
            play(){
                this.audio.play();
                this.playing = true;
            },
            changeSong(song){this.audio.src = song.src;this.play()}
        }
    });
    
    vm.$mount('#app');

    button.remove();
}

const button = document.getElementById('start');
button.addEventListener('click', init);