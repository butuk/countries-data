import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

export class Interval {
  constructor(func) {
    this.func = func;
    this.dynamics = true;
  }

  run(speed) {
    this.speed = speed;
    this.timer = d3.interval(this.func, this.speed)
    return this;
  }

  control(element) {
    element.addEventListener('click', () => {
      if (this.dynamics) {
        this.timer.stop();
        clearInterval(this.timer);
      } else {
        this.timer = d3.interval(this.func, this.speed);
      }
      this.dynamics = !this.dynamics;
    })
    return this;
  }
}