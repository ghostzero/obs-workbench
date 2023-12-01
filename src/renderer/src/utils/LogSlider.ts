export class LogSlider {
    private minpos: any
    private maxpos: number
    private minlval: number
    private maxlval: number
    private scale: number

    constructor(options: any) {
        options = options || {}
        this.minpos = options.minpos || 0
        this.maxpos = options.maxpos || 1
        this.minlval = Math.log(options.minval || 1)
        this.maxlval = Math.log(options.maxval || 100000)

        this.scale = (this.maxlval - this.minlval) / (this.maxpos - this.minpos)
    }

    // Calculate value from a slider position
    value(position: any) {
        return Math.exp((position - this.minpos) * this.scale + this.minlval)
    }

    // Calculate slider position from a value
    position(value: any) {
        return this.minpos + (Math.log(value) - this.minlval) / this.scale
    }
}