export class SvgGroup {
  constructor(groupClass = null) {
    this.groupClass = groupClass;
  }

  render(place, x, y) {
      this.block = place.append('g')
        .attr('class', this.groupClass)
        .attr('transform', `translate(${x} ${y})`);
      return this.block;
    }
}