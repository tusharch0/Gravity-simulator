// Data

const Sim = {
    spots: [],
    objects: []
}

let SimHeight
let SimWidth

let NextFrame = true

// Methods

function initialize() {
    // Initialize simulation

    resize()

    Sim.spots.push({
        id: generate_id(),
        x: 50,
        y: 50,
        radius: Math.floor(Math.sqrt(Settings.spotMass / config.spotDensity)),
        mass: Settings.spotMass
    })

    Sim.objects.push({
        id: generate_id(),
        x: 50,
        y: 25,
        radius: Math.floor(Math.sqrt(Settings.objectMass / config.objectDensity)),
        mass: Settings.objectMass,
        vX: 0.36,
        vY: 0,
        prevPos: []
    })

    // Start simulation

    requestAnimationFrame(sim)
}

function sim() {
    // Objects to destroy

    const destroy_list = []

    // Sim loop

    for (let o = 0; o < Sim.objects.length; o++) {
        // Data

        const object = Sim.objects[o]

        let forceX = 0
        let forceY = 0

        let destroy = false

        // Compute all gravity spots

        for (let s = 0; s < Sim.spots.length; s++) {
            // Spot

            const spot = Sim.spots[s]

            // Check collision

            if (distance(spot.x, spot.y, object.x, object.y, "px") <= spot.radius + object.radius) {
                destroy = true
                break
            }

            // Force

            const dir = Math.atan2(spot.y - object.y, spot.x - object.x)
            const force = Settings.gravity * spot.mass * object.mass / distance(spot.x, spot.y, object.x, object.y) ** 2

            if (isFinite(force)) {
                forceX += force * Math.cos(dir)
                forceY += force * Math.sin(dir)
            }
        }

        // Compute all other objects

        for (let ob = 0; ob < Sim.objects.length; ob++) {
            if (ob != o) {
                // Object

                const obj = Sim.objects[ob]

                // Force

                const dir = Math.atan2(obj.y - object.y, obj.x - object.x)
                const dist = distance(obj.x, obj.y, object.x, object.y)
                if (dist >= obj.radius) {
                    // Cheaty fix

                    const force = Settings.gravity * obj.mass * object.mass / dist ** 2

                    if (isFinite(force)) {
                        forceX += force * Math.cos(dir)
                        forceY += force * Math.sin(dir)
                    }
                }
            }
        }

        // Update previous positions

        while (object.prevPos.length >= config.trailLength) {
            object.prevPos.pop()
        }
        object.prevPos.unshift([object.x, object.y])

        // Update object

        object.vX += forceX
        object.vY += forceY

        object.x += object.vX
        object.y += object.vY

        // Check position

        if (object.x < -1 * config.destroyFactor || object.x > 100 + config.destroyFactor || object.y < -1 * config.destroyFactor || object.y > 100 + config.destroyFactor) {
            destroy = true
        }

        // Destroy the current object

        if (destroy) {
            destroy_list.push(object.id)
            continue
        }
    }

    // Destroy objects

    if (destroy_list.length) {
        Sim.objects = Sim.objects.filter(object => !destroy_list.includes(object.id))
    }

    // Next frame

    if (NextFrame) {
        render()
        requestAnimationFrame(sim)
    }
}

function render() {
    // Clear canvas

    SimCanvas.clearRect(0, 0, SimWidth, SimHeight)

    // Draw gravity spots

    SimCanvas.fillStyle = config.spotColor
    SimCanvas.strokeStyle = config.spotColor
    for (let s = 0; s < Sim.spots.length; s++) {
        // Spot

        const spot = Sim.spots[s]

        SimCanvas.beginPath()
        SimCanvas.arc(SimWidth * spot.x / 100, SimHeight * spot.y / 100, spot.radius, 0, 2 * Math.PI)
        SimCanvas.fill()
        SimCanvas.closePath()
        SimCanvas.stroke()
    }

    // Draw objects

    SimCanvas.fillStyle = config.objectColor
    SimCanvas.strokeStyle = config.objectColor
    for (let o = 0; o < Sim.objects.length; o++) {
        // Object

        const object = Sim.objects[o]

        SimCanvas.beginPath()
        SimCanvas.arc(SimWidth * object.x / 100, SimHeight * object.y / 100, object.radius, 0, 2 * Math.PI)
        SimCanvas.fill()
        SimCanvas.closePath()
        SimCanvas.stroke()

        // Object trail

        if (object.prevPos.length) {
            SimCanvas.moveTo(SimWidth * object.x / 100, SimHeight * object.y / 100)
            SimCanvas.beginPath()
            for (let p = 0; p < object.prevPos.length; p++) {
                SimCanvas.lineTo(SimWidth * object.prevPos[p][0] / 100, SimHeight * object.prevPos[p][1] / 100)
            }
            SimCanvas.moveTo(SimWidth * object.prevPos[object.prevPos.length - 1][0] / 100, SimHeight * object.prevPos[object.prevPos.length - 1][1] / 100)
            SimCanvas.closePath()
            SimCanvas.strokeStyle = config.trailColor
            SimCanvas.lineWidth = config.trailWidth
            SimCanvas.stroke()
            SimCanvas.lineWidth = 1
        }
    }
}