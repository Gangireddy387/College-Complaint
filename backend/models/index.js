const Student = require('./Student');
const Principal = require('./Principal');
const Faculty = require('./Faculty');
const Department = require('./Department');
const Subject = require('./Subject');
const TimeSlot = require('./TimeSlot');
const Attendance = require('./Attendance');
const DisciplinaryComplaint = require('./DisciplinaryComplaint');
const ClassRoom = require('./ClassRoom');
const OTP = require('./OTP');
const College = require('./College');

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
  foreignKey: 'department_id',
  as: 'faculty',
  onDelete: 'RESTRICT'
});
Faculty.belongsTo(Department, {
  foreignKey: 'department_id',
  as: 'department'
});

Department.belongsTo(Faculty, {
  foreignKey: 'hod_id',
  as: 'headOfDepartment',
  constraints: false
});
Faculty.hasOne(Department, {
  foreignKey: 'hod_id',
  as: 'managedDepartment',
  constraints: false
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
ClassRoom.belongsTo(Department, {
  foreignKey: 'department_id',
  as: 'department'
});
Department.hasMany(ClassRoom, {
  foreignKey: 'department_id',
  as: 'classrooms'
});

ClassRoom.hasMany(TimeSlot, {
  foreignKey: 'classroom_id',
  as: 'timeSlots',
  onDelete: 'RESTRICT'
});
TimeSlot.belongsTo(ClassRoom, {
  foreignKey: 'classroom_id',
  as: 'classroom'
});

ClassRoom.hasMany(Subject, {
  foreignKey: 'classroom_id',
  as: 'subjects',
  onDelete: 'RESTRICT'
});
Subject.belongsTo(ClassRoom, {
  foreignKey: 'classroom_id',
  as: 'classroom'
});

ClassRoom.hasMany(Attendance, {
  foreignKey: 'classroom_id',
  as: 'attendances',
  onDelete: 'RESTRICT'
});
Attendance.belongsTo(ClassRoom, {
  foreignKey: 'classroom_id',
  as: 'classroom'
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

// College Relationships
College.hasMany(Principal, {
  foreignKey: 'collegeId',
  as: 'collegePrincipals'
});
Principal.belongsTo(College, {
  foreignKey: 'collegeId',
  as: 'college'
});

College.hasMany(Department, {
  foreignKey: 'collegeId',
  as: 'collegeDepartments'
});
Department.belongsTo(College, {
  foreignKey: 'collegeId',
  as: 'college'
});

College.hasMany(Faculty, {
  foreignKey: 'collegeId',
  as: 'collegeFaculty'
});
Faculty.belongsTo(College, {
  foreignKey: 'collegeId',
  as: 'college'
});

College.hasMany(Student, {
  foreignKey: 'collegeId',
  as: 'collegeStudents'
});
Student.belongsTo(College, {
  foreignKey: 'collegeId',
  as: 'college'
});

College.hasMany(ClassRoom, {
  foreignKey: 'collegeId',
  as: 'collegeClassrooms'
});
ClassRoom.belongsTo(College, {
  foreignKey: 'collegeId',
  as: 'college'
});

College.hasMany(Subject, {
  foreignKey: 'collegeId',
  as: 'collegeSubjects'
});
Subject.belongsTo(College, {
  foreignKey: 'collegeId',
  as: 'college'
});

College.hasMany(TimeSlot, {
  foreignKey: 'collegeId',
  as: 'collegeTimeslots'
});
TimeSlot.belongsTo(College, {
  foreignKey: 'collegeId',
  as: 'college'
});

College.hasMany(Attendance, {
  foreignKey: 'collegeId',
  as: 'collegeAttendances'
});
Attendance.belongsTo(College, {
  foreignKey: 'collegeId',
  as: 'college'
});

College.hasMany(DisciplinaryComplaint, {
  foreignKey: 'collegeId',
  as: 'collegeComplaints'
});
DisciplinaryComplaint.belongsTo(College, {
  foreignKey: 'collegeId',
  as: 'college'
});

College.hasMany(OTP, {
  foreignKey: 'collegeId',
  as: 'collegeOtps'
});
OTP.belongsTo(College, {
  foreignKey: 'collegeId',
  as: 'college'
});

module.exports = {
  Student,
  Principal,
  Faculty,
  Department,
  Subject,
  TimeSlot,
  Attendance,
  DisciplinaryComplaint,
  ClassRoom,
  OTP,
  College
};