export class LegendItem {
  constructor(item, index) {
    this.item = item;
    this.index = index;
  }

  render(scale) {
    const legendItem = document.createElement('span');
    legendItem.classList.add(`legend-item`);
    legendItem.style.color = scale(this.item);
    return legendItem;
  }


}