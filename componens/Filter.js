export class Filter  {
  constructor(data, parameter, filtered) {
    this.data = data;
    this.parameter = parameter;
    this.filtered = filtered;
  }

  render(place, elements) {
    document.querySelectorAll(elements).forEach(item => {
      item.classList.add('filter-item');
      item.addEventListener('click', this.apply);
    })
    this.place = place;
    return this;
  }

  apply(event) {
    const parameter = event.target;
    this.filteredBy = parameter.dataset.item;
    this.showResetButton();
    //this.dimOtherButtons(parameter, '.filter-item', '.filter-reset');
    parameter.classList.add('selected');
    this.filtered = true;
  }

  reset() {
    this.upLightButtons('.filter-item');
    this.hideButton();
    this.filtered = false;
  }

  showResetButton() {
    const all = document.createElement('span');
    all.classList.add('filter-reset');
    all.classList.add('filter-item');

    const divider = document.createElement('span');
    divider.classList.add('filter-reset');

    divider.textContent = ', ';
    all.textContent = 'all countries';

    if (!this.filtered) {
      this.place.append(divider);
      this.place.append(all);
    }
    all.addEventListener('click', this.reset);
  }

  hideButton() {
    document.querySelectorAll('.filter-reset').forEach(item => {
      item.remove();
    })
  }

  dimOtherButtons(button, ...className) {
    button.classList.remove('dimmed');
    button.classList.add('selected');
    className.forEach(name => {
      document.querySelectorAll(name).forEach(item => {
        item.classList.remove('selected');
        item !== button ? item.classList.add('dimmed') : null;
      });
    });
  }

  upLightButtons(className) {
    document.querySelectorAll('.filter-item').forEach(item => {
      item.classList.remove('dimmed');
      item.classList.remove('selected');
    })
  }

  filterData() {
  this.data.filter(country => {
    return country[this.parameter] === this.parameter;
  })
}
}