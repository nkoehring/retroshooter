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

  this.up    = function() {if(this.y > 20) this.y -= 4 }
  this.left  = function() {if(this.x > 4) this.x -= 4 }
  this.down  = function() {if(this.y < 476) this.y += 4 }
  this.right = function() {if(this.x < 396) this.x += 4 }
}


function draw_enemy(ship, baseSize) {
  var baseSize = baseSize * ship.multiplicator

  ctx.globalAlpha = ship.hitpoints*1.0 / ship.baseHitpoints
  ctx.fillStyle = ship.colour
  ctx.beginPath()
  ctx.moveTo(ship.x, ship.y)
  ctx.lineTo(ship.x + baseSize, ship.y)
  ctx.lineTo(ship.x + baseSize/2, ship.y + baseSize)
  ctx.closePath()
  ctx.fill()
}

function draw_projectile(projectile, baseSize) {
  ctx.globalAlpha = 1.0
  ctx.fillStyle = "#FF0"
  ctx.beginPath()
  ctx.arc(projectile.x, projectile.y, baseSize, 0, Math.PI*2, true)
  ctx.closePath()
  ctx.fill()
}

function draw_player(ship, baseSize) {
  ctx.globalAlpha = 1.0
  ctx.fillStyle = "#0F0"
  ctx.beginPath();  
  ctx.arc(
    ship.x , ship.y,
    baseSize,
    Math.PI*0.5+0.8, Math.PI*0.5-0.8,
    false
  );  
  ctx.closePath()
  ctx.fill();  
}

function run(ctx) {
  var enemies = [],
      projectiles = [],
      player = new Ship(200, 470, "player"),
      lvl = 0,
      lvlIndicator = document.getElementById('level'),
      enemyIndicator = document.getElementById('enemies'),
      projectileIndicator = document.getElementById('projectiles'),
      projectileBaseSize = 5,
      projectileTreshold = 20,
      playerBaseSize = 15,
      enemyBaseSize = 20

  function obsolet_ship(element, index, array) {
    return (element.y <= 480);
  }

  function obsolet_projectile(element, index, array) {
    return (element.y >= 0);
  }

  function projectile(owner) {
    if(projectiles.length <= projectileTreshold) {
      var x = player.x,
          y = player.y
      projectiles.push({owner: owner, x: x, y: y})
    }
  }

  function generateEnemies() {
    r = Math.random()
    x = Math.random()*400 % 380

    if (r > 0.1) enemies.push(new Ship(x, -20))
    else enemies.push(new Ship(x, -50, "boss", "#F0A", 3))
  }

  function doKeyDown(evt){
    if (evt.keyCode == 37) player.left()  // left
    if (evt.keyCode == 38) player.up()    // up
    if (evt.keyCode == 39) player.right() // right
    if (evt.keyCode == 40) player.down()  // down
    if (evt.keyCode == 32) projectile("player")   //TODO: shoot!
  }

  function cleanup() {
    // cleanup lost enemies
    enemies = enemies.filter(obsolet_ship)
    // cleanup lost bullets
    projectiles = projectiles.filter(obsolet_projectile)
  }

  function render() {
    lvlIndicator.innerHTML = lvl
    enemyIndicator.innerHTML = enemies.length
    projectileIndicator.innerHTML = projectiles.length

    ctx.clearRect(0,0,640,480)
    for(i in enemies) {
      draw_enemy(enemies[i], enemyBaseSize)
      enemies[i].y += 2.0 / enemies[i].multiplicator
    }
    draw_player(player, playerBaseSize)
    for(i in projectiles) {
      draw_projectile(projectiles[i], projectileBaseSize)
      projectiles[i].y -= 4.0
    }

    cleanup()
  }

  function raiseLevel() { lvl++ }

  ctx.globalCompositeOperation = 'destination-over'
  window.addEventListener('keydown', doKeyDown, false)
  enemyInterval = setInterval(generateEnemies, 2000 - lvl*100)
  renderInterval = setInterval(render, 20)
  raiseLevelInterval = setInterval(raiseLevel, 10000)
}

