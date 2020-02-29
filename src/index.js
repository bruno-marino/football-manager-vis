import 'normalize.css'
import './index.scss'

import * as d3 from "d3";

d3.csv("/assets/dataset.csv").then(function(data) {
    console.log(data);
});