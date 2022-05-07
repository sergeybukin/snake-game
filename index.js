const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

canvas.width = 600
canvas.height = 600
let pause = false
let gameOver = false

const w = canvas.width
const h = canvas.height
function getRandom(min, max, num) {
  return Math.floor(Math.floor(Math.random()*(max-min+1)+min) / num) * num
}

function drawRect(x, y, color) {
  context.beginPath()
  context.rect(x, y, blockSize, blockSize)
  context.rect(x, y, blockSize-1, blockSize-1)
  context.fillStyle = color
  context.strokeStyle = '#fff'
  context.stroke()
  context.fill()
}

class Apple {
  constructor(x, y) {
    context.beginPath()
    context.rect(x, y, blockSize, blockSize)
    context.fillStyle = '#e35d5b'
    context.stroke()
    context.fill()
  }
}

class Snake {
  constructor(x, y) {
    this.coordinates = {x: x, y: y}
    this.blocks = [this.coordinates]
  }
  moveSnake(direction) {
    const {x, y} = this.coordinates
    let newArr = [{x, y}]
    this.blocks.forEach((block, i) => {
      if( i > 0 ) {
        newArr = [ ...newArr, this.blocks[i - 1]]
      }
    })
    this.blocks = newArr

    switch (direction) {

      case 'left' :
        if( x < 0 ) {
          this.coordinates = { x: w - blockSize, y }
        } else {
          this.coordinates = { x: x - snakeSpeed, y }
        }
        break
      case 'right' :
        if( x > w - blockSize ) {
          this.coordinates = { x: 0, y }
        } else {
          this.coordinates = { x: x + snakeSpeed, y }
        }
        break
      case 'up' :
        if( y < 0 ) {
          this.coordinates = { x, y: h - blockSize }
        } else {
          this.coordinates = { x, y: y - snakeSpeed }
        }
        break
      case 'down' :
        if( y > h - blockSize) {
          this.coordinates = { x, y: 0 }
        } else {
          this.coordinates = { x, y: y + snakeSpeed }
        }
        break
    }
  }

}

const snakeSpeed = w / 20
let direction = 'right'
const blockSize = w / 20

let appleCoordinates = {x: getRandom(0, w, blockSize), y: getRandom(0, h, blockSize)}
let speedCounter = 0
let speedCoeef = 40
let score = 0

const snake = new Snake(0, 0)

const startGame = () => animation({
  clear() {
    canvas.width = w
  },
  update() {
    const { x, y } = snake.coordinates

    if( appleCoordinates.x < x + 5 && appleCoordinates.y < y + 5 && appleCoordinates.x > x - 5 && appleCoordinates.y > y- 5  ) {
      appleCoordinates = {x: getRandom(0, w-blockSize, blockSize), y: getRandom(0, h-blockSize, blockSize)}
      snake.blocks = [{x, y}, ...snake.blocks]
      speedCoeef -= 2
      score++
    }
    if( !pause ) {
      speedCounter += 2
      if(speedCounter % speedCoeef === 0) {
        snake.moveSnake(direction)
      }
    }
  },
  render() {

    for (let i = 0; i < 800; i += blockSize) {
      context.moveTo(i, 0);
      context.lineTo(i, 800);
    }

    for (let j = 0; j < 800; j += blockSize) {
      context.moveTo(0, j);
      context.lineTo(800, j);
    }

    context.strokeStyle = "#464646";
    context.stroke();
    context.beginPath()
    context.rect(0, 0, w, h)
    context.font = "30px serif"
    context.fillStyle = 'green'
    context.fillText('SCORE: ' + score, 10, 30)
    context.stroke()

    if( gameOver ) {
      context.font = "40px serif"
      context.fillStyle = '#fff'
      context.fillText("GAME OVER!", w / 100 * 35, h / 100 * 40)
    } else {
      if (!pause) {
        snake.blocks.forEach(({x, y}, i) => {
          const color = i === 0 ? '#083d18' : '#2C7744'
          if (x === snake.blocks[0].x && y === snake.blocks[0].y && i > 1) {
            gameOver = true
          }
          drawRect(x, y, color)
        })
      }

      if (speedCoeef < 2) {
        context.font = "40px serif"
        context.fillStyle = '#fff'
        context.fillText("YOU'RE WIN!", w / 100 * 35, h / 100 * 40)
        pause = true
      }
      new Apple(appleCoordinates.x, appleCoordinates.y)
    }
  },
})


document.addEventListener('keydown', ({code}) => {
  const { x, y } = snake.coordinates
  switch (code) {
    case 'ArrowLeft' :
      if(direction !== 'right' && x < w && y < h && x >= 0 && y >= 0)
        direction = 'left'
      break
    case 'ArrowRight' :
      if(direction !== 'left' && x < w && y < h && x >= 0 && y >= 0)
        direction = 'right'
      break
    case 'ArrowUp' :
      if(direction !== 'down' && x < w && y < h && x >= 0 && y >= 0)
        direction = 'up'
      break
    case 'ArrowDown' :
      if(direction !== 'up' && x < w && y < h && x >= 0 && y >= 0)
        direction = 'down'
      break
  }
})

