const Student = require('./Student');
const Principal = require('./Principal');
const Faculty = require('./Faculty');
const Department = require('./Department');
const Section = require('./Section');
const Subject = require('./Subject');
const TimeSlot = require('./TimeSlot');
const Attendance = require('./Attendance');
const DisciplinaryComplaint = require('./DisciplinaryComplaint');
const ClassRoom = require('./ClassRoom');
const SectionStudent = require('./SectionStudent');

// Department Relationships
Department.hasMany(Student, {
  foreignKey: 'departmentId',
  as: 'students',
  onDelete: 'RESTRICT'
});
Student.belongsTo(Department, {
  foreignKey: 'departmentId',
  as: 'department'
});

Department.hasMany(Faculty, {
  foreignKey: 'departmentId',
  as: 'faculty',
  onDelete: 'RESTRICT'
});
Faculty.belongsTo(Department, {
  foreignKey: 'departmentId',
  as: 'department'
});

Department.belongsTo(Faculty, {
  foreignKey: 'hodId',
  as: 'headOfDepartment',
  constraints: false
});
Faculty.hasOne(Department, {
  foreignKey: 'hodId',
  as: 'managedDepartment',
  constraints: false
});

Department.hasMany(Section, {
  foreignKey: 'departmentId',
  as: 'sections',
  onDelete: 'RESTRICT'
});
Section.belongsTo(Department, {
  foreignKey: 'departmentId',
  as: 'department'
});

// Principal Relationships
Principal.hasMany(DisciplinaryComplaint, {
  foreignKey: 'principalId',
  as: 'complaintsHandled'
});
DisciplinaryComplaint.belongsTo(Principal, {
  foreignKey: 'principalId',
  as: 'principal'
});

// Faculty Relationships
Faculty.hasMany(Section, {
  foreignKey: 'classTeacherId',
  as: 'sectionsHandled',
  onDelete: 'RESTRICT'
});
Section.belongsTo(Faculty, {
  foreignKey: 'classTeacherId',
  as: 'classTeacher'
});

Faculty.hasMany(Subject, {
  foreignKey: 'facultyId',
  as: 'subjectsHandled',
  onDelete: 'RESTRICT'
});
Subject.belongsTo(Faculty, {
  foreignKey: 'facultyId',
  as: 'faculty'
});

Faculty.hasMany(TimeSlot, {
  foreignKey: 'facultyId',
  as: 'timeSlots',
  onDelete: 'RESTRICT'
});
TimeSlot.belongsTo(Faculty, {
  foreignKey: 'facultyId',
  as: 'faculty'
});

Faculty.hasMany(Attendance, {
  foreignKey: 'markedBy',
  as: 'attendancesMarked'
});
Attendance.belongsTo(Faculty, {
  foreignKey: 'markedBy',
  as: 'marker'
});

Faculty.hasMany(DisciplinaryComplaint, {
  foreignKey: 'reportedBy',
  as: 'complaintsReported'
});
DisciplinaryComplaint.belongsTo(Faculty, {
  foreignKey: 'reportedBy',
  as: 'reporter'
});

Faculty.hasMany(DisciplinaryComplaint, {
  foreignKey: 'resolvedBy',
  as: 'complaintsResolved'
});
DisciplinaryComplaint.belongsTo(Faculty, {
  foreignKey: 'resolvedBy',
  as: 'resolver'
});

// ClassRoom Relationships
ClassRoom.hasMany(Section, {
  foreignKey: 'classRoomId',
  as: 'sections',
  onDelete: 'RESTRICT'
});
Section.belongsTo(ClassRoom, {
  foreignKey: 'classRoomId',
  as: 'classRoom'
});

// Section Relationships
Section.belongsToMany(Student, {
  through: SectionStudent,
  foreignKey: 'sectionId',
  otherKey: 'studentId',
  as: 'students'
});
Student.belongsToMany(Section, {
  through: SectionStudent,
  foreignKey: 'studentId',
  otherKey: 'sectionId',
  as: 'sections'
});

Section.hasMany(Subject, {
  foreignKey: 'sectionId',
  as: 'subjects',
  onDelete: 'RESTRICT'
});
Subject.belongsTo(Section, {
  foreignKey: 'sectionId',
  as: 'section'
});

Section.hasMany(TimeSlot, {
  foreignKey: 'sectionId',
  as: 'timeSlots',
  onDelete: 'RESTRICT'
});
TimeSlot.belongsTo(Section, {
  foreignKey: 'sectionId',
  as: 'section'
});

// Subject Relationships
Subject.hasMany(TimeSlot, {
  foreignKey: 'subjectId',
  as: 'timeSlots',
  onDelete: 'RESTRICT'
});
TimeSlot.belongsTo(Subject, {
  foreignKey: 'subjectId',
  as: 'subject'
});

// TimeSlot Relationships
TimeSlot.hasMany(Attendance, {
  foreignKey: 'timeSlotId',
  as: 'attendances',
  onDelete: 'CASCADE'
});
Attendance.belongsTo(TimeSlot, {
  foreignKey: 'timeSlotId',
  as: 'timeSlot'
});

TimeSlot.hasMany(DisciplinaryComplaint, {
  foreignKey: 'timeSlotId',
  as: 'complaints',
  onDelete: 'RESTRICT'
});
DisciplinaryComplaint.belongsTo(TimeSlot, {
  foreignKey: 'timeSlotId',
  as: 'timeSlot'
});

// Student Relationships
Student.hasMany(Attendance, {
  foreignKey: 'studentId',
  as: 'attendances',
  onDelete: 'CASCADE'
});
Attendance.belongsTo(Student, {
  foreignKey: 'studentId',
  as: 'student'
});

Student.hasMany(DisciplinaryComplaint, {
  foreignKey: 'studentId',
  as: 'complaints',
  onDelete: 'RESTRICT'
});
DisciplinaryComplaint.belongsTo(Student, {
  foreignKey: 'studentId',
  as: 'student'
});

// SectionStudent direct associations
SectionStudent.belongsTo(Section, {
  foreignKey: 'sectionId'
});
SectionStudent.belongsTo(Student, {
  foreignKey: 'studentId'
});

module.exports = {
  Student,
  Principal,
  Faculty,
  Department,
  Section,
  Subject,
  TimeSlot,
  Attendance,
  DisciplinaryComplaint,
  ClassRoom,
  SectionStudent
};