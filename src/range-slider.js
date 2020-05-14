export default function slider(container, options) {
  var inputsRy = {
    sliderWidth: options.width || 200,
    minRange: options.minRange || 0,
    maxRange: options.maxRange || 60,
    outputWidth: options.outputWidth || 30, // output width
    thumbWidth:  options.thumbWidth || 20, // thumb width
    thumbBorderWidth: options.thumbBorderWidth || 4,
    trackHeight: options.trackHeight || 4,
    theValue: options.theValue || [10, 50], // theValue[0] < theValue[1]
    thumbGap: options.thumbGap || 4,
  };
  var isDragging0 = false;
  var isDragging1 = false;

  var range = inputsRy.maxRange - inputsRy.minRange;
  var rangeK = inputsRy.sliderWidth / range;
  var thumbRealWidth = inputsRy.thumbWidth + 2 * inputsRy.thumbBorderWidth;

  // styles
  container.classList.add('slider-container');
  var slider = createElement('div', ['slider']);
  var track = createElement('div', ['track'], slider);
  let o0 = createElement('div', ['output', 'o0']);
  let t0 = createElement('div', ['thumb', 't0']);
  let o1 = createElement('div', ['output', 'o1']);
  let t1 = createElement('div', ['thumb', 't1']);
  createElement('p', []).innerHTML = options.label

  if ( options.theValue && !Array.isArray(inputsRy.theValue)) {
    o0.style.display = 'none';
    t0.style.display = 'none';
    inputsRy.theValue = [0, inputsRy.theValue];
    inputsRy.thumbGap = -1;
  }

  let outputs = [o0, o1];
  let thumbs = [t0, t1];

  slider.style.height = inputsRy.trackHeight + "px";
  slider.style.width = inputsRy.sliderWidth + "px";
  container.style.width = inputsRy.sliderWidth + "px";
  slider.style.paddingLeft = (inputsRy.theValue[0] - inputsRy.minRange) * rangeK + "px";
  slider.style.paddingRight = inputsRy.sliderWidth - inputsRy.theValue[1] * rangeK + "px";

  track.style.width = inputsRy.theValue[1] * rangeK - inputsRy.theValue[0] * rangeK + "px";

  for (var i = 0; i < thumbs.length; i++) {

    thumbs[i].style.width = thumbs[i].style.height = inputsRy.thumbWidth + "px";
    thumbs[i].style.borderWidth = inputsRy.thumbBorderWidth + "px";
    thumbs[i].style.top = -(inputsRy.thumbWidth / 2 + inputsRy.thumbBorderWidth - inputsRy.trackHeight / 2 - 4) + "px";
    thumbs[i].style.left = (inputsRy.theValue[i] - inputsRy.minRange) * rangeK - (thumbRealWidth / 2) + "px";

  }

  for (var i = 0; i < outputs.length; i++) {
    outputs[i].style.width = outputs[i].style.height = outputs[i].style.lineHeight = outputs[i].style.left = inputsRy.outputWidth + "px";
    outputs[i].style.top = -(Math.sqrt(2 * inputsRy.outputWidth * inputsRy.outputWidth) + inputsRy.thumbWidth / 2 - inputsRy.trackHeight / 2) + "px";
    outputs[i].style.left = (inputsRy.theValue[i] - inputsRy.minRange) * rangeK - inputsRy.outputWidth / 2 + "px";
    outputs[i].innerHTML = "<p>" + inputsRy.theValue[i] + "</p>";
  }

  //events

  thumbs[0].addEventListener("mousedown", function(evt) {
    evt.preventDefault();
    isDragging0 = true;
  }, false);
  thumbs[1].addEventListener("mousedown", function(evt) {
    evt.preventDefault();
    isDragging1 = true;
  }, false);
  container.addEventListener("mouseup", function(evt) {
    if (isDragging0 || isDragging1) {
      var theValue0 = inputsRy.theValue[0];
      var theValue1 = inputsRy.theValue[1];

      if ( options.theValue && !Array.isArray(options.theValue)) {
        options.onRangeChange(theValue1)
      } else {
        options.onRangeChange(theValue0, theValue1)
      }
      //window.app.changeAgeRange(theValue0, theValue1);
    }

    isDragging0 = false;
    isDragging1 = false;
  }, false);

  container.addEventListener("mousemove", function(evt) {
    var mousePos = oMousePos(this, evt);
    var theValue0 = (isDragging0) ? Math.round(mousePos.x / rangeK) + inputsRy.minRange : inputsRy.theValue[0];
    var theValue1 = (isDragging1) ? Math.round(mousePos.x / rangeK) + inputsRy.minRange : inputsRy.theValue[1];

    if (isDragging0) {

      if (theValue0 < theValue1 - inputsRy.thumbGap &&
        theValue0 >= inputsRy.minRange) {
        inputsRy.theValue[0] = theValue0;
        thumbs[0].style.left = (theValue0 - inputsRy.minRange) * rangeK - (thumbRealWidth / 2) + "px";
        outputs[0].style.left = (theValue0 - inputsRy.minRange) * rangeK - inputsRy.outputWidth / 2 + "px";
        outputs[0].innerHTML = "<p>" + theValue0 + "</p>";
        slider.style.paddingLeft = (theValue0 - inputsRy.minRange) * rangeK + "px";
        track.style.width = (theValue1 - theValue0) * rangeK + "px";

      }
    } else if (isDragging1) {

      if (theValue1 > theValue0 + inputsRy.thumbGap &&
        theValue1 <= inputsRy.maxRange) {
        inputsRy.theValue[1] = theValue1;
        thumbs[1].style.left = (theValue1 - inputsRy.minRange) * rangeK - (thumbRealWidth / 2) + "px";
        outputs[1].style.left = (theValue1 - inputsRy.minRange) * rangeK - inputsRy.outputWidth / 2 + "px";
        outputs[1].innerHTML = "<p>" + theValue1 + "</p>";
        slider.style.paddingRight = (inputsRy.maxRange - theValue1) * rangeK + "px";
        track.style.width = (theValue1 - theValue0) * rangeK + "px";

      }
    }
  }, false);

  // helpers

  function oMousePos(elmt, evt) {
    var ClientRect = elmt.getBoundingClientRect();
    return { //objeto
      x: Math.round(evt.clientX - ClientRect.left),
      y: Math.round(evt.clientY - ClientRect.top)
    }
  }

  function createElement(tag, classNames, customParent) {
    let parent = customParent || container
    let elm = document.createElement(tag);
    classNames.forEach( classname => elm.classList.add(classname));
    parent.appendChild(elm);
    return elm
  }
}