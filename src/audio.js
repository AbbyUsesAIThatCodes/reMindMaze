// Original, quiet synthesized chimes. No audio files or external services.
export class CastleSound {
  constructor(){this.enabled=false;this.context=null;this.interval=null;}
  async toggle(){
    if(this.enabled){this.enabled=false;clearInterval(this.interval);await this.context?.suspend();return false;}
    const Audio=globalThis.AudioContext||globalThis.webkitAudioContext;
    if(!Audio) return false;
    this.context ||= new Audio();
    await this.context.resume();this.enabled=true;this.ambient();
    this.interval=setInterval(()=>{if(!document.hidden)this.ambient();},11000);
    return true;
  }
  note(frequency,delay=0,duration=.6,volume=.035){
    if(!this.enabled||!this.context)return;
    const c=this.context,osc=c.createOscillator(),gain=c.createGain(),start=c.currentTime+delay;
    osc.type='sine';osc.frequency.value=frequency;
    gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(volume,start+.05);gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
    osc.connect(gain);gain.connect(c.destination);osc.start(start);osc.stop(start+duration+.1);
  }
  ambient(){[146.83,220,293.66,329.63,293.66,220].forEach((n,i)=>this.note(n,i*.6,2.5,.012));}
  door(){this.note(196,0,.3,.035);this.note(293.66,.15,.5,.025);}
  correct(){[293.66,369.99,440].forEach((n,i)=>this.note(n,i*.12,.8,.04));}
  wrong(){this.note(164.81,0,.3,.025);}
  win(){[293.66,369.99,440,587.33].forEach((n,i)=>this.note(n,i*.3,1.8,.04));}
}
