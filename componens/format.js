import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

export const format = {

  firstLetterBig(item) {
    return item.charAt(0).toUpperCase() + item.slice(1);
  },

  moneyTalk(item) {
    return d3.format('$,.0f')(item);
  },

  yearsRound(item) {
    return d3.format('.0f')(item);
  },

  populationNumber(item) {
    return d3.format(',.0f')(item)
  }

}