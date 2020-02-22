const Settings = {
    spotMass: 30000000,
    objectMass: 1600,
    gravity: 0.0000000000667408,

    spotBase: 3,
    objectBase: 1.6,
    gravityBase: 6.67408
}

let Control
let MouseDown = {
    down: false,
    x: null,
    y: null
}

let ControlCanvas

function control_listeners() {
    // Elements

    const toggle_control = document.getElementById("toggle-control")

    const controls = document.getElementById("controls")
    const gravity_spot_control = document.getElementById("gravity-spot-control")
    const object_control = document.getElementById("object-control")
    const delete_control = document.getElementById("delete-control")
    const clear_control = document.getElementById("clear-control")
    const settings_control = document.getElementById("settings-control")

    const settings = document.getElementById("settings")
    const gravity_spot_slider = document.getElementById("gravity-spot-slider")
    const gravity_spot_value = document.getElementById("gravity-spot-value")
    const gravity_spot_reset = document.getElementById("gravity-spot-reset")
    const object_slider = document.getElementById("object-slider")
    const object_value = document.getElementById("object-value")
    const object_reset = document.getElementById("object-reset")
    const gravity_slider = document.getElementById("gravity-slider")
    const gravity_value = document.getElementById("gravity-value")
    const gravity_reset = document.getElementById("gravity-reset")
    const warp_input = document.getElementById("warp-input")
    const warp = document.getElementById("warp")

    const control_canvas = document.getElementById("control")

    // Data

    let active

    // Event listeners

    toggle_control.addEventListener("click", event => {
        if (event.isTrusted) {
            if (controls.className == "controlsActive") {
                if (settings.className == "settingsActive") {
                    settings.className = "settingsHidden"
                }
                controls.className = "controlsHidden"
            } else {
                controls.className = "controlsActive"
            }
        }
    })

    gravity_spot_control.addEventListener("click", event => {
        if (event.isTrusted) {
            if (Control != "gravity_spot") {
                if (active) {
                    active.classList.remove("controlActive")
                }

                Control = "gravity_spot"
                gravity_spot_control.classList.add("controlActive")
                active = gravity_spot_control
            } else {
                Control = null
                active = null
                gravity_spot_control.className = "control"
            }
        }
    })

    object_control.addEventListener("click", event => {
        if (event.isTrusted) {
            if (Control != "object") {
                if (active) {
                    active.classList.remove("controlActive")
                }

                Control = "object"
                object_control.classList.add("controlActive")
                active = object_control
            } else {
                Control = null
                active = null
                object_control.className = "control"
            }
        }
    })

    delete_control.addEventListener("click", event => {
        if (event.isTrusted) {
            if (Control != "delete") {
                if (active) {
                    active.classList.remove("controlActive")
                }

                Control = "delete"
                delete_control.classList.add("controlActive")
                active = delete_control
            } else {
                Control = null
                active = null
                delete_control.className = "control"
            }
        }
    })

    document.addEventListener("keypress", event => {
        if (event.isTrusted && event.target != warp_input) {
            if (event.key == "g" && Control != "gravity_spot") {
                if (active) {
                    active.classList.remove("controlActive")
                }

                Control = "gravity_spot"
                gravity_spot_control.classList.add("controlActive")
                active = gravity_spot_control
            } else if (event.key == "o" && Control != "object") {
                if (active) {
                    active.classList.remove("controlActive")
                }

                Control = "object"
                object_control.classList.add("controlActive")
                active = object_control
            } else if (event.key == "x" && Control != "delete") {
                if (active) {
                    active.classList.remove("controlActive")
                }

                Control = "delete"
                delete_control.classList.add("controlActive")
                active = delete_control
            }
        }
    })

    clear_control.addEventListener("click", event => {
        if (event.isTrusted) {
            Sim.spots.length = 0
            Sim.objects.length = 0
        }
    })

    settings_control.addEventListener("click", event => {
        if (event.isTrusted) {
            if (settings.className == "settingsActive") {
                settings.className = "settingsHidden"
            } else {
                settings.className = "settingsActive"
            }
        }
    })

    gravity_spot_slider.addEventListener("input", event => {
        if (event.isTrusted) {
            Settings.spotMass = Settings.spotBase * 10 ** gravity_spot_slider.value
            gravity_spot_value.innerText = Settings.spotMass.toExponential(2)
        }
    })

    gravity_spot_reset.addEventListener("click", event => {
        if (event.isTrusted) {
            gravity_spot_slider.value = (parseInt(gravity_spot_slider.min) + parseInt(gravity_spot_slider.max)) / 2
            Settings.spotMass = Settings.spotBase * 10 ** gravity_spot_slider.value
            gravity_spot_value.innerText = Settings.spotMass.toExponential(2)
        }
    })

    object_slider.addEventListener("input", event => {
        if (event.isTrusted) {
            Settings.objectMass = Settings.objectBase * 10 ** object_slider.value
            object_value.innerText = Settings.objectMass.toExponential(2)
        }
    })

    object_reset.addEventListener("click", event => {
        if (event.isTrusted) {
            object_slider.value = (parseInt(object_slider.min) + parseInt(object_slider.max)) / 2
            Settings.objectMass = Settings.objectBase * 10 ** object_slider.value
            object_value.innerText = Settings.objectMass.toExponential(2)
        }
    })

    gravity_slider.addEventListener("input", event => {
        if (event.isTrusted) {
            Settings.gravity = Settings.gravityBase * 10 ** gravity_slider.value
            gravity_value.innerText = Settings.gravity.toExponential(2)
        }
    })

    gravity_reset.addEventListener("click", event => {
        if (event.isTrusted) {
            gravity_slider.value = (parseInt(gravity_slider.min) + parseInt(gravity_slider.max)) / 2
            Settings.gravity = Settings.gravityBase * 10 ** gravity_slider.value
            gravity_value.innerText = Settings.gravity.toExponential(2)
        }
    })

    warp_input.addEventListener("keypress", event => {
        if (!event.isTrusted || !/^[0-9]+$/.test(event.key)) {
            event.preventDefault()
        }
    })

    warp_input.addEventListener("paste", event => event.preventDefault())

    warp.addEventListener("click", event => {
        if (event.isTrusted && warp_input.value) {
            tick_warp(parseInt(warp_input.value))
        }
    })

    control_canvas.addEventListener("mousedown", event => {
        if (event.isTrusted) {
            MouseDown.down = true
            const rect = control_canvas.getBoundingClientRect()
            MouseDown.x = (event.clientX - rect.left + 1) / SimWidth * 200
            MouseDown.y = (event.clientY - rect.left + 1) / SimHeight * 200
        }
    })

    control_canvas.addEventListener("mouseup", event => {
        if (event.isTrusted) {
            if (MouseDown.down && Control == "object") {
                const rect = control_canvas.getBoundingClientRect()
                launch_object(event.clientX - rect.left + 1, event.clientY - rect.left + 1)
            }

            MouseDown.down = false
            MouseDown.x = null
            MouseDown.y = null
        }
    })

    control_canvas.addEventListener("mousemove", event => {
        if (Control && event.isTrusted) {
            control(event)
        }
    })

    control_canvas.addEventListener("click", event => {
        if (event.isTrusted) {
            // Get coordinates

            const rect = control_canvas.getBoundingClientRect()
            const x = (event.clientX - rect.left + 1) * 2
            const y = (event.clientY - rect.top + 1) * 2

            // Controls

            if (Control == "gravity_spot") {
                // Place gravity spot

                Sim.spots.push({
                    id: generate_id(),
                    x: x / SimWidth * 100,
                    y: y / SimHeight * 100,
                    radius: Math.floor(Math.sqrt(Settings.spotMass / config.spotDensity)),
                    mass: Settings.spotMass
                })
            } else if (Control == "delete") {
                // Check for deletion

                delete_objects(x, y)
            }
        }
    })

    control_canvas.addEventListener("mouseout", event => {
        if (event.isTrusted) {
            ControlCanvas.clearRect(0, 0, SimWidth, SimHeight)
            MouseDown.down = false
            MouseDown.x = null
            MouseDown.y = null
        }
    })
}

