const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const scoreEl = document.querySelector('#scoreEl')
const countdownEl = document.querySelector('#countdownEl')

canvas.width = 1000
canvas.height = 600

const start_pos={x:50, y:50}
const size = [10,10]

var bonus = []
var thorns = []
var bombs = []
var clocks = []
var boundaries = []
var flag = new Array()
var lastKey = ''

var score = 0
var game_start = 0
var seconds = 30
var bonus_count = 9
var bombs_count = 4
var clocks_count = 5
var thorns_count = 4
var cnt = 0
var timer = null

function createImage(src) {
    const image = new Image()
    image.src = src
    return image
}

class Guide {
    static space = 40
    constructor({position}) {
        this.position = position
    }
    draw() {
        c.font = "17px Times Roman"
        c.fillStyle = "black"
        c.textAlign = "start"
        c.textBaseline = "Top"
        c.drawImage(createImage('./img/bonus.png'), start_pos.x+470, start_pos.y+75)
        c.fillText("吃掉粉色豆子可以获得5~10分间的随机分数",start_pos.x+500,start_pos.y+90)
        c.drawImage(createImage('./img/thorn.png'), start_pos.x+460, start_pos.y+100)
        c.fillText("遇到荆棘会扣除5~10分间的随机分数",start_pos.x+500,start_pos.y+90+Guide.space)
        c.drawImage(createImage('./img/clock2.png'), start_pos.x+460, start_pos.y+100+Guide.space)
        c.fillText("收集时钟可以增加5s时间",start_pos.x+500,start_pos.y+90+Guide.space*2)
        c.drawImage(createImage('./img/bomb.png'), start_pos.x+460, start_pos.y+100+Guide.space*2)
        c.fillText("踩到炸弹游戏结束",start_pos.x+500,start_pos.y+90+Guide.space*3)
        c.fillText("当吃完全部豆子你将获得胜利！",start_pos.x+470,start_pos.y+90+Guide.space*4)
    }
}

class Boundary {
    static width = 40
    static height = 40
    constructor({position}) {
        this.position = position
        this.width = 40
        this.height = 40
    }
    draw() {
        c.strokeStyle = "rgb(0,0,0)";
        c.rect(this.position.x,this.position.y,this.width,this.height)
        c.stroke()
    }
}

class Player {
    constructor({position, velocity}) {
        this.position = position
        this.velocity = velocity
        this.radius = 12
        this.radians = 0.75
        this.openRate = 0.10
        this.rotation = 0
    }   
    
    draw() {
        c.save()
        c.translate(this.position.x, this.position.y)
        c.rotate(this.rotation)
        c.translate(-this.position.x, -this.position.y)
        c.beginPath()
        c.arc(this.position.x,this.position.y,this.radius,this.radians,Math.PI * 2 - this.radians)
        c.lineTo(this.position.x, this.position.y)
        c.fillStyle = 'black'
        c.fill()
        c.closePath()
        c.restore()
    }

    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    
        if(this.radians < 0 || this.radians > .75) this.openRate = -this.openRate
            this.radians += this.openRate
        
        this.draw()
    }
}

class Bonus {
    constructor({position, image, flag}) {
        this.position = position
        this.radius = 7
        this.image = image
        this.flag = flag
    }
    draw() {
        c.drawImage(this.image, this.position.x - 10, this.position.y - 10)
    }

}
class Thorn {
    constructor({position, image, flag}) {
        this.position = position
        this.radius = 7
        this.image = image
        this.flag = flag
    }
    draw() {
        c.drawImage(this.image, this.position.x - 20, this.position.y - 20)
    }

}
class Bomb {
    constructor({position,image, flag}) {
        this.position = position
        this.radius = 7
        this.image = image
        this.flag = flag
    }
    draw() {
        c.drawImage(this.image, this.position.x - 20, this.position.y - 20)
    }

}
class Clock {
    constructor({position, image, flag}) {
        this.position = position
        this.radius = 7
        this.image = image
        this.flag = flag
    }
    draw() {
        c.drawImage(this.image, this.position.x - 20, this.position.y - 20)
    }
}

const player = new Player({
    position:{
        x:Boundary.width * 0.5 + start_pos.x,
        y:Boundary.height * 0.5 + start_pos.y
    },
    velocity:{
        x:0,
        y:0
    }
})
const guide = new Guide({
    position:{
        x:500,y:500
    }
})
const keys = {
    w:{pressed:false},
    a:{pressed:false},
    s:{pressed:false},
    d:{pressed:false}
}

