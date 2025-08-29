# Database Schema Diagram

This diagram shows the database schema including indexes and constraints.

```mermaid
classDiagram
    class Indexes {
        GIN Indexes
        --
        searchVector
        metadata
        specializations
        facilities
        schedule
    }

    class Constraints {
        Foreign Keys
        --
        Department -> Faculty (HOD)
        Section -> Department
        Section -> ClassRoom
        Section -> Faculty
        TimeSlot -> Subject
        TimeSlot -> Section
        TimeSlot -> Faculty
        DisciplinaryComplaint -> TimeSlot
        DisciplinaryComplaint -> Student
        DisciplinaryComplaint -> Faculty
        DisciplinaryComplaint -> Principal
    }

    class UniqueConstraints {
        Unique Fields
        --
        Department.departmentCode
        Faculty.employeeId
        Faculty.email
        Student.studentId
        Student.email
        ClassRoom.roomNumber
        Subject.subjectCode
    }

    class Validations {
        Field Validations
        --
        Email Format
        Phone Number Format
        Date Ranges
        Capacity Limits
        Time Order
        Status Transitions
    }

    Indexes --> Department
    Indexes --> Faculty
    Indexes --> Student
    Indexes --> DisciplinaryComplaint
    
    Constraints --> Section
    Constraints --> TimeSlot
    Constraints --> DisciplinaryComplaint
    
    UniqueConstraints --> Department
    UniqueConstraints --> Faculty
    UniqueConstraints --> Student
    
    Validations --> TimeSlot
    Validations --> Section
    Validations --> DisciplinaryComplaint
```

## Database Features

1. **PostgreSQL-Specific Indexes**
   - GIN indexes for JSONB
   - GIN indexes for arrays
   - GIN indexes for full-text search
   - B-tree indexes for regular fields

2. **Constraints**
   - Foreign key relationships
   - Unique constraints
   - Not null constraints
   - Check constraints

3. **Validations**
   - Data format validations
   - Business rule validations
   - Cross-field validations
   - Status transition validations

4. **Performance Features**
   - Efficient indexing
   - Proper constraints
   - Optimized queries
   - Search vectors
