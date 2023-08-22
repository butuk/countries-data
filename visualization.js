'use strict';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

//Data source
const dataPath = 'data.json';

//Sizing
const VIZ = {
    WIDTH: 600,
    HEIGHT: 400,
    MARGIN: {
        LEFT: 0,
        TOP: 0,
        RIGHT: 0,
        BOTTOM: 0,
    }
};
const width = VIZ.WIDTH - VIZ.MARGIN.LEFT - VIZ.MARGIN.RIGHT;
const height = VIZ.HEIGHT - VIZ.MARGIN.TOP - VIZ.MARGIN.BOTTOM;

const LEGEND = {
    WIDTH: 600,
    HEIGHT: 50,
}

//Time and timer variables
let dynamics = true;
const start = 0;
const initial = 1800;
let time = start;
const speed = 100;

//Canvas
const svg = d3.select('#container')
    .append('svg')
    .attr('width', VIZ.WIDTH)
    .attr('height', VIZ.HEIGHT)
    .attr('viewBox', `0 0 ${VIZ.WIDTH} ${VIZ.HEIGHT}`)
    .attr('preserveAspectRatio', 'xMinYMin meet')
const vis = svg.append('g')
    .attr('transform', `translate(${VIZ.MARGIN.LEFT} ${VIZ.MARGIN.TOP})`)

//Legend
/*const legend = d3.select('#legend')
  .attr('viewBox', `0 0 ${LEGEND.WIDTH} ${LEGEND.HEIGHT}`)
  .attr('preserveAspectRatio', 'xMinYMin meet')
  .append('svg').append('g')*/

//Adding text
const header = createText('header', (VIZ.MARGIN.LEFT + width), VIZ.MARGIN.TOP, initial, 'end', 'hanging');

//Loading data and draw visualization
d3.json(dataPath).then(dataset => {
    const data = dataset.map(element => {
        return element['countries'].filter(country => {
            return (country.income && country.life_exp && country.population);
        }).map(country => {
            country.income = Number(country.income);
            country.life_exp = Number(country.life_exp);
            country.population = Number(country.population);
            return country;
        });
    });

    //Set scales
    const lifeScale = makeLinearScale(getRange(data, 'life_exp'), 0, width);
    const incomeScale = makeLogScale(getRange(data, 'income'), height, 0, 3);
    const populationScale = makeLinearScale(getRange(data, 'population'), 1, 6500);
    const continentScale = makeOrdinalScale(getRange(data, 'continent'), d3.schemeTableau10);
    const scalesArr = [lifeScale, incomeScale, populationScale, continentScale];

    //Draw axis
    drawAxis('axisRight', incomeScale, 3, VIZ.MARGIN.LEFT, VIZ.MARGIN.TOP);
    drawAxis('axisTop', lifeScale, 5, VIZ.MARGIN.LEFT, (VIZ.MARGIN.TOP + height));

    //Draw visualization by interval
    let interval = d3.interval(drawVizByInterval(data, scalesArr, data.length), speed);
    controlInterval(interval, document.querySelector('svg'), drawVizByInterval(data, scalesArr, data.length), speed);

    //Draw viz for the first time
    drawViz(data[0], ...scalesArr);

}).catch(error => {
    console.log(error);
});

//Create text function
function createText(txtClass, x, y, text, textAnchor, verticalAligment) {
    const txtElement = svg.append('text')
        .attr('class', `${txtClass}`)
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', textAnchor)
        .attr('text', text)

        verticalAligment ? txtElement.attr('alignment-baseline', verticalAligment) : txtElement.attr('alignment-baseline', 'auto')

    return txtElement;
}

//Make interval controlled by element
function controlInterval(timer, element, callback, speed) {
    element.addEventListener('click', () => {
        if (dynamics) {
            timer.stop();
            clearInterval(timer);
        } else {
            timer = d3.interval(callback, speed);
        }
        dynamics = !dynamics;
    })
}

//Create visualization by interval
function drawVizByInterval(data, scalesArr, amountOfTimes) {
    return () => {
        time = (time < amountOfTimes) ? time + 1 : start;
        drawViz(data[time], ...scalesArr)
        header.text(String(time + initial));
    }
}

//Create visualization
function drawViz(data, x, y, area, color) {
    const points = vis.selectAll('circle').data(data);
    points.exit().remove();
    points.enter().append('circle')
        .attr('opacity', 0.7)
        .merge(points)
        .attr('cx', d => x(d.life_exp))
        .attr('cy', d => y(d.income))
        .attr('r', d => (Math.sqrt(area(d.population)/Math.PI)))
        .attr('fill', d => color(d.continent));
}

//Create axis
function drawAxis(type, scale, ticks, left, top) {
    const axis = d3[`${type}`](scale)
        .tickSize(0)
        .ticks(ticks)
    svg.append('g')
        .attr('transform', `translate(${left}, ${top})`)
        .attr('class', `axis ${type}`)
        .call(axis);
}

//Make scales of specified types
function makeLinearScale(range, from, to) {
    return d3.scaleLinear()
        .domain(range)
        .range([from, to]);
}
function makeLogScale(range, from, to, base) { // income
     return d3.scaleLog()
         .domain(range)
         .range([from, to])
         .base(base);
}
function makeOrdinalScale(rangeIn, rangeOut) {
    return d3.scaleOrdinal()
        .domain(rangeIn)
        .range(rangeOut)
}

//Get data margins
function getRange(dataset, param) {
    const parameters = new Set();
    for (let element of dataset) {
        for (let country of element) {
            parameters.add(country[param]);
        }
    }
    return d3.extent(Array.from(parameters));
}