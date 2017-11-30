;(function () {
  window.myViz = function init () {
    // private var for config, default values
    var width = 200
    var height = 200
    var padding = {top: 5, bottom: 5, left: 5, right: 5}
    var margin = {top: 10, bottom: 30, left: 40, right: 10}
    var y = 'y'
    var colors = null
    var labels = {x: '', y: ''}
    var curve = d3.curveLinear

    // the build/update function, where all the magic should happen
    function build (selection) {
      selection.each(function (data, index) {
        var element = d3.select(this)

        // useful area
        var outerw = width - margin.left - margin.right
        var outerh = height - margin.top - margin.bottom

        var innerw = outerw - padding.left - padding.right
        var innerh = outerh - padding.top - padding.bottom

        var container = element.selectAll('.mychart')
            .data([null])

        var eContainer = container.enter()
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`)
            .classed('mychart', true)

        container = container.merge(eContainer)

        eContainer.append('g')
            .append('rect')
            .classed('background', true)

        var back = container.select('.background')
            .attr('width', outerw)
            .attr('height', outerh)

        eContainer.append('g').classed('chart', true)
            .attr('transform', `translate(${padding.left},${padding.top})`)

        /*
            --------------------------------------
            Scale configurations
        */

        var mapx = d3.scaleLinear()
            .domain([0, data.length - 1])
            .range([0, innerw])

        var extent = d3.extent(data, d => getY(d))

        var mapy = d3.scaleLinear()
            .domain(extent)
            .nice()
            .range([innerh, 0])

        /*
            --------------------------------------
            The chart
        */
        var line = d3.line()
            .x((d, i) => mapx(i))
            .y(d => mapy(getY(d)))
            .curve(curve)

        eContainer.select('.chart')
            .append('path')
            .classed('line', true)

        container.select('.line')
            .attr('d', line(data))
            .style('stroke', colors)

        /*
            --------------------------------------
            Axis X
        */
        eContainer.append('g').classed('ax x', true)

        var x_axis = d3.axisBottom(mapx)

        container
            .select('.ax.x')
            .attr('transform', `translate(${padding.left},${outerh})`)
            .call(x_axis)

        eContainer.append('g').classed('ax y', true)

        /*
            --------------------------------------
            Axis X Label
        */
        eContainer.append('g').classed('x label', true)
            .append('text')

        container
            .select('.x.label')
            .attr('transform', `translate(${outerw / 2},${outerh + 25})`)
            .select('text')
            .text(labels.x)
            .style('text-anchor', 'middle')

        /*
            --------------------------------------
            Axis Y
        */
        var y_axis = d3.axisLeft(mapy)

        container
            .select('.ax.y')
            .attr('transform', `translate(0,${padding.top})`)
            .call(y_axis)

        /*
            --------------------------------------
            Axis Y Label
        */
        eContainer.append('g').classed('y label', true)
            .append('text')

        container
            .select('.y.label')
            .attr('transform', `rotate(-90), translate(${outerh / 2 * -1}, ${-30})`)
            .select('text')
            .text(labels.y)
            .style('text-anchor', 'middle')
      })
    }

    /*
        --------------------------------------
        Private functions
    */
    function setProps (obj, options) {
      for (var k in options) {
        if (obj.hasOwnProperty(k)) {
          obj[k] = options[k]
        }
      }
    }

    function getAccessor (d, a) {
      if (typeof a === 'string') {
        return d[a]
      } else if (typeof a === 'function') {
        return a(d)
      } else {
        return a
      }
    }

    function getY (d) {
      return getAccessor(d, y)
    }

    /*
        --------------------------------------
        Public interfaces
    */

    build.width = function (value) {
      if (!arguments.length) return width
      width = value
      return build
    }

    build.height = function (value) {
      if (!arguments.length) return height
      height = value
      return build
    }

    build.padding = function (options) {
      if (!arguments.length) return padding
      setProps(padding, options)
      return build
    }

    build.margin = function (options) {
      if (!arguments.length) return margin
      setProps(margin, options)
      return build
    }

    build.y = function (value) {
      if (!arguments.length) return y
      y = value
      return build
    }

    build.colors = function (value) {
      if (!arguments.length) return colors
      colors = value
      return build
    }

    build.labels = function (options) {
      if (!arguments.length) return labels
      setProps(labels, options)
      return build
    }

    build.curve = function (value) {
      if (!arguments.length) return curve
      curve = value
      return build
    }
    return build
  }
})()
