// 決まった時間にイベントを呼び出すクラス
//
// timeline = new Timeline();
//
// イベントの登録
// timeline.addEvent(callback, 開始時間, 終了時間 = 開始時間);
//
// 実行のチェック（updateとかで毎回呼びだす）
// timeline.exec(時間);

class Timeline {
  constructor() {
    this.events = [];
    this.fromSpikes = [];
    this.reset();
  }

  reset() {
    this.lastEventsIndex = 0;
    this.lastFromSpikesIndex = 0;
  }

  addEvent(callback, from, to = from) {
    this.events.push({
      from: from,
      to: to,
      callback: callback,
    });
    this.events.sort((a, b) => a.from - b.from);
    this.events.sort((a, b) => a.to - b.to);
    this.lastEventsIndex = 0;
    this.lastFromSpikesIndex = 0;

    this.fromSpikes = [];

    const eventsLength = this.events.length;
    for(let i=0; i<eventsLength-1; i++){
      const iFrom = this.events[i].from;
      let broken = false;
      for(let j=i+1; j<eventsLength; j++){
        if(this.events[j].from < iFrom){
          broken = true;
          break;
        }
      }
      if(!broken){
        this.fromSpikes.push(i);
      }
    }
  }

  exec(time) {
    // 頭良くなった
    const eventsLength = this.events.length;
    const fromSpikesLength = this.fromSpikes.length;

    let lastIndex = eventsLength;

    for(let i=this.lastFromSpikesIndex; i<fromSpikesLength; i++){
      if(this.events[this.fromSpikes[i]].from > time){
        lastIndex = this.fromSpikes[i];
        this.lastFromSpikesIndex = i;
        break;
      }
    }

    for(let i=this.lastEventsIndex; i<lastIndex; i++){
      const event = this.events[i];
      if(event.from > time) {
        continue;
      }
      if(event.to > time) {
        const range = event.to - event.from;
        const t = range <= 0 ? 1 : (time - event.from) / range;
        event.callback(time, t);
      } else {
        event.callback(event.to, 1);
        this.lastEventsIndex = i + 1;
      }
    }

  }
}

module.exports = Timeline;
