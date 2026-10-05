# School database design

## Tables and relationships

- **Students** stores each student's name and unique email address. A student has a one-to-many relationship with enrolments because one student can have several enrolment records.
- **Courses** stores each course name. A course also has a one-to-many relationship with enrolments because many students can enrol in the same course.
- **Enrolments** records a student's participation in a course and their grade. It is a join table that resolves the many-to-many relationship between students and courses: each student can take multiple courses, and each course can have multiple students. The composite primary key (`student_id`, `course_id`) prevents the same student from enrolling in the same course twice.

The foreign keys in enrolments link each record to an existing student and course. The unique, non-null email constraint prevents duplicate or missing student email addresses.

## Index

The schema adds an index on `enrolments.course_id`. The composite primary key starts with `student_id`, so this additional index helps SQLite find all students on a course and calculate course enrolment counts efficiently.

## SQL or NoSQL?

I would choose a relational SQL database for this system. Students, courses, and enrolments have clear relationships, and enrolments must reliably reference existing students and courses. SQLite's foreign keys, unique constraints, and transactions help preserve that consistency, while JOINs make it straightforward to answer questions such as which students attend a course. A NoSQL database would be more appropriate if the data were highly variable or did not depend on these structured relationships.