function initBlocks () {

    bonus = []
    bombs = []
    clocks = []
    thorns = []


    for(let i=0; i<size[0]; i++) {
        flag[i] = new Array()
        for(let j=0; j<size[1]; j++) {
            flag[i][j] = false
        }
    }

    while(bonus.length < bonus_count) {
        const row = Math.floor(Math.random()*size[0])
        const col = Math.floor(Math.random()*size[1])
        const x = row * Boundary.width + Boundary.width * 0.5 + start_pos.x
        const y = col * Boundary.height + Boundary.height * 0.5 +start_pos.y

        if((x === start_pos.x + Boundary.width * 0.5 && y === start_pos.x + Boundary.width * 0.5) || flag[row][col] === true) {
            continue;
        }
        flag[row][col] = true
        bonus.push(
            new Bonus({
                position:{
                    x : x,
                    y : y
                },
                image: createImage('./img/bonus.png'),
                flag:{
                    row : row,
                    col : col
                }
            })
        )
        
    }

    while(bombs.length < bombs_count) {

        const row = Math.floor(Math.random()*size[0])
        const col = Math.floor(Math.random()*size[1])
        const x = row * Boundary.width + Boundary.width * 0.5 + start_pos.x
        const y = col * Boundary.height + Boundary.height * 0.5 +start_pos.y

        if((x === start_pos.x + Boundary.width * 0.5 && y === start_pos.x + Boundary.width * 0.5) || flag[row][col] === true) {
            continue;
        }
        flag[row][col] = true
        bombs.push(
            new Bomb({
                position:{
                    x : x,
                    y : y
                },
                image: createImage('./img/bomb.png'),
                flag:{
                    row : row,
                    col : col
                }
            })
        )
        
    }

    while(clocks.length < clocks_count) {

        const row = Math.floor(Math.random()*size[0])
        const col = Math.floor(Math.random()*size[1])
        const x = row * Boundary.width + Boundary.width * 0.5 + start_pos.x
        const y = col * Boundary.height + Boundary.height * 0.5 +start_pos.y

        if((x === start_pos.x + Boundary.width * 0.5 && y === start_pos.x + Boundary.width * 0.5) || flag[row][col] === true) {
            continue;
        }
        flag[row][col] = true
        clocks.push(
            new Clock({
                position:{
                    x : x,
                    y : y
                },
                image: createImage('./img/clock2.png'),
                flag:{
                    row : row,
                    col : col
                }
            })
        ) 
    }

    while(thorns.length < thorns_count) {

        const row = Math.floor(Math.random()*size[0])
        const col = Math.floor(Math.random()*size[1])
        const x = row * Boundary.width + Boundary.width * 0.5 + start_pos.x
        const y = col * Boundary.height + Boundary.height * 0.5 +start_pos.y

        if((x === start_pos.x + Boundary.width * 0.5 && y === start_pos.x + Boundary.width * 0.5) || flag[row][col] === true) {
            continue;
        }
        flag[row][col] = true
        thorns.push(
            new Thorn({
                position:{
                    x : x,
                    y : y
                },
                image: createImage('./img/thorn.png'),
                flag:{
                    row : row,
                    col : col
                }
            })
        ) 
    }
}

function initBoundary () {
    boundaries = []
    for(let i=0; i<size[0]; i++) {
        for(let j=0; j<size[1]; j++) {
            boundaries.push(new Boundary({
                position:{
                    x: Boundary.width * j + start_pos.x,
                    y: Boundary.height * i + start_pos.y
                }
            }))
        }
        
    }
}

function isCollide({circle,rectangle}) {
    return (
        circle.position.y - circle.radius + circle.velocity.y <= start_pos.y
        || circle.position.x + circle.radius + circle.velocity.x >= start_pos.x + size[1] * rectangle.width
        || circle.position.y + circle.radius + circle.velocity.y >= start_pos.y + size[0] * rectangle.height
        || circle.position.x - circle.radius + circle.velocity.x <= start_pos.x
    )
}

