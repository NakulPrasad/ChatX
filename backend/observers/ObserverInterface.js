/**
 * Represents an interface for observers in the observer pattern.
 * @interface
 */
class ObserverInterface {
    /**
     * Updates the observer with a new notification.
     * @param {string} notification - The notification to be delivered to the observer.
     * @throws {Error} Will throw an error if the method is not implemented.
     */
    update(notification) {
        throw new Error('update must be implemented');
    }
}

module.exports = ObserverInterface;
