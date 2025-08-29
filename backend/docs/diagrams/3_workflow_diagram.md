# Workflow Diagram

This diagram shows the disciplinary complaint workflow process.

```mermaid
stateDiagram-v2
    [*] --> Incident
    Incident --> Reported: Faculty Reports
    Reported --> UnderReview: Initial Assessment
    UnderReview --> EscalatedToPrincipal: If Severity Critical
    UnderReview --> ActionTaken: Minor Issue
    EscalatedToPrincipal --> ActionTaken: Principal Reviews
    ActionTaken --> ParentNotified: If Required
    ActionTaken --> Resolved: Complete
    ParentNotified --> Resolved: After Meeting
    Resolved --> [*]
    UnderReview --> Dismissed: No Action Needed
    Dismissed --> [*]

    state Incident {
        [*] --> LateArrival
        [*] --> Disturbance
        [*] --> Misbehavior
        [*] --> UnauthorizedDevice
        [*] --> AcademicDishonesty
        [*] --> Bullying
    }

    state ActionTaken {
        [*] --> Warning
        [*] --> Counseling
        [*] --> ParentMeeting
        [*] --> Detention
        [*] --> Suspension
    }
```

## Workflow States

1. **Initial States**
   - Incident Occurs
   - Reported by Faculty
   - Under Review

2. **Processing States**
   - Escalated to Principal
   - Action Taken
   - Parent Notified

3. **Final States**
   - Resolved
   - Dismissed

4. **Incident Types**
   - Late Arrival
   - Disturbance
   - Misbehavior
   - Unauthorized Device
   - Academic Dishonesty
   - Bullying

5. **Action Types**
   - Warning
   - Counseling
   - Parent Meeting
   - Detention
   - Suspension
