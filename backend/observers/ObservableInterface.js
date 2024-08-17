/**
 * Represents an interface for an observable.
 * @interface
 */
class ObservableInterface {
    /**
     * Subscribes an observer to the observable.
     * @param {Object} observer - The observer to be subscribed.
     * @throws {Error} Will throw an error if not implemented.
     */
    subscribe(observer) {
        throw new Error('subscribe must be implemented');
    }

    /**
     * Unsubscribes an observer from the observable.
     * @param {Object} observer - The observer to be unsubscribed.
     * @throws {Error} Will throw an error if not implemented.
     */
    unsubscribe(observer) {
        throw new Error('unsubscribe must be implemented');
    }

    /**
     * Notifies all subscribed observers of a new notification.
     * @param {Object} notification - The notification to be sent to observers.
     * @throws {Error} Will throw an error if not implemented.
     */
    notify(notification) {
        throw new Error('notify must be implemented');
    }
}

module.exports = ObservableInterface;
