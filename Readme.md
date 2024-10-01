25/08/2024


Now we need to update the score



## 1. Trigger: `after_invite_accepted`
- **Purpose**: Updates the `membersIds` JSON array in the `groups` table when an invite is accepted.
- **Functionality**:
  - **Event**: Triggered **AFTER UPDATE** on the `groupinvites` table.
  - **Condition**: Checks if the new status (`NEW.Status`) is `'ACCEPTED'`.
  - **Action**: Appends the `NEW.userId` to the `membersIds` JSON array in the corresponding group (identified by `NEW.groupId`).

## 2. Trigger: `after_event_completed`
- **Purpose**: Updates the `membersIds` JSON array in the `groups` table with scores when an event is marked as `COMPLETED`.
- **Functionality**:
  - **Event**: Triggered **AFTER UPDATE** on the `events` table.
  - **Condition**: Checks if the new status (`NEW.status`) is `'COMPLETED'`.
  - **Action**: Updates the `membersIds` column in the `groups` table by merging scores from the `scoreByMember` table where the `eventId` matches `NEW.id`.

## 3. Trigger: `after_event_insert`
- **Purpose**: Appends the ID of a newly created event to the `events` JSON array in the `groups` table.
- **Functionality**:
  - **Event**: Triggered **AFTER INSERT** on the `events` table.
  - **Action**: Appends `NEW.id` (the newly created event ID) to the `events` JSON column in the corresponding group identified by `NEW.fromGroup`.

## Key Points:
- All triggers ensure data integrity and automate updates between related tables without requiring explicit updates from application logic.
- They leverage MySQL’s JSON functions (like `JSON_ARRAY_APPEND`, `JSON_UNQUOTE`, etc.) to manipulate JSON data directly within the database.
- They are defined using `DELIMITER` to allow multi-statement blocks and are executed in response to specific changes in the data.

## Example Use Cases:
- When a group invite is accepted, the corresponding group's member list is updated with the user ID.
- When an event is marked as completed, member scores from the `scoreByMember` table are aggregated and stored in the group's member list.
- When a new event is created, the event's ID is automatically added to the appropriate group's event list.

This setup promotes a dynamic and responsive database structure, ensuring that related data remains consistent across different tables. If you have any further questions or need additional clarification on any trigger, feel free to ask!
