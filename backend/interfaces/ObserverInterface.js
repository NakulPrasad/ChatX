/**
 * Interface for observers in the observer pattern.
 * @interface
 */
class ObserverInterface {
    /**
     * Handles updates or notifications.
     * 
     * This method should be implemented by subclasses.
     * 
     * @param {string} notification - The notification to deliver.
     * @throws {Error} If the method is not implemented by a subclass.
     */
    update(notification) {
        throw new Error('Method "update" must be implemented by subclasses');
    }
}

module.exports = ObserverInterface;
