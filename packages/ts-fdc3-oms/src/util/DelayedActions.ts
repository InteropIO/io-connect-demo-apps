type AnyFunction = (...args: any[]) => any
type OptionalAnyFunction = AnyFunction | null | undefined
class DelayedLatestActionExecutor {
    private delay = 500
    private latestAction: OptionalAnyFunction = undefined
    private timeoutId: NodeJS.Timeout | undefined = undefined

    constructor(myDelay?: number) {
        this.setDelay(myDelay)
    }

    private performAction() {
        const action = this.latestAction
        this.cancel()
        if (typeof action === 'function') {
            action()
        }
    }

    private clearTimeout() {
        if (!this.timeoutId) return
        clearTimeout(this.timeoutId)
        this.timeoutId = undefined
    }

    public setDelay(myDelay?: number) {
        if (typeof myDelay === 'number') {
            this.delay = myDelay
        }
    }

    public action(fn: OptionalAnyFunction) {
        if (!this.timeoutId) {
            this.timeoutId = setTimeout(
                this.performAction.bind(this),
                this.delay
            )
        }
        this.latestAction = fn
    }

    public cancel() {
        this.latestAction = undefined
        this.clearTimeout()
    }
}

export { DelayedLatestActionExecutor }
