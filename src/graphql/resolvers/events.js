const Event = require('../../models/event');
const { transformEvent } = require('./merge')



module.exports = {
    events: async () => {
        try {
            const events = await Event.find().populate('creator')
            const result = events.map(event => {
                return transformEvent(event);
            })
            return result;
        } catch (err) {
            throw err;
        }
    },
    createEvent: async args => {
        try {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: '5dd81e75e1bfe224a657427d'
            })
            let createdEvent;
            const result = await event.save()
            createdEvent = transformEvent(result);
            const creator = await User.findById('5dd81e75e1bfe224a657427d');

            if (!creator) {
                throw new Error('User not found.');
            }
            creator.createdEvents.push(event);
            await creator.save();

            return createdEvent;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}