function control(event) {
    // Clear canvas

    ControlCanvas.clearRect(0, 0, SimWidth, SimHeight)

    // Get coordinates

    const rect = document.getElementById("control").getBoundingClientRect()
    const x = (event.clientX - rect.left + 1) * 2
    const y = (event.clientY - rect.top + 1) * 2

    // Control types

    if (Control == "gravity_spot") {
        // Render gravity spot

        ControlCanvas.fillStyle = `${config.spotColor}A2`
        ControlCanvas.strokeStyle = `${config.spotColor}A2`
        ControlCanvas.beginPath()
        ControlCanvas.arc(x, y, Math.floor(Math.sqrt(Settings.spotMass / config.spotDensity)), 0, Math.PI * 2)
        ControlCanvas.fill()
        ControlCanvas.closePath()
        ControlCanvas.stroke()
    } else if (Control == "object") {
        // Render object

        ControlCanvas.fillStyle = `${config.objectColor}A2`
        ControlCanvas.strokeStyle = `${config.objectColor}A2`
        ControlCanvas.beginPath()
        if (!MouseDown.down) {
            ControlCanvas.arc(x, y, Math.floor(Math.sqrt(Settings.objectMass / config.objectDensity)), 0, Math.PI * 2)
            ControlCanvas.fill()
            ControlCanvas.closePath()
            ControlCanvas.stroke()
        } else {
            // Object path

            ControlCanvas.arc(MouseDown.x / 100 * SimWidth, MouseDown.y / 100 * SimHeight, Math.floor(Math.sqrt(Settings.objectMass / config.objectDensity)), 0, Math.PI * 2)
            ControlCanvas.fill()
            ControlCanvas.closePath()
            ControlCanvas.stroke()

            // Render arrow

            render_arrow(x, y)
        }
    } else if (Control == "delete" && MouseDown.down) {
        // Delete objects

        delete_objects(x, y)
    }
}

