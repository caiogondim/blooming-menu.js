var BloomingMenu = (function() {
  'use strict';

  function BloomingMenu (opts) {
    // Enforces new
    if (!(this instanceof BloomingMenu)) {
      return new BloomingMenu(opts);
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

  BloomingMenu.prototype.render = function() {
    createElements(this.props)
    setAnimation(this.props)
    bindEventListeners(this)
  };

  BloomingMenu.prototype.remove = function() {
    unbindEventListeners(this)
    removeElements(this)
  };

  BloomingMenu.prototype.open = function () {
    this.props.elements.main.classList.add('is-active')

    this.props.elements.itens.forEach(function (item) {
      item.classList.remove('is-selected')
      item.classList.add('is-active')
    })

    this.state.isOpen = true
  };

  BloomingMenu.prototype.close = function () {
    this.props.elements.main.classList.remove('is-active')
    this.props.elements.main.classList.add('is-inactive')

    this.props.elements.itens.forEach(function (item) {
      item.classList.remove('is-active')
    })

    this.state.isOpen = false
  };

  // BloomingMenu.prototype.selectItem = function (index) {
  //   var self = this

  //   this.close()

  //   this.props.elements.itens.forEach(function (item, index_) {
  //     if (index_ !== index) {
  //       item.classList.add('is-not-selected')
  //     }
  //     item.classList.remove('is-active')
  //   })
  //   this.props.elements.itens[index].classList.add('is-selected')
  //   this.props.elements.itens[index].addEventListener('transitionend', function (event) {
  //     self.props.elements.itens.forEach(function (item) {
  //       item.classList.remove('is-selected')
  //       item.classList.remove('is-not-selected')
  //     })
  //     event.target.removeEventListener('transitionend')
  //   })
  // };

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
      item.style.opacity = 0
      var button = document.createElement('button')
      button.classList.add('blooming-menu__item-btn')
      item.appendChild(button)
      props.elements.itensContainer.appendChild(item)
      props.elements.itens.push(item)
    }

    props.fatherElement.appendChild(props.elements.container)

    // Prevents the first animation when the elements are rendered
    setTimeout(function() {
      props.elements.itens.forEach(function(item) {
        item.style.opacity = 1
      })
    }, ((props.itemAnimationDelay * props.itensNum) + props.animationDuration) * 1000)
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
      var x1 = x3 * 0.7
      var y1 = y3 * 0.7
      var x0 = 0
      var y0 = 0

      // Animation
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
        '}'

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
        '}'

      cssRules +=
        '.' + props.itensCSSClass + ':nth-of-type(' + (index + 1) + ') {' +
          'animation-delay: ' + (index * props.itemAnimationDelay) + 's;' +
          '-webkit-animation-delay: ' + (index * props.itemAnimationDelay) + 's;' +
          'animation-duration: ' + props.animationDuration + 's;' +
          'animation-timing-function: ease-out;' +
          'animation-name: contract-item-' + index + ';' +
          'animation-fill-mode: backwards;' +
        '}'

      cssRules +=
        '.' + props.itensCSSClass + '.is-active:nth-of-type(' + (index + 1) + ') {' +
          'animation-name: expand-item-' + index + ';' +
          'animation-fill-mode: forwards;' +
        '}'

      cssRules +=
        '.' + props.itensCSSClass + ':nth-of-type(' + (index + 1) + ').is-selected {' +
          'transform: translate(' + x + 'px, ' + y + 'px) scale(2, 2);' +
          '-webkit-transform: translate(' + x + 'px, ' + y + 'px) scale(2, 2);' +
          'transition-delay: 0;' +
          'opacity: 0;' +
        '}'

      cssRules +=
        'body .' + props.itensCSSClass + ':nth-of-type(' + (index + 1) + ').is-not-selected {' +
          'transform: translate(' + x + 'px, ' + y + 'px) scale(0, 0);' +
          '-webkit-transform: translate(' + x + 'px, ' + y + 'px) scale(0, 0);' +
          'transition-delay: 0;' +
        '}'

      angleCur += angleStep
    })

    props.elements.styleSheet.innerHTML = cssRules
  }

  function toRadians (angle) {
    return angle * (Math.PI / 180)
  }

  function removeElements (elements) {
    elements.container.parentNode.removeChild(elements.container)
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

    // self.props.elements.itens.forEach(function (item, index) {
    //   item.addEventListener('click', function (event) {
    //     self.selectItem(index)
    //   })
    // })
  }

  function unbindEventListeners (self) {
    self.props.elements.main.removeEventListener('click')
    self.props.elements.main.removeEventListener('touchstart')
  }

  return BloomingMenu;
}());
