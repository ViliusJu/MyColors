"use strict";

//Global selections and variables

const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll("input[type='range']");
const currentHexes = document.querySelectorAll(".color h2");
let initialcolors;

///Event listener///
sliders.forEach((slider) => {
  slider.addEventListener("input", hslControls);
});

colorDivs.forEach((div, index) => {
  div.addEventListener("change", () => {
    updateTextUI(index);
  });
});
//----Functions---/////

//Color Generator

//Old scholl//

/*function generateHex() {
  const letters = "012345678ABCDEF";
  let hash = "#";
  for (let i = 0; i < 6; i++) {
    hash += letters[Math.floor(Math.random() * 15)];
  }
  return hash;
}*/

// New school//

function generateHex() {
  const hexColor = chroma.random();
  return hexColor;
}

function randomColors() {
  initialcolors = [];
  colorDivs.forEach((div, index) => {
    const hexText = div.children[0];
    const randomColor = generateHex();
    //Push initial color to array
    initialcolors.push(chroma(randomColor).hex());

    //Add the color to the background;

    div.style.backgroundColor = randomColor;
    hexText.innerText = randomColor;

    ///Check /contrast
    checkTextColor(randomColor, hexText);

    ///Initialize colorsd sliders

    const color = chroma(randomColor);
    const sliders = div.querySelectorAll(".sliders input");
    // console.log(sliders);
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];

    colorizeSliders(color, hue, brightness, saturation);
  });
  resetInputs();
}

function checkTextColor(color, text) {
  const luminance = chroma(color).luminance();
  if (luminance > 0.5) {
    text.style.color = "black";
  } else {
    text.style.color = "white";
  }
}

function colorizeSliders(color, hue, brightness, saturation) {
  //SCale SAturation
  const noSat = color.set("hsl.s", 0);
  const fullSat = color.set("hsl.s", 1);
  const scaleSat = chroma.scale([noSat, color, fullSat]);

  //Scale brightness
  const midBright = color.set("hsl.l", 0.5);
  const scaleBright = chroma.scale(["black", midBright, "white"]);

  saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(
    0
  )}, ${scaleSat(1)})`;

  brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBright(
    0
  )}, ${scaleBright(0.5)}, ${scaleBright(1)})`;

  hue.style.backgroundImage = `linear-gradient(to right, rgb(204, 75, 75), rgb(204, 204, 75), rgb(75, 204, 75), rgb(75, 204, 204), rgb(75, 75, 204), rgb(204, 75, 204), rgb(204, 75, 75))`;
}

function hslControls(event) {
  const index =
    event.target.getAttribute("data-brigt") ||
    event.target.getAttribute("data-hue") ||
    event.target.getAttribute("data-saturation");
  console.log(index);

  let sliders = event.target.parentElement.querySelectorAll(
    'input[type="range"]'
  );

  const hue = sliders[0];
  const saturation = sliders[1];
  const brightness = sliders[2];

  const bgColor = initialcolors[index];

  let color = chroma(bgColor)
    .set("hsl.s", saturation.value)
    .set("hsl.l", brightness.value)
    .set("hsl.h", hue.value);

  colorDivs[index].style.backgroundColor = color;

  //Colorize inputs
  colorizeSliders(color, hue, saturation, brightness);
}

function updateTextUI(index) {
  const activeDIV = colorDivs[index];
  const color = chroma(activeDIV.style.backgroundColor);
  const textHex = activeDIV.querySelector("h2");
  const icons = activeDIV.querySelectorAll(".controls button");
  textHex.innerText = color.hex();
  // Check contrast

  checkTextColor(color, textHex);
  icons.forEach((icon) => {
    checkTextColor(color, icon);
  });
}

function resetInputs() {
  const sliders = document.querySelectorAll(".sliders input");
  sliders.forEach((slider) => {
    if (slider.name === "hue") {
      const hueColor = initialcolors[slider.getAttribute("data-hue")];
      const hueValue = chroma(hueColor).hsl()[0];
      slider.value = Math.floor(hueValue);
    }
    if (slider.name === "bright") {
      const brightColor = initialcolors[slider.getAttribute("data-brigt")];
      const brightValue = chroma(brightColor).hsl()[2];
      slider.value = Math.floor(brightValue * 100) / 100;
    }
    if (slider.name === "saturation") {
      const satColor = initialcolors[slider.getAttribute("data-saturation")];
      const satValue = chroma(satColor).hsl()[1];
      slider.value = Math.floor(satValue * 100) / 100;
    }
  });
}

randomColors();
