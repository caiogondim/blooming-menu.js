;(function () {
  'use strict'

  var CONTAINER_CSS_CLASS = 'container'
  var MAIN_CONTAINER_CSS_CLASS = 'main-container'
  var MAIN_CSS_CLASS = 'main'
  var MAIN_CONTENT_CSS_CLASS = 'main-content'
  var ITEMS_CONTAINER_CSS_CLASS = 'items'
  var ITEM_BTN_WRAPPER_CSS_CLASS = 'item-btn-wrapper'
  var ITEM_CSS_CLASS = 'item'
  var ITEM_BTN_CSS_CLASS = 'item-btn'

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
    var css = ''

    createElements(this.props)

    if (this.props.injectBaseCSS) {
      css = getBaseCss(this.props)
      injectCss(css, this.props.elements.styleSheet)
    }

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

    this.props.elements.items.forEach(function (item) {
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

    this.props.elements.items.forEach(function (item) {
      item.classList.remove('is-active')
      item.classList.remove('is-selected')
      item.classList.remove('is-not-selected')
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

      self.props.elements.items.forEach(function (item) {
        item.style.display = 'none'
      })

      document
        .querySelector('.blooming-menu__item-btn-wrapper')
        .removeEventListener(animationEndEventName())
    })

    this.props.elements.items.forEach(function (item, index_) {
      if (index_ !== index) {
        item
          .classList
          .add('is-not-selected')
      } else {
        item
          .classList
          .add('is-selected')
      }
    })

    this.props.elements.main.classList.remove('is-active')

    return this
  }

  // Private
  // -------

  function setProps (props) {
    props = props || {}

    //
    if (props.itemsNum === undefined) {
      throw new Error('`opts.itemsNum` must be declared')
    } else {
      this.props.itemsNum = props.itemsNum
    }

    this.props.injectBaseCSS = props.injectBaseCSS === undefined ? true : false
    this.props.startAngle = props.startAngle === undefined ? 90 : props.startAngle
    this.props.endAngle = props.endAngle === undefined ? 0 : props.endAngle
    this.props.radius = props.radius || 80
    this.props.itemAnimationDelay = props.itemAnimationDelay || 0.04
    this.props.animationDuration = props.animationDuration || 0.4
    this.props.fatherElement = props.fatherElement || document.body
    this.props.elements = {}
    this.props.itemWidth = props.itemWidth || 50
    this.props.mainContent = props.mainContent || '+'
    this.props.CSSClassPrefix = props.CSSClassPrefix || 'blooming-menu__'
  }

  function createElements (props) {
    // var docFragment = document.createDocumentFragment()
    var cssClassPrefix = props.CSSClassPrefix

    //
    props.elements.styleSheet = document.createElement('style')
    document.head.appendChild(props.elements.styleSheet)

    // Creates container element
    props.elements.container = document.createElement('div')
    props.elements.container.classList.add(cssClassPrefix + CONTAINER_CSS_CLASS)

    // Creates main element
    props.elements.mainContainer = document.createElement('div')
    props.elements.mainContainer.classList.add(cssClassPrefix + MAIN_CONTAINER_CSS_CLASS)
    props.elements.main = document.createElement('button')
    props.elements.main.classList.add(cssClassPrefix + MAIN_CSS_CLASS)
    props.elements.mainContent = document.createElement('span')
    props.elements.mainContent.classList.add(cssClassPrefix + MAIN_CONTENT_CSS_CLASS)
    props.elements.mainContent.innerHTML = props.mainContent
    props.elements.mainContainer.appendChild(props.elements.main)
    props.elements.main.appendChild(props.elements.mainContent)
    props.elements.container.appendChild(props.elements.mainContainer)

    // Creates items
    props.elements.items = []
    props.elements.itemsContainer = document.createElement('ul')
    props.elements.itemsContainer.classList.add(cssClassPrefix + ITEMS_CONTAINER_CSS_CLASS)
    props.elements.container.appendChild(props.elements.itemsContainer)
    for (var i = 0; i < props.itemsNum; i++) {
      var item = document.createElement('li')
      item.classList.add(cssClassPrefix + ITEM_CSS_CLASS)
      item.style.opacity = 0

      var buttonWrapper = document.createElement('div')
      buttonWrapper.classList.add(cssClassPrefix + ITEM_BTN_WRAPPER_CSS_CLASS)

      var button = document.createElement('button')
      button.classList.add(cssClassPrefix + ITEM_BTN_CSS_CLASS)

      buttonWrapper.appendChild(button)
      item.appendChild(buttonWrapper)
      props.elements.itemsContainer.appendChild(item)
      props.elements.items.push(item)
    }

    props.fatherElement.appendChild(props.elements.container)

    // Prevents the first animation when the elements are rendered
    setTimeout(function () {
      props.elements.items.forEach(function (item) {
        item.style.opacity = 1
      })
    }, ((props.itemAnimationDelay * props.itemsNum) + props.animationDuration) * 1000)
  }

  function getBaseCss (props) {
    var cssClassPrefix = props.CSSClassPrefix
    var cssRules = ''

    // Container
    // ---------

    cssRules +=
      '.' + cssClassPrefix + CONTAINER_CSS_CLASS + ',' +
      '.' + cssClassPrefix + CONTAINER_CSS_CLASS + ' * {' +
      '  box-sizing: border-box;' +
      '  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);' +
      '  outline: none;' +
      '  margin: 0;' +
      '  padding: 0;' +
      '}'

    cssRules +=
      '.' + cssClassPrefix + CONTAINER_CSS_CLASS + ' {' +
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
      '.' + cssClassPrefix + CONTAINER_CSS_CLASS + ' {' +
      '  transition: box-shadow .28s cubic-bezier(.4,0,.2,1);' +
      '  box-shadow: 0 2px 5px 0 rgba(0,0,0,.26);' +
      '  width: 50px;' +
      '  height: 50px;' +
      '  border-radius: 50%;' +
      '}'

    // Main
    // ----

    cssRules +=
      '.' + cssClassPrefix + MAIN_CSS_CLASS + ' {' +
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
      '.' + cssClassPrefix + MAIN_CSS_CLASS + ':hover {' +
      '  box-shadow: 0 8px 17px 0 rgba(0,0,0,.2);' +
      '}'

    cssRules +=
      '.' + cssClassPrefix + MAIN_CSS_CLASS + '.is-active {' +
      '  -webkit-transform: rotate(45deg);' +
      '  transform: rotate(45deg);' +
      '}'

    cssRules +=
      '.' + cssClassPrefix + MAIN_CONTENT_CSS_CLASS + ' {' +
      '  font-size: 32px;' +
      '  line-height: 60%;' +
      '  position: relative;' +
      '}'

    cssRules +=
      '.' + cssClassPrefix + MAIN_CSS_CLASS + '.is-active .' + cssClassPrefix + MAIN_CONTENT_CSS_CLASS + ' {' +
      '  -webkit-transform: rotate(45deg);' +
      '  transform: rotate(45deg);' +
      '}'

    // Items
    // -----

    cssRules +=
      '.' + cssClassPrefix + ITEM_CSS_CLASS + ' {' +
      '  position: absolute;' +
      '  bottom: 5px;' +
      '  left: 5px;' +
      '  transition:' +
      '    -webkit-transform .28s cubic-bezier(.4,0,.2,1),' +
      '    box-shadow .28s cubic-bezier(.4,0,.2,1),' +
      '    opacity .28s cubic-bezier(.4,0,.2,1)' +
      '  ;' +
      '  transition:' +
      '    transform .28s cubic-bezier(.4,0,.2,1),' +
      '    box-shadow .28s cubic-bezier(.4,0,.2,1),' +
      '    opacity .28s cubic-bezier(.4,0,.2,1)' +
      '  ;' +
      '  width: 40px;' +
      '  height: 40px;' +
      '  border-radius: 50%;' +
      '}'

    cssRules +=
      '.' + cssClassPrefix + ITEM_CSS_CLASS + ':hover {' +
      '  box-shadow: 0 8px 17px 0 rgba(0,0,0,.2);' +
      '}'

    cssRules +=
      '.' + cssClassPrefix + ITEM_CSS_CLASS + '.is-selected:hover {' +
      '  box-shadow: 0 0 0 0;' +
      '  transition: box-shadow 0s;' +
      '}'

    cssRules +=
    '.' + cssClassPrefix + ITEMS_CONTAINER_CSS_CLASS + ' {' +
      '  list-style-type: none;' +
      '}'

    cssRules +=
      '.' + cssClassPrefix + ITEM_BTN_WRAPPER_CSS_CLASS + ' {' +
      '  width: 100%;' +
      '  height: 100%;' +
      '  background-color: #6B9EB8;' +
      '  border-radius: 50%;' +
      '}'

    cssRules +=
    '.' + cssClassPrefix + ITEM_BTN_CSS_CLASS + ' {' +
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
      (props.endAngle - props.startAngle) / (props.itemsNum - 1)
    var angleCur = props.startAngle
    var cssRules = ''
    var cssClassPrefix = props.CSSClassPrefix

    props.elements.items.forEach(function (item, index) {
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
        '@keyframes ' + cssClassPrefix + 'expand-item-' + index + ' {' +
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
        '@-webkit-keyframes ' + cssClassPrefix + 'expand-item-' + index + ' {' +
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
        '@keyframes ' + cssClassPrefix + 'contract-item-' + index + ' {' +
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
        '@-webkit-keyframes ' + cssClassPrefix + 'contract-item-' + index + ' {' +
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
        '.' + cssClassPrefix + ITEM_CSS_CLASS + ':nth-of-type(' + (index + 1) + ') {' +
          'animation-delay: ' + (index * props.itemAnimationDelay) + 's;' +
          'animation-duration: ' + props.animationDuration + 's;' +
          'animation-timing-function: ease-out;' +
          'animation-name: ' + cssClassPrefix + 'contract-item-' + index + ';' +
          'animation-fill-mode: backwards;' +
        '}' +
        '.' + cssClassPrefix + ITEM_CSS_CLASS + ':nth-of-type(' + (index + 1) + ') {' +
          '-webkit-animation-delay: ' + (index * props.itemAnimationDelay) + 's;' +
          '-webkit-animation-duration: ' + props.animationDuration + 's;' +
          '-webkit-animation-timing-function: ease-out;' +
          '-webkit-animation-name: ' + cssClassPrefix + 'contract-item-' + index + ';' +
          '-webkit-animation-fill-mode: backwards;' +
        '}'

      //
      cssRules +=
        '.' + cssClassPrefix + ITEM_CSS_CLASS + '.is-active:nth-of-type(' + (index + 1) + ') {' +
          'animation-name: ' + cssClassPrefix + 'expand-item-' + index + ';' +
          'animation-fill-mode: forwards;' +
        '}' +
        '.' + cssClassPrefix + ITEM_CSS_CLASS + '.is-active:nth-of-type(' + (index + 1) + ') {' +
          '-webkit-animation-name: ' + cssClassPrefix + 'expand-item-' + index + ';' +
          '-webkit-animation-fill-mode: forwards;' +
        '}'

      //
      cssRules +=
        '.' + cssClassPrefix + ITEM_CSS_CLASS + ':nth-of-type(' + (index + 1) + ').is-selected .' + cssClassPrefix + ITEM_BTN_WRAPPER_CSS_CLASS + ' {' +
          'animation-name: ' + cssClassPrefix + 'select-item;' +
          'animation-fill-mode: forwards;' +
          'animation-duration: ' + props.animationDuration + 's;' +
          'animation-timing-function: ease-out;' +
        '}' +
        '.' + cssClassPrefix + ITEM_CSS_CLASS + ':nth-of-type(' + (index + 1) + ').is-selected .' + cssClassPrefix + ITEM_BTN_WRAPPER_CSS_CLASS + ' {' +
          '-webkit-animation-name: ' + cssClassPrefix + 'select-item;' +
          '-webkit-animation-fill-mode: forwards;' +
          '-webkit-animation-duration: ' + props.animationDuration + 's;' +
          '-webkit-animation-timing-function: ease-out;' +
        '}'

      cssRules +=
        '.' + cssClassPrefix + ITEM_CSS_CLASS + ':nth-of-type(' + (index + 1) + ').is-not-selected .' + cssClassPrefix + ITEM_BTN_WRAPPER_CSS_CLASS + ' {' +
          'animation-name: ' + cssClassPrefix + 'not-select-item;' +
          'animation-fill-mode: forwards;' +
          'animation-duration: ' + props.animationDuration + 's;' +
          'animation-timing-function: ease-out;' +
        '}' +
        '.' + cssClassPrefix + ITEM_CSS_CLASS + ':nth-of-type(' + (index + 1) + ').is-not-selected .' + cssClassPrefix + ITEM_BTN_WRAPPER_CSS_CLASS + ' {' +
          '-webkit-animation-name: ' + cssClassPrefix + 'not-select-item;' +
          '-webkit-animation-fill-mode: forwards;' +
          '-webkit-animation-duration: ' + props.animationDuration + 's;' +
          '-webkit-animation-timing-function: ease-out;' +
        '}'

      angleCur += angleStep
    })

    //
    cssRules +=
      '@keyframes ' + cssClassPrefix + 'select-item {' +
        '0% {' +
          'transform: scale(1);' +
          'opacity: 1;' +
        '}' +
        '100% {' +
          'transform: scale(2);' +
          'opacity: 0;' +
        '}' +
      '}' +
      '@-webkit-keyframes ' + cssClassPrefix + 'select-item {' +
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
      '@keyframes ' + cssClassPrefix + 'not-select-item {' +
        '0% {' +
          'transform: scale(1);' +
          'opacity: 1;' +
        '}' +
        '100% {' +
          'transform: scale(0);' +
          'opacity: 0;' +
        '}' +
      '}' +
      '@-webkit-keyframes ' + cssClassPrefix + 'not-select-item {' +
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

  // Event listeners
  // ---------------

  function bindEventListeners (self) {
    self.props.elements.main.addEventListener('click', function (event) {
      if (self.state.isOpen) {
        self.close()
      } else {
        self.open()
      }
    })

    self.props.elements.items.forEach(function (item, index) {
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
