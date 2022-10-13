//Create SVG element
var svg = d3.select("#chart-1 .chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var tooltip = d3.select("#chart-1")
  .append('div')
  .style('visibility', 'hidden')
  .attr('class', 'my-tooltip')
  .attr('id', 'tooltip-1')

// Add X scale
var xScale = d3.scaleLinear()
  .domain([0, 2700])
  .range([0, width - margin.right - margin.left])

// Define X axis and format tick marks
var xAxis = d3.axisBottom(xScale)
  // .tickFormat((d) => {
  //   if (d === 0) {
  //     return '$' + 0
  //   } else if (d > 999999) {
  //     return `$${d/1000000}M`
  //   } else {
  //     return `$${d/1000}K`
  //   }
  // })
  .ticks(tickNums)

var xGrid = d3.axisBottom(xScale)
  .tickSize(-height + (margin.top + margin.bottom), 0, 0)
  .tickFormat("")
  .ticks(tickNums)

// Render X grid
svg.append("g")
  .attr("transform", `translate(${margin.left},${height - margin.bottom})`)
  .attr("class", "grid")
  .style('color', 'black')
  .style('opacity', '0.2')
  .call(xGrid)

var yScale

d3.csv("corps.csv")
  .then(function(csv) {
    // Add Y scale
    yScale = d3.scaleBand()
      .range([margin.top, height - margin.bottom])
      .domain(csv.map(function(d) {
        return d.corp;
      }))
      .padding(.1)

    // Define Y axis
    var yAxis = d3.axisLeft(yScale)

    svg.selectAll("bars")
      .data(csv)
      .enter()
      .append("rect")
      .attr("x", margin.left)
      .attr("y", function(d) {
        return yScale(d.corp)
      })
      .attr("width", function(d) {
        return xScale(d.count);
      })
      .attr("height", yScale.bandwidth())
      .attr('class', (d) => {
        return `bar corp count ${d.corp.toLowerCase().replaceAll(' ', '-')}`
      })
      .style("fill", (d) => {
        return d.status === 'active' ? '#707C9C' : '#D5563A'
      })

    svg.selectAll("bars")
      .data(csv)
      .enter()
      .append("text")
      .text(function(d) {
        var count = true ? ' (' + numeral(d.count).format('0,0') + `${d.corp.includes('Invitation') ? ' SFRs)' : ')'}` : ''
        return d.corp + count
      })
      .attr('font-size', '11px')
      .attr("x", function(d) {
        let w = this.getBoundingClientRect().width
        if (w - 6 + xScale(d.count) > xScale.range()[1]) {
          return xScale(d.count) - w + margin.left

        } else {
          return xScale(d.count) + 3 + margin.left
        }
      })
      .attr("y", function(d) {
        return yScale(d.corp) + 11
      })
      .attr('class', (d) => {
        return `text corp count ${d.corp.toLowerCase().replaceAll(' ', '-')}`
      })
      .attr("fill", function(d) {
        let w = this.getBoundingClientRect().width
        if (w - 6 + xScale(d.count) > xScale.range()[1]) {
          return 'white'
        } else {
          return 'black'
        }
      })
      .attr("text-anchor", "start")

    // Render X axis
    svg.append("g")
      .attr("transform", `translate(${margin.left},${height - margin.bottom})`)
      .attr('class', 'x-axis')
      .call(xAxis)
      .style('color', 'black')
      .selectAll("text")
      .attr("transform", "translate(0,0)")
      .attr("text-anchor", "middle")

    //Render Y axis
    // svg.append("g")
    //   .attr("transform", `translate(${margin.left},0)`)
    //   .attr('class', 'y-axis')
    //   .style('color', 'black')
    //   .call(yAxis)
    //   .selectAll(".tick text")
    //   .style('text-anchor', 'end')
    //   .attr('class', (d) => {
    //     return 'corp ' + d.toLowerCase().replaceAll(' ', '-')
    //   })
    //   .call(wrapText, (margin.left + margin.right))
    //   .data(csv)
    //   .style('fill', (d) => {
    //     return d.status === 'active' ? 'black' : '#D5563A'
    //   })

    svg.append("rect")
      .attr("transform", `translate(0, ${margin.top})`)
      .attr("class", "hover-overlay")
      .attr("width", width)
      .attr("height", height - margin.bottom - margin.top)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .data([csv])
      .on("mouseover mousemove", function(d) {
        return mouseover(d, '1', tipText1, yScale)
      })
      .on("mouseout", () => {
        return mouseout('1')
      });

    d3.selectAll('.hover-overlay')
      .raise()
  })