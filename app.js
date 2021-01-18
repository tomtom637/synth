const audioctx = new window.AudioContext();

const masterGain = audioctx.createGain();

masterGain.gain.setValueAtTime(0.2, audioctx.currentTime);
masterGain.connect(audioctx.destination);

function handleClick(e) {
	audioctx.resume();
}

class Osc {
	constructor(frequency) {
		this.frequency = frequency;
		this.generate();
	}
	generate() {
		this.osc = audioctx.createOscillator();
		this.osc2 = audioctx.createOscillator();
		this.osc.frequency.setValueAtTime(this.frequency, audioctx.currentTime);
		this.osc2.frequency.setValueAtTime(this.frequency * 1.002, audioctx.currentTime);
		this.osc.type = 'triangle';		
		this.osc.type = 'sine';		
		this.osc.start();
		this.osc2.start();
		this.gain = audioctx.createGain();
		this.gain2 = audioctx.createGain();
		this.gain2.gain.value = 0.3;
		this.mixGains = audioctx.createGain();
		this.mixGains.gain.setTargetAtTime(1.0, audioctx.currentTime, 0.1);
		this.osc.connect(this.gain);
		this.osc2.connect(this.gain2);
		this.gain.connect(this.mixGains);
		this.gain2.connect(this.mixGains);
		this.mixGains.connect(masterGain);
		this.mixGains.gain.value = 0;
	}
}

const frequenciesSelected = [];
const keyInputs = [];

notes.forEach(note => {
	if(note.key) {
		frequenciesSelected.push(note.frequency);
		keyInputs.push(note.key);
	}
});

let pianoKeys = [];

for (let i = 0; i < frequenciesSelected.length; i++) {
	pianoKeys[i] = new Osc(frequenciesSelected[i]);
}

window.addEventListener('keydown', e => {
	handleClick();
	for(let i = 0; i < keyInputs.length; i++) {
		if(e.key === keyInputs[i]) {
			pianoKeys[i].mixGains.gain.setTargetAtTime(1, audioctx.currentTime, 0.004);

		}
	}
});

window.addEventListener('keyup', e => {
	for(let i = 0; i < keyInputs.length; i++) {
		if(e.key === keyInputs[i]) {
			pianoKeys[i].mixGains.gain.setTargetAtTime(0, audioctx.currentTime, 0.4);
		}
	}
});
