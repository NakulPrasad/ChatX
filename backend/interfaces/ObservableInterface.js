/**
 * Interface for observables in the observer pattern.
 * @interface
 */
class ObservableInterface {
    /**
     * Adds an observer to the observable.
     * 
     * @param {ObserverInterface} observer - The observer to add.
     * @throws {Error} If not implemented by a subclass.
     */
    subscribe(observer) {
        throw new Error('Method "subscribe" must be implemented by subclasses');
    }

    /**
     * Removes an observer from the observable.
     * 
     * @param {ObserverInterface} observer - The observer to remove.
     * @throws {Error} If not implemented by a subclass.
     */
    unsubscribe(observer) {
        throw new Error('Method "unsubscribe" must be implemented by subclasses');
    }

    /**
     * Notifies all observers of a new update.
     * 
     * @param {string} notification - The notification to send.
     * @throws {Error} If not implemented by a subclass.
     */
    notify(notification) {
        throw new Error('Method "notify" must be implemented by subclasses');
    }
}

module.exports = ObservableInterface;
