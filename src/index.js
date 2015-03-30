var BloomingMenu = (function() {
  'use strict';

  function BloomingMenu (opts) {
    // Enforces new
    if (!(this instanceof BloomingMenu)) {
      return new BloomingMenu(opts);
    }

    this.props = {}
    setProps.call(this, opts)
  }

  // Public
  // ------

  BloomingMenu.prototype.render = function() {
    createElements(this.props)
    setAnimation(this.props)
    bindEventListeners(this.props)
  };

  BloomingMenu.prototype.remove = function() {
    unbindEventListeners(this.props.elements)
    removeElements(this.props.elements)
  };

  // Private
  // -------

  function setProps (props) {
    props = props || {}

    //
    if (props.itensNum === undefined) {
      throw new Error('`opts.itensNum` must be declared')
    } else {
      this.props.itensNum = props.itensNum
    }

    this.props.startAngle = props.startAngle === undefined ? 90 : props.startAngle
    this.props.endAngle = props.endAngle === undefined ? 0 : props.endAngle
    this.props.radius = props.radius || 80
    this.props.itemAnimationDelay = props.itemAnimationDelay || 0.08
    this.props.fatherElement = props.fatherElement || document.body
    this.props.elements = {}
    this.props.itemWidth = props.itemWidth || 50
    this.props.containerCSSClass = props.containerCSSClass || 'blooming-menu__container'
    this.props.mainCSSClass = props.mainCSSClass || 'blooming-menu__main'
    this.props.mainContent = props.mainContent || '+'
    this.props.itensContainerCSSClass = props.itensContainerCSSClass || 'blooming-menu__itens'
    this.props.itensCSSClass = props.itensCSSClass || 'blooming-menu__item'
  }

  function createElements (props) {
    var docFragment = document.createDocumentFragment()

    //
    props.elements.styleSheet = document.createElement('style')
    document.head.appendChild(props.elements.styleSheet)

    // Creates container element
    props.elements.container = document.createElement('div')
    props.elements.container.classList.add(props.containerCSSClass)

    // Creates main element
    props.elements.mainContainer = document.createElement('div')
    props.elements.mainContainer.classList.add('blooming-menu__main-container')
    props.elements.main = document.createElement('button')
    props.elements.main.classList.add(props.mainCSSClass)
    props.elements.mainContent = document.createElement('span')
    props.elements.mainContent.classList.add('blooming-menu__main-content')
    props.elements.mainContent.innerHTML = props.mainContent
    props.elements.mainContainer.appendChild(props.elements.main)
    props.elements.main.appendChild(props.elements.mainContent)
    props.elements.container.appendChild(props.elements.mainContainer)

    // Creates itens
    props.elements.itens = []
    props.elements.itensContainer = document.createElement('ul')
    props.elements.itensContainer.classList.add(props.itensContainerCSSClass)
    props.elements.container.appendChild(props.elements.itensContainer)
    for (var i = 0; i < props.itensNum; i++) {
      var item = document.createElement('li')
      item.classList.add(props.itensCSSClass)
      var button = document.createElement('button')
      button.classList.add('blooming-menu__item-btn')
      item.appendChild(button)
      props.elements.itensContainer.appendChild(item)
      props.elements.itens.push(item)
    }

    props.fatherElement.appendChild(props.elements.container)
  }

  function setAnimation (props) {
    var angleStep =
      (props.endAngle - props.startAngle) / (props.itensNum - 1)
    var angleCur = props.startAngle

    props.elements.itens.forEach(function (item, index) {
      props.elements.styleSheet.sheet.insertRule(
        '.' + props.itensCSSClass + ':nth-of-type(' + (index + 1) + ') {' +
          'transition-delay: ' + (index * props.itemAnimationDelay) + 's;' +
          '-webkit-transition-delay: ' + (index * props.itemAnimationDelay) + 's;' +
        '}',
        0
      )

      var x = props.radius * Math.cos(toRadians(angleCur))
      var y = props.radius * Math.sin(toRadians(angleCur))
      x = String((x).toFixed(2)) + 'px'
      y = String((y).toFixed(2)) + 'px'

      props.elements.styleSheet.sheet.insertRule(
        '.' + props.itensCSSClass + '.is-active:nth-of-type(' + (index + 1) + ') {' +
          'transform: translate(' + x + ', ' + y + ');' +
          '-webkit-transform: translate(' + x + ', ' + y + ');' +
        '}',
        0
      )

      angleCur += angleStep
    })
  }

  function toRadians (angle) {
    return angle * (Math.PI / 180)
  }

  function bindEventListeners (props) {
    props.elements.main.addEventListener('click', function (event) {
      this.classList.toggle('is-active')

      props.elements.itens.forEach(function (item) {
        item.classList.toggle('is-active')
      })
    })

    props.elements.main.addEventListener('touchstart', function() {})
  }

  function unbindEventListeners (elements) {
    elements.main.removeEventListener('click')
    elements.main.removeEventListener('touchstart')
  }

  function removeElements (elements) {
    elements.container.parentNode.removeChild(elements.container)
  }

  return BloomingMenu;
}());
