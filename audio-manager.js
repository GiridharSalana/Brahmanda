// Audio Manager for spatial audio and ambient sounds
class AudioManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.listener = null;
        this.ambientGain = null;
        this.isEnabled = false;
        
        // Initialize audio context
        this.initAudio();
    }
    
    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.listener = this.audioContext.listener;
            this.ambientGain = this.audioContext.createGain();
            this.ambientGain.connect(this.audioContext.destination);
            this.ambientGain.gain.value = 0.3;
            this.isEnabled = true;
            console.log('Audio context initialized');
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
            this.isEnabled = false;
        }
    }
    
    // Create spatial audio source
    createSpatialSound(url, position, loop = false, volume = 0.5) {
        if (!this.isEnabled) return null;
        
        const sound = {
            source: null,
            panner: null,
            gain: null,
            position: position,
            audio: new Audio(url)
        };
        
        sound.audio.loop = loop;
        sound.audio.volume = volume;
        
        // Create panner for spatial audio
        sound.panner = this.audioContext.createPanner();
        sound.panner.panningModel = 'HRTF';
        sound.panner.distanceModel = 'inverse';
        sound.panner.refDistance = 1;
        sound.panner.maxDistance = 100;
        sound.panner.rolloffFactor = 1;
        
        sound.gain = this.audioContext.createGain();
        sound.gain.gain.value = volume;
        
        sound.panner.connect(sound.gain);
        sound.gain.connect(this.audioContext.destination);
        
        this.sounds[url] = sound;
        return sound;
    }
    
    // Update spatial sound position
    updateSoundPosition(url, position) {
        if (!this.isEnabled || !this.sounds[url]) return;
        
        const sound = this.sounds[url];
        sound.position = position;
        
        if (sound.panner) {
            sound.panner.positionX.value = position.x;
            sound.panner.positionY.value = position.y;
            sound.panner.positionZ.value = position.z;
        }
    }
    
    // Update listener position (camera position)
    updateListener(camera) {
        if (!this.isEnabled || !this.listener) return;
        
        this.listener.positionX.value = camera.position.x;
        this.listener.positionY.value = camera.position.y;
        this.listener.positionZ.value = camera.position.z;
        
        // Update listener orientation
        const forward = new THREE.Vector3(0, 0, -1);
        forward.applyQuaternion(camera.quaternion);
        
        this.listener.forwardX.value = forward.x;
        this.listener.forwardY.value = forward.y;
        this.listener.forwardZ.value = forward.z;
    }
    
    // Play ambient sound
    playAmbient(url, volume = 0.2) {
        if (!this.isEnabled) return;
        
        const audio = new Audio(url);
        audio.loop = true;
        audio.volume = volume;
        audio.play().catch(e => console.warn('Ambient audio play failed:', e));
        return audio;
    }
    
    // Play one-shot sound
    playSound(url, volume = 0.5) {
        if (!this.isEnabled) return;
        
        const audio = new Audio(url);
        audio.volume = volume;
        audio.play().catch(e => console.warn('Sound play failed:', e));
        return audio;
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioManager;
}

