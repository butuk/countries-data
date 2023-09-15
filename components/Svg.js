import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

export class Svg {
    constructor(width, height, svgClass=null) {
      this.width = width;
      this.height = height;
      this.svgClass = svgClass;
    }

  render(place) {
    this.block = d3.select(place)
      .append('svg')
      .attr('class', this.svgClass)
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)
      .attr('preserveAspectRatio', 'xMinYMin meet')
    return this.block;
  }
}