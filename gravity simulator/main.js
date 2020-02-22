// Simulator canvas context

let SimCanvas

// When document is loaded...

document.addEventListener("DOMContentLoaded", () => {
    // Event listeners

    control_listeners()

    // Initialize simulation

    SimCanvas = document.getElementById("sim").getContext("2d")
    ControlCanvas = document.getElementById("control").getContext("2d")

    initialize()
})

// Resize canvas

onresize = resize