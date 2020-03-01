import 'normalize.css'
import './index.scss'
import * as d3 from "d3";
import views from "./views"

/**
 * TO DO: refactor in model view controller
 * temporal
 */
const mapchart = views.mapchart()

const mapchartContainer = d3.select('#root')
      .append('div')
      .attr('id', '#map')
    mapchartContainer.call(mapchart) 