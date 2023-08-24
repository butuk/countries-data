export class Text {
  constructor(place, txtClass, text, x = 0, y = 0) {
    this.elem = place.append('text')
      .attr('class', `${txtClass}`)
      .attr('x', x)
      .attr('y', y)
      .text(text)
    return this.elem;
  }

  rotate() {
    console.log(this);
    //return this.elem.attr('transform', `rotate(${deg})`)
  }
}