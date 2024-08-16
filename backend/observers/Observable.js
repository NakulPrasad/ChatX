class Observable {
    constructor() {
        this.observers = []
    }
    subscribe(observer) {
        this.observers.push(observer)
    }
    unsubscribe(observer) {
        this.observers = this.observers.filter(obs => obs !== observer)
    }
    notify(message) {
        this.observers.forEach(observer => observer.update(message))
    }


}
module.exports = Observable