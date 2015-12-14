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
    this.rangeEvents = [];
    this.fromSpikes = [];
    this.reset();
  }

  reset() {
    this.lastRangeEventsIndex = 0;
    this.lastFromSpikesIndex = 0;
  }

  addEvent(callback, from, to = from) {
    this.rangeEvents.push({
      from: from,
      to: to,
      callback: callback,
    });
    this.rangeEvents.sort((a, b) => a.from - b.from);
    this.rangeEvents.sort((a, b) => a.to - b.to);
    this.lastRangeEventsIndex = 0;
    this.lastFromSpikesIndex = 0;

    this.fromSpikes = [];

    const rangeEventsLength = this.rangeEvents.length;
    for(let i=0; i<rangeEventsLength-1; i++){
      const iFrom = this.rangeEvents[i].from;
      let broken = false;
      for(let j=i+1; j<rangeEventsLength; j++){
        if(this.rangeEvents[j].from < iFrom){
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
    const eventsLength = this.rangeEvents.length;
    const fromSpikesLength = this.fromSpikes.length;

    let lastIndex = eventsLength;

    for(let i=this.lastFromSpikesIndex; i<fromSpikesLength; i++){
      if(this.rangeEvents[this.fromSpikes[i]].from > time){
        lastIndex = this.fromSpikes[i];
        this.lastFromSpikesIndex = i;
        break;
      }
    }

    for(let i=this.lastRangeEventsIndex; i<lastIndex; i++){
      const rangeEvent = this.rangeEvents[i];
      if(rangeEvent.from > time) {
        continue;
      }
      if(rangeEvent.to > time) {
        const range = rangeEvent.to - rangeEvent.from;
        const t = range <= 0 ? 1 : (time - rangeEvent.from) / range;
        rangeEvent.callback(time, t);
      } else {
        rangeEvent.callback(rangeEvent.to, 1);
        this.lastRangeEventsIndex = i + 1;
      }
    }

  }
}

module.exports = Timeline;
