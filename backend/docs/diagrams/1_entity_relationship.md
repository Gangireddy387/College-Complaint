# Entity Relationship Diagram

This diagram shows the relationships between all models in the College Complaint Management System.

```mermaid
erDiagram
    Department ||--o{ Student : contains
    Department ||--o{ Faculty : employs
    Department ||--|| Faculty : "has HOD"
    Department ||--o{ Section : manages

    Principal ||--o{ DisciplinaryComplaint : handles

    Faculty ||--o{ Section : "class teacher"
    Faculty ||--o{ Subject : teaches
    Faculty ||--o{ TimeSlot : conducts
    Faculty ||--o{ Attendance : records
    Faculty ||--o{ DisciplinaryComplaint : reports
    Faculty ||--o{ DisciplinaryComplaint : resolves

    Section ||--|| ClassRoom : "assigned to"
    Section ||--o{ Subject : offers
    Section ||--o{ TimeSlot : schedules
    Section }o--o{ Student : "enrolls via SectionStudent"

    Subject ||--o{ TimeSlot : "scheduled in"

    TimeSlot ||--o{ Attendance : tracks
    TimeSlot ||--o{ DisciplinaryComplaint : "records incidents"

    Student ||--o{ Attendance : has
    Student ||--o{ DisciplinaryComplaint : receives
    Student }|--|| Department : "belongs to"

    ClassRoom ||--o{ Section : hosts
```

## Key Relationships

1. **Department Relationships**
   - Contains multiple Students
   - Employs multiple Faculty
   - Has one HOD (Faculty)
   - Manages multiple Sections

2. **Faculty Relationships**
   - Can be HOD of Department
   - Can be class teacher of Sections
   - Teaches Subjects
   - Records Attendance
   - Reports and resolves Complaints

3. **Section Relationships**
   - Assigned to one ClassRoom
   - Has multiple Subjects
   - Has multiple TimeSlots
   - Contains multiple Students (through SectionStudent)

4. **Student Relationships**
   - Belongs to one Department
   - Enrolled in Sections
   - Has Attendance records
   - Can receive Complaints

5. **TimeSlot Relationships**
   - Links Subject, Section, and Faculty
   - Tracks Attendance
   - Records Disciplinary incidents
