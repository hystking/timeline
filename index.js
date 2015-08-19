var Timeline = function(){
    this.rangeEvents = [];
    this.fromSpikes = [];
};

Timeline.prototype.reset = function(startTime){
    this.lastRangeEventsIndex = 0;
    this.lastFromSpikesIndex = 0;
};

Timeline.prototype.prepare = function(){
    this.rangeEvents.sort(function(a, b){return a.from - b.from;});
    this.rangeEvents.sort(function(a, b){return a.to - b.to;});
    
    this.fromSpikes = [];

    var rangeEventsLength = this.rangeEvents.length;
    var i, j;
    var iFrom, broken, jFrom;
    
    for(i=0; i<rangeEventsLength-1; i=i+1|0){
        iFrom = this.rangeEvents[i].from;
        broken = false;
        for(j=i+1|0; j<rangeEventsLength; j=j+1|0){
            jFrom = this.rangeEvents[j].from;
            if(jFrom < iFrom){
                broken = true;
                break;
            }
        }
        if(!broken){
            this.fromSpikes.push(i);
        }
    }
    
    this.reset();
    this.isReady = true;
};

Timeline.prototype.add = function(from, to, callback){
    if(callback === void 0) {
      callback = to;
      to = from;
    }

    this.rangeEvents.push({
        from: from,
        to: to,
        callback: callback,
    });
    
    this.isReady = false;
};

Timeline.prototype.exec = function(time){
    if(!this.isReady){
      throw "call prepare before exec";
    }

    var eventsLength = this.rangeEvents.length;
    var fromSpikesLength = this.fromSpikes.length;
    var lastIndex = eventsLength;

    var i;
    for(i=this.lastFromSpikesIndex; i<fromSpikesLength; i=i+1|0){
        if(this.rangeEvents[this.fromSpikes[i]].from > time){
            lastIndex = this.fromSpikes[i];
            this.lastFromSpikesIndex = i;
            break;
        }
    }

    var t, range, rangeEvent;
    for(i=this.lastRangeEventsIndex; i<lastIndex; i=i+1|0){
        var rangeEvent = this.rangeEvents[i];
        if(rangeEvent.from > time) {
            continue;
        }
        if(rangeEvent.to > time) {
            range = rangeEvent.to - rangeEvent.from;
            if(range <= 0) {
                t = 1;
            } else {
                t = (time - rangeEvent.from) / range;
            }
            rangeEvent.callback(time, t);
        } else {
            rangeEvent.callback(rangeEvent.to, 1);
            this.lastRangeEventsIndex = i + 1;
        }
    }
};

module.exports = Timeline;
