
import { createEventQuery } from '../src/models/eventsModels';

describe('createEventQuery', () => {
    it('should create a new event', async () => {
        const newEvent = {
            name: 'Event Name',
            description: 'This is a description of the event.',
            groupId: '550e8400-e29b-41d4-a716-446655440000',
            location: '123 Main St, Springfield, IL',
            startDate: new Date('2024-07-31T23:00:00.000Z'),
            endDate: new Date('2024-12-01T00:00:00.000Z'),
            attendees: ['Alice', 'Bob', 'Charlie'],
            scoreByMember: [
                { memberId: '5345435345', score: 80 },
                { memberId: '7322425', score: 234 }
            ],
        };


        const result = await createEventQuery(
            newEvent.name,
            newEvent.description,
            newEvent.groupId,
            newEvent.location,
            newEvent.startDate,
            newEvent.endDate,
            newEvent.attendees,
            newEvent.scoreByMember
        );


        expect(result).toBeDefined();

    });
});