function delete_objects(x, y) {
    // Objects to destroy

    const destroy_list = []

    // Convert to percentage

    x = x / SimWidth * 100
    y = y / SimHeight * 100

    // Check for objects to delete

    for (let s = 0; s < Sim.spots.length; s++) {
        if (distance(x, y, Sim.spots[s].x, Sim.spots[s].y, "px") <= Sim.spots[s].radius) {
            destroy_list.push(Sim.spots[s].id)
        }
    }

    for (let o = 0; o < Sim.objects.length; o++) {
        if (distance(x, y, Sim.objects[o].x, Sim.objects[o].y, "px") <= Sim.objects[o].radius) {
            destroy_list.push(Sim.objects[o].id)
        }
    }

    // Destroy objects

    if (destroy_list.length) {
        Sim.spots = Sim.spots.filter(spot => !destroy_list.includes(spot.id))
        Sim.objects = Sim.objects.filter(object => !destroy_list.includes(object.id))
    }
}

function render_arrow(x, y) {
    // Data

    const obj_x = MouseDown.x / 100 * SimWidth
    const obj_y = MouseDown.y / 100 * SimHeight

    const angle = Math.atan2(y - obj_y, x - obj_x)
    let dist = Math.ceil(distance(obj_x / SimWidth * 100, obj_y / SimHeight * 100, x / SimWidth * 100, y / SimHeight * 100, "px"))

    if (dist > Math.floor(Math.sqrt(Settings.objectMass / config.objectDensity))) {
        // Maximum distance

        if (dist >= config.maxDistance) {
            x = Math.ceil(Math.cos(angle) * config.maxDistance) + obj_x
            y = Math.ceil(Math.sin(angle) * config.maxDistance) + obj_y
            dist = config.maxDistance
        }

        // Rendering

        ControlCanvas.fillStyle = config.arrowDotColor
        ControlCanvas.strokeStyle = config.arrowDotColor

        for (let d = 0; d < Math.floor(dist / config.arrowDotSpacing); d++) {
            const dot_dist = d * config.arrowDotSpacing + config.arrowDotSpacing + 5

            ControlCanvas.beginPath()
            ControlCanvas.arc(Math.ceil(Math.cos(angle) * dot_dist) + obj_x, Math.ceil(Math.sin(angle) * dot_dist) + obj_y, config.arrowDotRadius, 0, Math.PI * 2)
            ControlCanvas.fill()
            ControlCanvas.closePath()
            ControlCanvas.stroke()
        }
    }
}

function launch_object(x, y) {
    // Data

    x = x / SimWidth * 200
    y = y / SimHeight * 200

    const obj_x = MouseDown.x
    const obj_y = MouseDown.y

    const angle = Math.atan2(obj_y - y, obj_x - x)
    const power = config.powerMult * Math.min(distance(obj_x, obj_y, x, y, "px"), config.maxDistance)

    // Launch object

    Sim.objects.push({
        id: generate_id(),
        x: obj_x,
        y: obj_y,
        radius: Math.floor(Math.sqrt(Settings.objectMass / config.objectDensity)),
        mass: Settings.objectMass,
        vX: power * Math.cos(angle),
        vY: power * Math.sin(angle),
        prevPos: []
    })
}

function tick_warp(value) {
    if (value && !isNaN(value)) {
        // Elements

        const sliders = document.getElementsByClassName("settingsSlider")
        const reset = document.getElementsByClassName("sliderReset")

        const warp_input = document.getElementById("warp-input")
        const warp = document.getElementById("warp")

        // Disable inputs

        for (let s = 0; s < sliders.length; s++) {
            sliders[s].disabled = true
        }

        for (let r = 0; r < reset.length; r++) {
            reset[r].disabled = true
        }

        warp_input.disabled = true
        warp.disabled = true

        // Tick warp

        NextFrame = false

        let tick = 0
        const warp_interval = setInterval(() => {
            // Sim

            sim()
            render()

            // Warp end

            if (tick++ == value) {
                stop_warp(warp_interval)
            }
        })
    }
}

function stop_warp(warp_interval) {
    // Elements

    const sliders = document.getElementsByClassName("settingsSlider")
    const reset = document.getElementsByClassName("sliderReset")

    const warp_input = document.getElementById("warp-input")
    const warp = document.getElementById("warp")

    // Clear interval

    clearInterval(warp_interval)

    // Enable inputs

    for (let s = 0; s < sliders.length; s++) {
        sliders[s].disabled = false
    }

    for (let r = 0; r < reset.length; r++) {
        reset[r].disabled = false
    }

    warp_input.disabled = false
    warp.disabled = false

    // Normal simulation

    NextFrame = true
    requestAnimationFrame(sim)
}