function animate() {
    animationId = requestAnimationFrame(animate)
    c.clearRect(0,0,canvas.width,canvas.height)
    
    cnt++
    if (cnt >= 6) {
        cnt = 0
        if (keys.w.pressed && lastKey === 'w' && player.position.y >= start_pos.y + Boundary.height * 1.5) {
            player.position.y -= 40
            player.rotation = Math.PI * 1.5
        } else if (keys.a.pressed & lastKey === 'a' && player.position.x >= start_pos.x + Boundary.width * 1.5) {
            player.position.x -= 40
            player.rotation = Math.PI
        } else if (keys.s.pressed && lastKey === 's' && player.position.y <= start_pos.y +Boundary.height*(size[1] - 1.5)) {
            player.position.y += 40
            player.rotation = Math.PI / 2
        } else if (keys.d.pressed  && lastKey === 'd' && player.position.x <= start_pos.x +Boundary.height*(size[1] - 1.5)) {
            player.position.x += 40
            player.rotation = 0
        }
    }
    
    // touch bonus here
    for (let i =bonus.length - 1; 0 <= i; i--) {
        const b = bonus[i]
        b.draw()

        if (
            Math.hypot(
            b.position.x - player.position.x,
            b.position.y - player.position.y
            ) <
            b.radius + player.radius
        ) {    
            bonus.splice(i,1)
            //bonus_count -- //initBlocks()
            score += Math.floor(Math.random() * 6 + 5); //5~10
            scoreEl.innerHTML = score
        }
    }

    // touch bombs here
    for (let i =bombs.length - 1; 0 <= i; i--) {
        const bomb = bombs[i]
        bomb.draw()

        if (
            Math.hypot(
            bomb.position.x - player.position.x,
            bomb.position.y - player.position.y
            ) <
            bomb.radius + player.radius
        ) {
            if (timer != null) {
                clearInterval(timer);
                timer = null;
            }
            player.draw()
            cancelAnimationFrame(animationId)
            popup(2)
        }
    }

    // touch clocks here
    for (let i =clocks.length - 1; 0 <= i; i--) {
        const clock = clocks[i]
        clock.draw()

        if (
            Math.hypot(
            clock.position.x - player.position.x,
            clock.position.y - player.position.y
            ) <
            clock.radius + player.radius
        ) {
                console.log('touching')
                clocks.splice(i,1)
                seconds += 5
                countdownEl.innerHTML = seconds
        }
    }

    // touch thorns here
    for (let i =thorns.length - 1; 0 <= i; i--) {
        const thorn = thorns[i]
        thorn.draw()

        if (
            Math.hypot(
            thorn.position.x - player.position.x,
            thorn.position.y - player.position.y
            ) <
            thorn.radius + player.radius
        ) {
                console.log('touching')
                thorns.splice(i,1)
                score -= Math.floor(Math.random() * 6 + 5); //5~10
                scoreEl.innerHTML = score
        }
    }

    //win condition
    if (bonus.length === 0) {
        if (timer != null) {
            clearInterval(timer);
            timer = null;
        }
        player.draw()
        cancelAnimationFrame(animationId)
        popup(0)
    }

    //time's up
    if (seconds === 0) {
        if (timer != null) {
            clearInterval(timer);
            timer = null;
        }
        cancelAnimationFrame(animationId)
        popup(1)
    }

    boundaries.forEach((boundary) => {
        boundary.draw()

        if (isCollide({circle:player, rectangle:boundary})) {
            console.log('we are colliding')
            player.velocity.x = 0
            player.velocity.y = 0
        }
    })
    player.update()
    guide.draw()

} //end of animate()

const popup = (result) => {
    message = [" 你吃掉了所有的豆子！"," Time's up!"," BOOM!你输了！"]
    const Result = document.getElementsByClassName('result')[0]
    const Popup = document.createElement('div')
    Popup.id = 'popup'
    const text = document.createTextNode(message[result])
    const Restart = document.createElement('input')
    Restart.type = 'button'
    Restart.classList = 'bg-pink-400 hover:bg-pink-500 text-white ml-5 mt-5 py-1 rounded-full text-sm cursor-pointer'
    Restart.value = ' RestartGame '
    Restart.id = 'Restart'
    //Restart.style.cursor = 'pointer'
    Popup.appendChild(Restart)
    Popup.appendChild(text)
    Result.appendChild(Popup)

    Restart.addEventListener("click", restart, false)
}
const start = () => {
    game_start = 1
    score = 0
    seconds = 30

    timer = setInterval(updateCountdown,1000)
}
const restart = () => {
    game_start = 1
    score = 0
    seconds = 30
    bonus_count = 5
    timer = setInterval(updateCountdown,1000)
    const Result = document.getElementsByClassName('result')[0]
    Result.removeChild(Result.lastElementChild)
    
    countdownEl.innerHTML = `${seconds}`
    scoreEl.innerHTML = `${score}`

    initBoundary()
    player.position.x = Boundary.width * 0.5 + start_pos.x
    player.position.y = Boundary.height * 0.5 + start_pos.y
    initBlocks()
    animate()
    
}
function updateCountdown () {
    countdownEl.innerHTML = `${seconds}`
    seconds --;
}

const main = async() => {
    initBoundary()
    initBlocks()
    animate()
}
main()

let StartGame = document.getElementById('Start')
StartGame.addEventListener("click", start)
window.addEventListener('keydown',({key}) => {
    //console.log(key)
    if (game_start) {
        switch (key) {
            case 'w':
                keys.w.pressed = true
                lastKey = 'w'
                break
            case 'a':
                keys.a.pressed = true
                lastKey = 'a'
                break
            case 's':
                keys.s.pressed = true
                lastKey = 's'
                break
            case 'd':
                keys.d.pressed = true
                lastKey = 'd'
                break
        }
    }
})
window.addEventListener('keyup',({key}) => {
    //console.log(key)
    switch (key) {
        case 'w':
            keys.w.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
    }
})
