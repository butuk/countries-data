import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

export class Axis {
  constructor(type, ...args) { // Type is the side where the axis text will be relatively its line
      this.axisType = 'axis' + type.slice(0,1).toUpperCase() + type.slice(1,type.length);
      return this.create(...args)
  }

  create(scale, ticks, x, y) {
    this.axis = d3[`${this.axisType}`](scale)
      .tickSize(0)
      .ticks(ticks)
  }

  draw(place, x, y) {
    return place.append('g')
      .attr('transform', `translate(${x}, ${y})`)
      .attr('class', `axis ${this.axisType}`)
      .call(this.axis);
  }
}