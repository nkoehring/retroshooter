function Ship(x, y, name, colour, multiplicator) {
  if ( !(this instanceof Ship) ) return new Ship()

  this.x = x || 0
  this.y = y || 0
  this.name = name || "enemy"
  this.colour = colour || "#F00"
  this.multiplicator = multiplicator || 1
  this.baseHitpoints = 100 * this.multiplicator
  this.hitpoints = this.baseHitpoints
  this.dead = 0

  this.hit = function(points) {
    this.hitpoints -= points
    if (this.hitpoints <= 0) {
      this.dead = 1
      this.hitpoints = 0
    }
  }
}


function draw_enemy(ship) {
  var baseSize = 20 * ship.multiplicator

  ctx.globalAlpha = ship.hitpoints*1.0 / ship.baseHitpoints
  ctx.fillStyle = ship.colour
  ctx.beginPath()
  ctx.moveTo(ship.x, ship.y)
  ctx.lineTo(ship.x + baseSize, ship.y)
  ctx.lineTo(ship.x + baseSize/2, ship.y + baseSize)
  ctx.lineTo(ship.x, ship.y)
  ctx.fill()
}

function draw_player(ship) {
  var baseSize = 15

  ctx.globalAlpha = 1.0
  ctx.fillStyle = "#0F0"
  ctx.beginPath();  
  ctx.arc(
    ship.x , ship.y,
    baseSize,
    Math.PI*0.5+0.8, Math.PI*0.5-0.8,
    false
  );  
  ctx.fill();  
}

function run(ctx) {
  var enemies = [],
      player = new Ship(200, 470, "player"),
      lvl = 0,
      lvlIndicator = document.getElementById('level'),
      enemyIndicator = document.getElementById('enemies')

  function obsolet(element, index, array) {
    return (element.y <= 480);
  }

  function generateEnemies() {
    r = Math.random()
    x = Math.random()*400 % 380

    if (r > 0.1) enemies.push(new Ship(x, -20))
    else enemies.push(new Ship(x, -50, "boss", "#F0A", 3))

    // cleanup lost enemies
    enemies = enemies.filter(obsolet)
  }

  function doKeyDown(evt){
    if (evt.keyCode == 37) player.x -= 5  // left
    if (evt.keyCode == 38) player.y -= 5  // up
    if (evt.keyCode == 39) player.x += 5  // right
    if (evt.keyCode == 40) player.y += 5  // down
    //if (evt.keyCode == 32) //TODO: shoot!
  }

  function render() {
    lvlIndicator.innerHTML = lvl
    enemyIndicator.innerHTML = enemies.length

    ctx.clearRect(0,0,640,480)
    for(i in enemies) {
      enemies[i].y += 2.0 / enemies[i].multiplicator
      draw_enemy(enemies[i])
    }
    draw_player(player)
  }

  function raiseLevel() { lvl++ }

  ctx.globalCompositeOperation = 'destination-over'
  window.addEventListener('keydown', doKeyDown, false)
  enemyInterval = setInterval(generateEnemies, 2000 - lvl*100)
  renderInterval = setInterval(render, 20)
  raiseLevelInterval = setInterval(raiseLevel, 10000)
}

