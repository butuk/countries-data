import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

export class Axis {
  constructor(scale) {
      this.scale = scale;
  }

  render(place, x, y, type, ticks) {
    /*
    Type is the side where the axis text will
    be relatively its line.
    If it will be on the right or left,
    the line will be vertical.
    If top or bottom – horizontal.
    */
    const axisName = 'axis' + type.slice(0,1).toUpperCase() + type.slice(1,type.length);

    const axis = d3[`${axisName}`](this.scale)
      .tickSize(0)
      .ticks(ticks)

    this.block = place.append('g')
      .attr('transform', `translate(${x}, ${y})`)
      .attr('class', `axis ${axisName}`)
      .call(axis);

    return this;
  }
}