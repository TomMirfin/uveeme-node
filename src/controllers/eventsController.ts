import { getEventByIdQuery, getEventsForGroupQuery, createEventQuery, alterEventQuery, deleteEventQuery } from "../models/eventsModels";
import moment from 'moment';
export const getEventById = (req: any, res: any, next: any) => {
    const { id } = req.params;
    getEventByIdQuery(id).then((rows: any) => { res.status(200).send(rows) });
}

export const getEventsForGroup = (req: any, res: any, next: any) => {
    const { id } = req.params;
    getEventsForGroupQuery(id).then((rows: any) => { res.status(200).send(rows) });

}

export const createEvent = async (req: any, res: any, next: any) => {
    console.log('Request Body:', req.body);

    try {
        const {
            name,
            description,
            fromGroup,  // Presumably the group ID this event is associated with
            location,
            attendees = [],
            scoreByMember = [],
            startDate,
            endDate,
            status = 'INACTIVE' // Default to INACTIVE if not provided
        } = req.body;

        // Validate required fields
        if (!name || !description) {
            return res.status(400).send({ error: 'Name and description are required' });
        }

        // Convert to Date objects using moment
        const momentStartDate = moment(startDate).toDate();
        const momentEndDate = moment(endDate).toDate();


        // Create event query
        const rows = await createEventQuery(
            name,
            description,
            fromGroup,
            location,
            momentStartDate,
            momentEndDate,
            attendees,
            scoreByMember,
            status
        );

        res.status(201).json(rows);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

export const alterEvent = async (req: any, res: any, next: any) => {
    console.log('Request Body:', req.body);

    try {
        const {
            id,
            name,
            description,
            date,
            location,
            attendees = []
        } = req.body;

        if (!id) {
            return res.status(400).send({ error: 'Event ID is required' });
        }

        const rows = await alterEventQuery(
            id,
            name,
            description,
            date,
            location,
            attendees

        );

        res.status(200).send(rows);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};


export const deleteEvent = async (req: any, res: any, next: any) => {
    const { id } = req.params;

    try {
        const rows = await deleteEventQuery(id);
        res.status(200).send(rows);
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};