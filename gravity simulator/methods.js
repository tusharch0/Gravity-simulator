function resize() {
    // Resize canvas to fit window

    SimHeight = window.innerHeight * 2
    SimWidth = window.innerWidth * 2

    SimCanvas.clearRect(0, 0, SimWidth, SimHeight)
    ControlCanvas.clearRect(0, 0, SimWidth, SimHeight)

    SimCanvas.canvas.height = SimHeight
    SimCanvas.canvas.width = SimWidth
    ControlCanvas.canvas.height = SimHeight
    ControlCanvas.canvas.width = SimWidth

    // Rerender simulation

    render()
}

function distance(x1, y1, x2, y2, type) {
    if (type == "px") {
        return Math.sqrt(((x1 - x2) / 100 * SimWidth) ** 2 + ((y1 - y2) / 100 * SimHeight) ** 2)
    } else {
        return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
    }
}

function generate_id() {
    return Math.random().toString(36).substr(2)
}