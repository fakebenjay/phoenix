var bisectCorp = d3.bisector(function(d) {
  return yScale(d.corp);
}).left

function tipText1(values) {
  // var avgs = `<div class="tooltip-right"><small>Total contributions: ${numeral(values.count).format('0,0')}<br/>Average contribution: ${numeral(values.avg).format('$0,0[.]00')}</small></div>`
  // var dropout = values.status === 'active' ? '' : `<div class="tooltip-right" style="color:#d5563A;line-height:normal;"><small>${values.detail}</small></div></div>`
  return `<span class='quit'>x</span>
  <div class="tooltip-container">
  <div class="tooltip-top">
  <h2>${values.corp}</h2>
  owns <strong style="font-size:12pt;">${numeral(values.count).format('0,0')}</strong> detached single family rental properties in Phoenix.
  <br/><br/>
  That's <strong style="font-size:12pt;">${numeral(values.pctOfCorp).format('0[.]0%')}</strong> of the properties owned by Phoenix's top 25 corporate detached SFR holders<br/><br/>and <strong style="font-size:12pt;">1&nbsp;in&nbsp;every&nbsp;${numeral(1/values.pctOfAll).format('0,0')}</strong> detached SFRs in Phoenix.
  </div>`
}

// function tipText2(values) {
//   var avgs = `<small>Total contributions: ${numeral(values.count).format('0,0')}<br/>Average contribution: ${numeral(values.avg).format('$0,0[.]00')}</small>`
//   return `<span class='quit'>x</span><div class="tooltip-container"><div class="tooltip-top"><strong>${values.firm}</strong> attys contributed a total of <strong>${numeral(values.amount).format('$0,0[.]00')}</strong> to New York mayoral corps, <strong>${numeral(values.new).format('$0,0[.]00')}</strong> of which came on or after Jan. 12, 2021 (<strong>${numeral(values.new/values.amount).format('0%')}</strong> of total.)</div><br/>${avgs}</div>`
// }

function mouseover(data, i, tipText, scale) {
  var bisectFunction = bisectCorp,
    key = 'corp'

  var y0 = d3.mouse(event.target)[1] + (scale(data[0][key]) - scale.bandwidth()) + scale.bandwidth() * .2,
    j = bisectFunction(data, y0, 1)

  var d0 = data[j - 1] !== 'dummy' ? data[j - 1] : data[j],
    d1 = j < data.length ? data[j] : data[j - 1]

  var d = y0 - scale(d0[key]) > scale(d1[key]) - y0 ? d1 : d0;

  var html = tipText(d)

  d3.select(`#tooltip-${i}`)
    .html(html)
    .attr('display', 'block')
    .style("visibility", "visible")
    .style('top', topTT(i))
    .style('left', leftTT(i))

  d3.select(`#tooltip-${i} .quit`)
    .on('click', () => {
      d3.select(`#tooltip-${i}`)
        .html("")
        .attr('display', 'none')
        .style("visibility", "hidden")
        .style("left", null)
        .style("top", null);
    })
}

function mouseout(i) {
  if (window.innerWidth > 767) {
    d3.select(`#tooltip-${i}`)
      .html("")
      .attr('display', 'none')
      .style("visibility", "hidden")
      .style("left", null)
      .style("top", null);
  }
}

function topTT(d) {
  var offsetParent = document.querySelector(`#chart-${d} .chart`).offsetParent
  var offY = offsetParent.offsetTop
  var cursorY = 5

  var windowWidth = window.innerWidth
  var ch = document.querySelector(`#tooltip-${d}`).clientHeight
  var cy = d3.event.pageY - offY
  var windowHeight = window.innerHeight
  if (windowWidth > 767) {
    if (ch + cy >= windowHeight) {
      return cy - (ch / 2) + "px"
    } else {
      return cy - 28 + "px"
    }
  }
}

function leftTT(d) {
  var offsetParent = document.querySelector(`#chart-${d} .chart`).offsetParent
  var offX = offsetParent.offsetLeft
  var cursorX = 10

  var windowWidth = window.innerWidth
  var cw = document.querySelector(`#tooltip-${d}`).clientWidth
  var cx = d3.event.pageX - offX
  var bodyWidth = document.querySelector(`#chart-${d} .chart`).clientWidth

  if (windowWidth > 767) {
    if (cw + cx >= bodyWidth) {
      document.querySelector(`#tooltip-${d}`).className = 'my-tooltip box-shadow-left'
      return cx - cw - cursorX + "px"
    } else {
      document.querySelector(`#tooltip-${d}`).className = 'my-tooltip box-shadow-right'
      return cx + cursorX + "px"
    }
  }
}