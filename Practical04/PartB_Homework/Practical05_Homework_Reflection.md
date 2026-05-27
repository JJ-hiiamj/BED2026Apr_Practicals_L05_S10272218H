# Practical 05 Homework Reflection

## Separation of Concerns

### Distinct responsibilities in MVC + separate View

In my final project, I can now clearly see what each part is supposed to do:

- **Model**: talks to the database (SQL queries, reading/writing data, mapping fields).
- **Controller**: handles requests/responses (calls model functions, returns status codes like 200/400/404/500).
- **View (frontend pages)**: handles what users see and click (forms, buttons, fetch requests, and showing messages).

### How separate frontend simplifies backend API

Having a separate frontend made the backend much simpler for me. The API now only focuses on data and response handling, while the HTML/JS pages focus on UI. Because of that separation, it became easier to test each part and debug problems faster.

## Robustness and Security

Debugging became easier from Practical 04 onward. In Practical 03, everything felt more mixed together, so when something failed, it was hard to tell where the issue was. After adding MVC structure, validation, and better error responses, I could identify bugs more quickly, for example, whether it was a validation issue, a missing record, or a server/database error.

## Challenges and Problem Solving

The most challenging part for me was keeping the database schema, API, and frontend in sync. I ran into issues like expecting `id` in code while my table used `student_id`. My approach was to trace the full flow, frontend -> controller -> model -> SQL, then fix the mapping in one place so responses stay consistent.

## Adding New Features in Current Structure

If I need to add a new feature no, like `genre` for books or user login, the structure is much more manageable because each change has a clear place:

- Update DB schema and model queries.
- Update validation rules in middleware.
- Update controller responses if needed.
- Update frontend forms and rendering.

Compared to the earlier practicals, this is more efficient because I can work on smaller focused parts instead of editing one big file with everything mixed together.

## Experiential Learning

Honestly, doing the coding and refactoring myself helped me to understand the concepts much better, rather than just reading slides or notes. By fixing real errors such as, validation failures, wrong status codes, schema mismatches, and API response bugs, I understood why MVC is very useful, and why validation is important, and why parameterized queries matter for security. It also showed me how proper error handling helps in both users and developers.