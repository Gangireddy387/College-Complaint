# Class Diagram

This diagram shows the detailed structure of each model including attributes and methods.

```mermaid
classDiagram
    class Department {
        +String departmentCode
        +String name
        +Text description
        +Integer hodId
        +Integer establishedYear
        +String email
        +String phoneNumber
        +JSONB location
        +JSONB facilities
        +JSONB programs
        +Array researchAreas
        +Integer totalStudents
        +Integer totalFaculty
    }

    class Faculty {
        +String employeeId
        +String firstName
        +String lastName
        +String email
        +String password
        +Integer departmentId
        +String designation
        +Array specializations
        +JSONB qualifications
        +String phoneNumber
        +Date joiningDate
        +JSONB experience
        +Integer currentWorkload
        +validatePassword()
    }

    class Student {
        +String studentId
        +String firstName
        +String lastName
        +String email
        +String password
        +Integer departmentId
        +Integer semester
        +String phoneNumber
        +Date dateOfBirth
        +JSONB address
        +JSONB guardianInfo
        +JSONB academicHistory
        +validatePassword()
    }

    class Section {
        +String name
        +Integer departmentId
        +Integer classRoomId
        +Integer semester
        +String academicYear
        +Integer capacity
        +Integer classTeacherId
        +String shift
        +JSONB schedule
        +JSONB events
        +Integer currentStrength
    }

    class TimeSlot {
        +Time startTime
        +Time endTime
        +String dayOfWeek
        +Integer subjectId
        +Integer sectionId
        +Integer facultyId
        +String roomNumber
        +Date effectiveDate
        +Date endDate
        +JSONB recurrence
        +JSONB attendanceStats
    }

    class DisciplinaryComplaint {
        +Integer timeSlotId
        +Integer studentId
        +String complaintType
        +Text description
        +String severity
        +Integer reportedBy
        +String status
        +Text actionTaken
        +Boolean parentNotified
        +String disciplinaryAction
        +Integer principalId
        +Date escalatedToPrincipalAt
        +Integer resolvedBy
        +Date resolvedAt
    }

    Department --|> Faculty
    Department --|> Student
    Department --|> Section
    Faculty --|> Section
    Faculty --|> Subject
    Section --|> ClassRoom
    Section --|> TimeSlot
    TimeSlot --|> DisciplinaryComplaint
    Student --|> SectionStudent
    Section --|> SectionStudent
```

## Model Features

1. **PostgreSQL-Specific Types**
   - JSONB for complex data
   - Array for lists
   - TSVECTOR for search
   - Enum for constrained choices

2. **Common Attributes**
   - Timestamps (created_at, updated_at)
   - Soft deletes (deleted_at)
   - Search vectors
   - Metadata fields

3. **Security Features**
   - Password hashing
   - Email validation
   - Phone number validation
   - Status tracking
