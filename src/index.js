;(function () {
  'use strict'

  function BloomingMenu (opts) {
    // Enforces new
    if (!(this instanceof BloomingMenu)) {
      return new BloomingMenu(opts)
    }

    this.props = {}
    setProps.call(this, opts)

    this.state = {
      isOpen: false,
      isBeingAnimated: false
    }
  }

  // Public
  // ------

  BloomingMenu.prototype.render = function () {
    createElements(this.props)

    var css = getBaseCss(this.props)
    injectCss(css, this.props.elements.styleSheet)

    setAnimation(this.props)
    bindEventListeners(this)

    return this
  }

  BloomingMenu.prototype.remove = function () {
    unbindEventListeners(this)
    removeElements(this)

    return this
  }

  BloomingMenu.prototype.open = function () {
    this.props.elements.main.classList.add('is-active')

    this.props.elements.itens.forEach(function (item) {
      item.style.display = 'block'
      item.classList.remove('is-selected')
      item.classList.add('is-active')
    })

    this.state.isOpen = true

    return this
  }

  BloomingMenu.prototype.close = function () {
    this.props.elements.main.classList.remove('is-active')
    this.props.elements.main.classList.add('is-inactive')

    this.props.elements.itens.forEach(function (item) {
      item.classList.remove('is-active')
    })

    //
    var btnWrapper = document.querySelectorAll('.blooming-menu__item-btn-wrapper')
    ;[].forEach.call(btnWrapper, function (btnWrapper) {
      btnWrapper.classList.remove('is-selected')
      btnWrapper.classList.remove('is-not-selected')
    })

    this.state.isOpen = false

    return this
  }

  BloomingMenu.prototype.selectItem = function (index) {
    var self = this

    //
    var btnWrappers = document.querySelector('.blooming-menu__item-btn-wrapper')
    btnWrappers.addEventListener(animationEndEventName(), function () {
      self.close()

      self.props.elements.itens.forEach(function (item) {
        item.style.display = 'none'
      })

      document
        .querySelector('.blooming-menu__item-btn-wrapper')
        .removeEventListener(animationEndEventName())
    })

    this.props.elements.itens.forEach(function (item, index_) {
      if (index_ !== index) {
        item
          .querySelector('.blooming-menu__item-btn-wrapper')
          .classList
          .add('is-not-selected')
      } else {
        item
          .querySelector('.blooming-menu__item-btn-wrapper')
          .classList
          .add('is-selected')
      }
    })

    return this
  }

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
    this.props.itemAnimationDelay = props.itemAnimationDelay || 0.04
    this.props.animationDuration = props.animationDuration || 0.4
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
    // var docFragment = document.createDocumentFragment()

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
      item.style.opacity = 0

      var buttonWrapper = document.createElement('div')
      buttonWrapper.classList.add('blooming-menu__item-btn-wrapper')

      var button = document.createElement('button')
      button.classList.add('blooming-menu__item-btn')

      buttonWrapper.appendChild(button)
      item.appendChild(buttonWrapper)
      props.elements.itensContainer.appendChild(item)
      props.elements.itens.push(item)
    }

    props.fatherElement.appendChild(props.elements.container)

    // Prevents the first animation when the elements are rendered
    setTimeout(function () {
      props.elements.itens.forEach(function (item) {
        item.style.opacity = 1
      })
    }, ((props.itemAnimationDelay * props.itensNum) + props.animationDuration) * 1000)
  }

  function getBaseCss (props) {
    var cssRules = ''

    // Container
    // ---------

    cssRules +=
      '.' + props.containerCSSClass + ',' +
      '.' + props.containerCSSClass + ' * {' +
      '  box-sizing: border-box;' +
      '  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);' +
      '  outline: none;' +
      '  margin: 0;' +
      '  padding: 0;' +
      '}'

    cssRules +=
      '.' + props.containerCSSClass + ' {' +
      ' position: absolute;' +
      '  left: 50%;' +
      '  top: 50%;' +
      '  -webkit-transform: translate(-50%, -50%);' +
      '  transform: translate(-50%, -50%);' +
      '  width: 50px;' +
      '  height: 50px;' +
      '  border-radius: 50%;' +
      '  -webkit-user-select: none;' +
      '  -moz-user-select: none;' +
      '  -ms-user-select: none;' +
      '  user-select: none;' +
      '}'

    cssRules +=
      '.' + props.containerCSSClass + ' {' +
      '  transition: box-shadow .28s cubic-bezier(.4,0,.2,1);' +
      '  box-shadow: 0 2px 5px 0 rgba(0,0,0,.26);' +
      '  width: 50px;' +
      '  height: 50px;' +
      '  border-radius: 50%;' +
      '}'

    cssRules +=
      '.' + props.containerCSSClass + ':hover {' +
      '  box-shadow: 0 8px 17px 0 rgba(0,0,0,.2);' +
      '}'

    // Main
    // ----

    cssRules +=
      '.' + props.mainCSSClass + ' {' +
      '  border-radius: 50%;' +
      '  width: 50px;' +
      '  height: 50px;' +
      '  position: absolute;' +
      '  z-index: 1;' +
      '  cursor: pointer;' +
      '  transition: all .28s cubic-bezier(.4,0,.2,1);' +
      '  border: none;' +
      '  background-color: #A974A2;' +
      '  color: white;' +
      '}'

    cssRules +=
      '.' + props.mainCSSClass + '.is-active {' +
      '  -webkit-transform: rotate(45deg);' +
      '  transform: rotate(45deg);' +
      '}'

    cssRules +=
      '.blooming-menu__main-content {' +
      '  font-size: 32px;' +
      '  line-height: 60%;' +
      '  position: relative;' +
      '}'

    cssRules +=
      '.blooming-menu__main.is-active .blooming-menu__main-content {' +
      '  -webkit-transform: rotate(45deg);' +
      '  transform: rotate(45deg);' +
      '}'

    // Itens
    // -----

    cssRules +=
    '.' + props.itensCSSClass + ' {' +
    '  position: absolute;' +
    '  bottom: 5px;' +
    '  left: 5px;' +
    '  transition:' +
    '    -webkit-transform .28s cubic-bezier(.4,0,.2,1),' +
    '    opacity .28s cubic-bezier(.4,0,.2,1)' +
    '  ;' +
    '  transition:' +
    '    transform .28s cubic-bezier(.4,0,.2,1),' +
    '    opacity .28s cubic-bezier(.4,0,.2,1)' +
    '  ;' +
    '  width: 40px;' +
    '  height: 40px;' +
    '  border-radius: 50%;' +
    '}'

    cssRules +=
      '.' + props.itensContainerCSSClass + ' {' +
      '  list-style-type: none;' +
      '}'

    cssRules +=
      '.blooming-menu__item-btn-wrapper {' +
      '  width: 100%;' +
      '  height: 100%;' +
      '  background-color: #6B9EB8;' +
      '  border-radius: 50%;' +
      '}'

    cssRules +=
      '.blooming-menu__item-btn {' +
      '  cursor: pointer;' +
      '  border-radius: 50%;' +
      '  border: none;' +
      '  background-color: transparent;' +
      '  width: 100%;' +
      '  height: 100%;' +
      '  box-shadow: 0 2px 5px 0 rgba(0,0,0,.26);' +
      '  transition:' +
      '    box-shadow .28s cubic-bezier(.4,0,.2,1),' +
      '    opacity .28s cubic-bezier(.4,0,.2,1)' +
      '  ;' +
      '  background-size: 50%;' +
      '  background-position: center center;' +
      '  background-repeat: no-repeat;' +
      '  opacity: 0.8;' +
      '}'

      return cssRules
  }

  function injectCss (css, styleElement) {
    styleElement.innerHTML += css
  }

  function setAnimation (props) {
    var angleStep =
      (props.endAngle - props.startAngle) / (props.itensNum - 1)
    var angleCur = props.startAngle
    var cssRules = ''

    props.elements.itens.forEach(function (item, index) {
      var x = props.radius * Math.cos(toRadians(angleCur))
      var y = props.radius * Math.sin(toRadians(angleCur))
      var x3 = Number((x).toFixed(2))
      var y3 = Number((y).toFixed(2))
      var x2 = x3 * 1.2
      var y2 = y3 * 1.2
      // var x1 = x3 * 0.7
      // var y1 = y3 * 0.7
      var x0 = 0
      var y0 = 0

      //
      cssRules +=
        '@keyframes expand-item-' + index + ' {' +
          '0% {' +
            'transform: translate(' + x0 + 'px, ' + y0 + 'px)' +
          '}' +
          '70% {' +
            'transform: translate(' + x2 + 'px, ' + y2 + 'px)' +
          '}' +
          '100% {' +
            'transform: translate(' + x3 + 'px, ' + y3 + 'px)' +
          '}' +
        '}' +
        '@-webkit-keyframes expand-item-' + index + ' {' +
          '0% {' +
            '-webkit-transform: translate(' + x0 + 'px, ' + y0 + 'px)' +
          '}' +
          '70% {' +
            '-webkit-transform: translate(' + x2 + 'px, ' + y2 + 'px)' +
          '}' +
          '100% {' +
            '-webkit-transform: translate(' + x3 + 'px, ' + y3 + 'px)' +
          '}' +
        '}'

      //
      cssRules +=
        '@keyframes contract-item-' + index + ' {' +
          '100% {' +
            'transform: translate(' + x0 + 'px, ' + y0 + 'px)' +
          '}' +
          '30% {' +
            'transform: translate(' + x2 + 'px, ' + y2 + 'px)' +
          '}' +
          '0% {' +
            'transform: translate(' + x3 + 'px, ' + y3 + 'px)' +
          '}' +
        '}' +
        '@-webkit-keyframes contract-item-' + index + ' {' +
          '100% {' +
            '-webkit-transform: translate(' + x0 + 'px, ' + y0 + 'px)' +
          '}' +
          '30% {' +
            '-webkit-transform: translate(' + x2 + 'px, ' + y2 + 'px)' +
          '}' +
          '0% {' +
            '-webkit-transform: translate(' + x3 + 'px, ' + y3 + 'px)' +
          '}' +
        '}'

      //
      cssRules +=
        '.' + props.itensCSSClass + ':nth-of-type(' + (index + 1) + ') {' +
          'animation-delay: ' + (index * props.itemAnimationDelay) + 's;' +
          'animation-duration: ' + props.animationDuration + 's;' +
          'animation-timing-function: ease-out;' +
          'animation-name: contract-item-' + index + ';' +
          'animation-fill-mode: backwards;' +
        '}' +
        '.' + props.itensCSSClass + ':nth-of-type(' + (index + 1) + ') {' +
          '-webkit-animation-delay: ' + (index * props.itemAnimationDelay) + 's;' +
          '-webkit-animation-duration: ' + props.animationDuration + 's;' +
          '-webkit-animation-timing-function: ease-out;' +
          '-webkit-animation-name: contract-item-' + index + ';' +
          '-webkit-animation-fill-mode: backwards;' +
        '}'

      //
      cssRules +=
        '.' + props.itensCSSClass + '.is-active:nth-of-type(' + (index + 1) + ') {' +
          'animation-name: expand-item-' + index + ';' +
          'animation-fill-mode: forwards;' +
        '}' +
        '.' + props.itensCSSClass + '.is-active:nth-of-type(' + (index + 1) + ') {' +
          '-webkit-animation-name: expand-item-' + index + ';' +
          '-webkit-animation-fill-mode: forwards;' +
        '}'

      //
      cssRules +=
        '.' + props.itensCSSClass + ':nth-of-type(' + (index + 1) + ') .blooming-menu__item-btn-wrapper.is-selected {' +
          'animation-name: select-item;' +
          'animation-fill-mode: forwards;' +
          'animation-duration: ' + props.animationDuration + 's;' +
          'animation-timing-function: ease-out;' +
        '}' +
        '.' + props.itensCSSClass + ':nth-of-type(' + (index + 1) + ') .blooming-menu__item-btn-wrapper.is-selected {' +
          '-webkit-animation-name: select-item;' +
          '-webkit-animation-fill-mode: forwards;' +
          '-webkit-animation-duration: ' + props.animationDuration + 's;' +
          '-webkit-animation-timing-function: ease-out;' +
        '}'

      cssRules +=
        '.' + props.itensCSSClass + ':nth-of-type(' + (index + 1) + ') .blooming-menu__item-btn-wrapper.is-not-selected {' +
          'animation-name: not-select-item;' +
          'animation-fill-mode: forwards;' +
          'animation-duration: ' + props.animationDuration + 's;' +
          'animation-timing-function: ease-out;' +
        '}' +
        '.' + props.itensCSSClass + ':nth-of-type(' + (index + 1) + ') .blooming-menu__item-btn-wrapper.is-not-selected {' +
          '-webkit-animation-name: not-select-item;' +
          '-webkit-animation-fill-mode: forwards;' +
          '-webkit-animation-duration: ' + props.animationDuration + 's;' +
          '-webkit-animation-timing-function: ease-out;' +
        '}'

      angleCur += angleStep
    })

    //
    cssRules +=
      '@keyframes select-item {' +
        '0% {' +
          'transform: scale(1);' +
          'opacity: 1;' +
        '}' +
        '100% {' +
          'transform: scale(2);' +
          'opacity: 0;' +
        '}' +
      '}' +
      '@-webkit-keyframes select-item {' +
        '0% {' +
          '-webkit-transform: scale(1);' +
          'opacity: 1;' +
        '}' +
        '100% {' +
          '-webkit-transform: scale(2);' +
          'opacity: 0;' +
        '}' +
      '}'

    //
    cssRules +=
      '@keyframes not-select-item {' +
        '0% {' +
          'transform: scale(1);' +
          'opacity: 1;' +
        '}' +
        '100% {' +
          'transform: scale(0);' +
          'opacity: 0;' +
        '}' +
      '}' +
      '@-webkit-keyframes not-select-item {' +
        '0% {' +
          '-webkit-transform: scale(1);' +
          'opacity: 1;' +
        '}' +
        '100% {' +
          '-webkit-transform: scale(0);' +
          'opacity: 0;' +
        '}' +
      '}'

    props.elements.styleSheet.innerHTML += cssRules
  }

  function toRadians (angle) {
    return angle * (Math.PI / 180)
  }

  function removeElements (elements) {
    elements.container.parentNode.removeChild(elements.container)
  }

  function animationEndEventName () {
    var animation
    var el = document.createElement('fakeelement')
    var animations = {
      'animation': 'animationend',
      'webkitAnimation': 'webkitAnimationEnd'
    }

    for (animation in animations) {
      if (el.style[animation] !== undefined) {
        return animations[animation]
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Event listeners

  function bindEventListeners (self) {
    self.props.elements.main.addEventListener('click', function (event) {
      if (self.state.isOpen) {
        self.close()
      } else {
        self.open()
      }
    })

    self.props.elements.itens.forEach(function (item, index) {
      item.addEventListener('click', function (event) {
        self.selectItem(index)
      })
    })
  }

  function unbindEventListeners (self) {
    self.props.elements.main.removeEventListener('click')
    self.props.elements.main.removeEventListener('touchstart')
  }

  // Export module
  // -------------

  if (typeof module !== 'undefined' &&
      typeof module.exports !== 'undefined') {
    module.exports = BloomingMenu
  } else if (typeof window !== 'undefined') {
    window.BloomingMenu = BloomingMenu
  }
}())
