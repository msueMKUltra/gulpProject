const btoa = window.btoa

const toDataURL = (svgText) => {
  return 'data:image/svg+xml;charset=utf-8;base64,' + btoa(encodeURIComponent(svgText).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1)))
}

const initCanvas = (svgDataURL, width, height) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    const image = new window.Image()
    canvas.width = width
    canvas.height = height
    image.onload = () => {
      context.drawImage(image, 0, 0)
      resolve(canvas)
    }
    image.src = svgDataURL
  })
}

const privates = new WeakMap()

const getSVGDataURL = (self) => {
  return privates.get(self).svgDataURL
}

const getCanvas = (self) => {
  return privates.get(self).canvas
}

class SVGConverter {
  static load (svgText, width, height) {
    const dataURL = toDataURL(svgText)
    return initCanvas(dataURL, width, height).then((canvas) => {
      return new SVGConverter(dataURL, canvas)
    })
  }

  static loadFromElement (original) {
    const {width, height} = original.getBoundingClientRect()
    const svg = original.cloneNode(true)
    svg.setAttributeNS(null, 'version', '1.1')
    svg.setAttributeNS(null, 'width', width)
    svg.setAttributeNS(null, 'height', height)
    svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', 'http://www.w3.org/2000/svg')
    svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink')
    return SVGConverter.load(svg.outerHTML, width, height)
  }

  constructor (svgDataURL, canvas) {
    privates.set(this, {
      svgDataURL,
      canvas
    })
  }

  svgDataURL () {
    return getSVGDataURL(this)
  }

  pngDataURL () {
    return getCanvas(this).toDataURL('image/png')
  }

  jpegDataURL () {
    return getCanvas(this).toDataURL('image/jpeg')
  }
}


const css = `.download-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  display: inline-block;
  float: left;
  min-width: 160px;
  padding: 5px 0;
  margin: 2px 0 0;
  list-style: none;
  font-size: 14px;
  background-color: #fff;
  border: 1px solid #ccc;
  border: 1px solid rgba(0,0,0,.15);
  border-radius: 4px;
  -webkit-box-shadow: 0 6px 12px rgba(0,0,0,.175);
  box-shadow: 0 6px 12px rgba(0,0,0,.175);
  background-clip: padding-box;
}

.download-menu>li>a {
  display: block;
  padding: 3px 20px;
  clear: both;
  font-weight: 400;
  line-height: 1.42857143;
  color: #333;
  white-space: nowrap;
  text-decoration: none;
  background: 0 0;
}

.download-menu>li>a:hover, .download-menu>li>a:focus {
  text-decoration: none;
  color: #262626;
  background-color: #f5f5f5;
}`

const createMenu = (pos, filename, converter) => {
  const menu = d3.select('body')
    .append('ul')
    .classed('download-menu', true)
    .style('left', `${pos[0]}px`)
    .style('top', `${pos[1]}px`)
    .on('mouseleave', () => {
      menu.remove()
    })
  const list = menu
    .append('li')
  list
    .append('a')
    .text('Save as SVG')
    .attr('download', filename + '.svg')
    .attr('href', converter.svgDataURL())
  list
    .append('a')
    .text('Save as PNG')
    .attr('download', filename + '.png')
    .attr('href', converter.pngDataURL())
  list
    .append('a')
    .text('Save as JPG')
    .attr('download', filename + '.jpeg')
    .attr('href', converter.jpegDataURL())
}

const downloadable = () => {
  let filename = 'image'

  const downloadableImpl = (selection) => {
    if (d3.select('#downloadable-css').empty()) {
      d3.select('head')
        .append('style')
        .attr('id', 'downloadable-css')
        .text(css)
    }

    selection.on('contextmenu', () => {
      const pos = d3.mouse(document.body)
      SVGConverter.loadFromElement(selection.node()).then((converter) => {
        createMenu(pos, filename, converter)
      })
      d3.event.preventDefault()
    })
  }

  downloadableImpl.filename = function () {
    if (arguments.length === 0) {
      return filename
    }
    filename = arguments[0]
    return downloadableImpl
  }

  return downloadableImpl
}

//這隻檔案是d3-downloadable和svg-dataurl合併的
//因為會出現require的問題
//需要在nodejs下執行
//所以拿掉import和exprot相關的程式碼
//直接在html裡script src這隻檔案

