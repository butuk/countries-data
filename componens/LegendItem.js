export class LegendItem {
  constructor(item, index, scale) {
    this.item = item;
    this.index = index;
    this.scale = scale;
  }

  render() {
    const legendItem = document.createElement('span');
    legendItem.classList.add(`legend-item`);
    legendItem.dataset.num = `${this.index}`;
    legendItem.style.color = this.scale(this.item);
    return legendItem;
  }


}