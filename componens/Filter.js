export class Filter  {
  constructor(parameter, applied) {
    this.parameter = parameter;
    this.applied = applied;
  }

  render(place, elements) {
    this.place = place;
    document.querySelectorAll(elements).forEach(button => {
      button.classList.add('filter-item');
      button.addEventListener('click', this.apply.bind(this));
    })
    return this;
  }

  apply(event) {
    if(this.applied === false) {
      this.showResetButton();
    }
    const eventTarget = event.target;
    this.filteredBy = eventTarget.dataset.item;
    this.dimOtherButtons(eventTarget, '.filter-item', '.filter-reset');
    eventTarget.classList.add('selected');

    this.applied = true;
  }

  reset() {
    this.upLightButtons('.filter-item');
    this.hideButton();
    this.applied = false;
  }

  showResetButton() {

    const all = document.createElement('span');
    all.classList.add('filter-reset');
    all.classList.add('filter-item');

    const divider = document.createElement('span');
    divider.classList.add('filter-reset');

    divider.textContent = ', ';
    all.textContent = 'all countries';

    this.place.append(divider);
    this.place.append(all);

    all.addEventListener('click', this.reset.bind(this));
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

  filterData(data) {
  return data.filter(country => {
    return country[this.parameter] === this.filteredBy;
  })
}
}