'use strict';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
import {Scale} from './components/Scale.js';
import {Axis} from "./components/Axis.js";
import {Text} from "./components/Text.js";
import {Range} from "./components/Range.js";
import {Interval} from "./components/Interval.js";
import {Svg} from "./components/Svg.js";
import {SvgGroup} from "./components/SvgGroup.js";
import {Tip} from "./components/Tip.js";
import {format} from "./components/format.js";
import {Filter} from "./components/Filter.js";
import {Legend} from "./components/Legend.js";

//Data source
const dataPath = 'data.json';

//Sizing
const VIZ = {WIDTH: 600, HEIGHT: 350, MARGIN: {LEFT: 20, TOP: 0, RIGHT: 0, BOTTOM: 25,}};
const width = VIZ.WIDTH - VIZ.MARGIN.LEFT - VIZ.MARGIN.RIGHT;
const height = VIZ.HEIGHT - VIZ.MARGIN.TOP - VIZ.MARGIN.BOTTOM;

//Visualization details
const ticksX = 5;                       //Amount of ticks on x-axis
const ticksY = 3;                       //Amount of ticks on y-axis
const axisBaseY = 3;                    //Base for axis with log scale (Income range on y-axis)
const sizeFrom = 2;                     //Smallest circle size
const sizeTo = 5000;                    //Biggest circle size
const opacity = .8;                     //Circles opacity
const colorScale = d3.schemeAccent;     //Color range. Source: https://github.com/d3/d3-scale-chromatic

//Canvas
const svg = new Svg(VIZ.WIDTH, VIZ.HEIGHT, 'canvas').render('#container')
const vis = new SvgGroup('viz').render(svg, VIZ.MARGIN.LEFT, VIZ.MARGIN.TOP);
const h1 = document.querySelector('h1');

//Time and timer variables
const initial = 1800;
const start = 0;
let time = start;
const speed = 100; //Timeline speed. In milliseconds
const duration = speed - 1; //Particles animation speed

//Timer will be controlled by clicking the canvas
const controller = document.querySelector('.canvas');

//Adding text
new Text('GDP per capita, $', 'labelY').render(svg, 0, 0);
new Text('Life expectancy, years', 'labelX').render(svg, (VIZ.MARGIN.LEFT + width), ((VIZ.MARGIN.TOP + height + VIZ.MARGIN.BOTTOM)));
const year = new Text(initial + start, 'year').render(vis, width, 0);

//Tooltip
let tip;

//Loading data and render visualization
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
    const range = new Range(data);

    //Set scales
    const lifeScale = new Scale('linear', range.get('life_exp'), 0, width);
    const incomeScale = new Scale('log', range.get('income'), height, 0, axisBaseY);
    const populationScale = new Scale('linear', range.get('population'), sizeFrom, sizeTo);
    const continentScale = new Scale('ordinal', range.get('continent'), colorScale);

    const scalesArr = [lifeScale, incomeScale, populationScale, continentScale];

    //Render axis
    new Axis(incomeScale).render(svg, VIZ.MARGIN.LEFT, VIZ.MARGIN.TOP, 'right', ticksY);
    new Axis(lifeScale).render(svg, VIZ.MARGIN.LEFT, (VIZ.MARGIN.TOP + height), 'top', ticksX);

    //Build legend
    new Legend(range.get('continent'), colorScale).render(h1);

    //Make legend to be a filter also
    const filter = new Filter('continent', false).render(h1, '.legend-item');
    filter.place.addEventListener('click', event => renewViz(event, data, scalesArr, filter));

    //Change visualization by interval
    new Interval(renderVizByInterval(data.length, data, scalesArr, filter)).run(speed).control(controller);

    //Render viz for the first time
    renderViz(data[start], scalesArr, filter);

}).catch(error => {
    console.log(error);
});

//Show tooltip on mouse hover
function showTip(event) {
    const target = event.target;
    const data = target['__data__'];
    tip = new Tip(data,['Continent', 'Country', 'GDP per capita', 'Life Expectancy', 'Population'], [format.firstLetterBig, null, format.moneyTalk, format.yearsRound, format.populationNumber]);
    tip.render(document.body, `${event.clientX}px`, `${event.clientY}px`);
    target.classList.add('outlined');
}

function hideTip(event) {
    event.target.classList.remove('outlined');
    tip.delete();
}

//Rendering visualization by interval
function renderVizByInterval(amountOfTimes, data, scalesArr, filter) {
    return () => {
        time = (time < amountOfTimes - 1) ? time + 1 : start;
        renderViz(data[time], scalesArr, filter)
        year.text(String(time + initial));
    }
}

function renewViz(event, data, funcs, filter) {
    renderViz(data[time], funcs, filter);
}

//Rendering visualization
function renderViz(data, [x, y, area, color], filter) {
    const t = d3.transition().duration(duration);

    const readyData = filter && filter.applied === true ? filter.filterData(data) : data;

    const points = vis.selectAll('circle')
      .data(readyData, d => d.country);
    points.exit().remove();
    points.enter().append('circle')
        .attr('opacity', opacity)
        .on('mouseover', showTip)
        .on('mouseout', hideTip)
        .merge(points)
            .transition(t)
                .attr('cx', d => x(d.life_exp))
                .attr('cy', d => y(d.income))
                .attr('r', d => (Math.sqrt(area(d.population)/Math.PI)))
                .attr('fill', d => color(d.continent))

}



