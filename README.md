# Simple Task Manager

A small full-stack app for creating and listing tasks.

- **frontend/**: Angular 18 (standalone components, reactive forms, signals)
- **backend/**: Java 17 + Spring Boot 3.3, Spring Data JPA / Hibernate, H2 in-memory database

## Prerequisites

- Java 17 or higher
- Maven 3.9+
- Node.js 20 or higher (npm included)

## Opening in IntelliJ IDEA

1. **File → Open** and select the repository root folder (the one containing this README), not `backend/`.
2. IntelliJ detects the root `pom.xml` and imports the backend as a Maven module. Accept "Load Maven project" if prompted.
3. Make sure **File → Project Structure → Project → SDK** is Java 17 or higher.
4. Run configurations are shared in `.run/` and appear in the toolbar:
   - **Backend**: starts `TaskManagerApplication` on port 8080
   - **Backend tests**: runs all JUnit tests
   - **Frontend**: runs `npm start` (`ng serve`) on port 4200. Needs IntelliJ IDEA Ultimate or the JavaScript plugin; with Community Edition, run `npm install` and `npm start` in the built-in terminal instead.
   - **Full Stack**: starts Backend and Frontend together (Ultimate)
5. Before the first frontend run, open the terminal, `cd frontend` and run `npm install`.

## Running from the command line

Start the backend first, then the frontend, in two terminals.

### 1. Backend (port 8080)

```bash
cd backend
mvn spring-boot:run
```

The API is then available at `http://localhost:8080/api/tasks`.
The H2 console is at `http://localhost:8080/h2-console` (JDBC URL `jdbc:h2:mem:taskdb`, user `sa`, empty password).

Run the tests with:

```bash
mvn test
```

### 2. Frontend (port 4200)

```bash
cd frontend
npm install
npm start        # same as: ng serve
```

Open `http://localhost:4200`.

During development the Angular dev server proxies `/api` to `http://localhost:8080` (see `frontend/proxy.conf.json`), so the browser never makes a cross-origin call. The backend also allows CORS from `http://localhost:4200` as a fallback.

## API

| Method | Path         | Description                    | Success | Errors |
|--------|--------------|--------------------------------|---------|--------|
| POST   | `/api/tasks` | Create a task                  | 201 + task, `Location` header | 400 on invalid input |
| GET    | `/api/tasks` | List all tasks, newest first   | 200 + array | |

Create request:

```json
{ "title": "Write README", "description": "Optional details" }
```

Task response:

```json
{ "id": 1, "title": "Write README", "description": "Optional details", "createdAt": "2026-11-18T09:30:00.123Z" }
```

Validation error (e.g. empty or whitespace-only title):

```json
{
  "timestamp": "2026-11-18T09:31:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/tasks",
  "fieldErrors": { "title": "Title is required" }
}
```

Quick check with curl:

```bash
curl -i -X POST http://localhost:8080/api/tasks -H "Content-Type: application/json" -d '{"title":"First task"}'
curl http://localhost:8080/api/tasks
```

## Project structure

```
backend/src/main/java/com/example/taskmanager
├── controller/   TaskController: HTTP only, delegates to the service
├── service/      TaskService (interface) + TaskServiceImpl: business logic, transactions
├── repository/   TaskRepository: Spring Data JPA
├── entity/       Task: JPA entity (id, title, description, createdAt)
├── dto/          CreateTaskRequest, TaskResponse, ApiError: the API contract
├── mapper/       TaskMapper: entity <-> DTO conversion and input normalisation
├── exception/    GlobalExceptionHandler: consistent JSON errors
└── config/       CorsConfig

frontend/src/app
├── services/     TaskService: the only class that calls the API
├── models/       Task, CreateTaskRequest, ApiError types and field limits
├── core/         toErrorMessage(): maps HTTP failures to user-facing messages
├── components/
│   ├── task-form/  reactive form, client-side validation, save + error display
│   └── task-list/  presentational list of tasks
└── app.component   page container: loads tasks, handles load errors, adds new tasks
```

## Design notes

- **Layered backend.** Controller → service → repository, with the controller depending on the `TaskService` interface. The JPA entity never leaves the service layer; the API speaks only in DTOs.
- **Validation on both sides.** The backend is the source of truth (`@NotBlank`, `@Size` on the request DTO). The form mirrors the same rules so users get instant feedback, including rejecting whitespace-only titles.
- **Input normalisation.** Titles are trimmed, and blank descriptions are stored as `null` so "no description" has a single representation.
- **`createdAt`** is set in a JPA `@PrePersist` hook as a UTC `Instant`, so clients cannot supply or change it. The frontend formats it in the user's local time.
- **Error handling.** All failures return the same `ApiError` shape. The Angular app distinguishes "backend not reachable", validation errors (shows the server's field messages), and server errors, and offers a retry when loading the list fails.
- **Ordering.** Tasks are returned newest first, with `id` as a tie-breaker; the UI prepends newly created tasks so the list stays consistent without a refetch.

## Tests

- `TaskControllerIntegrationTest`: full HTTP → service → H2 flow (create, blank title rejected, malformed JSON, ordering).
- `TaskServiceImplTest`: service logic in isolation with a mocked repository.

## What is working

- Create a task from the form and see it appear in the list immediately.
- Tasks persist in H2 for the lifetime of the backend process.
- Backend validation with clear JSON error responses; frontend shows them inline.
- Loading, empty, and error states in the UI, including a retry button.

## What I would improve with more time

- Frontend unit tests (TaskService with `HttpTestingController`, form validation behaviour).
- Pagination for `GET /api/tasks`, plus update, delete and a "done" status.
- OpenAPI/Swagger documentation via springdoc.
- A file-based or real database (PostgreSQL) with Flyway migrations instead of `ddl-auto`.
- Docker Compose to start both apps with one command.
- An HTTP interceptor for app-wide error handling once there are more endpoints.
