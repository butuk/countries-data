import {Scale} from "./Scale.js";
import {LegendItem} from "./LegendItem.js";
import {format} from "./format.js";

export class Legend {
  constructor(items, colors) {
    this.items = items;
    this.colors = colors;
  }


  render(place) {
    const continentColor = new Scale('ordinal', [], this.colors);
    this.items.forEach((item, index) => {
      const legendItem = new LegendItem(item, index).render(continentColor);
      legendItem.dataset.item = `${item}`;
      const itemFormated = format.firstLetterBig(item);

      const v = index === 0 ? 'in ' : '';
      const comma = (index !== this.items.length - 1) ? ',' : '';
      const text = document.createTextNode((`${v}${itemFormated}${comma}`));

      legendItem.append(text);
      place.append(legendItem);
      index < this.items.length - 1 ? place.append(' ') : null;
    })
  }
}