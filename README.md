# SmartFit — AI-powered fitness microservices platform

This repository extends the original Spring Boot fitness microservices project while preserving its architecture. The implementation is an incremental foundation, not a claim that every feature in the full SRS is already complete.

## What's added in this upgrade

- Fitness profile fields, goals/preferences and backend privacy settings in User Service.
- Password handling hardened: Keycloak remains the identity provider; the User Service no longer stores or returns passwords.
- Gateway identity propagation now derives `X-User-ID` from the authenticated Keycloak principal and overwrites client-supplied values.
- Activity distance and explicit `PRIVATE` / `PUBLIC` visibility. New activities default to private.
- Ownership checks for viewing private activities and deleting activities.
- Community Service for public feed aggregation, likes, comments and follow/unfollow.
- Python ML Service with a Random Forest training/prediction pipeline. It refuses predictions until a real, validated training dataset is supplied and the model is trained.
- React pages for Community, Fitness Profile/Privacy and ML Coach.
- Dockerfiles and a local Docker Compose environment.

## Architecture

```text
React + Vite
   |
   v
Spring Cloud API Gateway -- OAuth2/JWT (Keycloak)
   |
   +--> User Service -------- PostgreSQL
   +--> Activity Service ---- MongoDB ---- RabbitMQ ----> AI Service
   +--> Community Service --- MongoDB       |
   +--> ML Service ---------- FastAPI / scikit-learn
   |
Eureka + Spring Cloud Config
```

Services:
- `gateway` — authenticated API entry point and JWT identity propagation.
- `eureka` — service discovery.
- `configServer` — centralized configuration.
- `user-service` — account profile and fitness/privacy settings.
- `activity-service` — private/public activity tracking.
- `ai-service` — existing Gemini-backed activity recommendations.
- `community-service` — public feed, likes, comments and follows.
- `ml-service` — Python model training and prediction API.
- `fitness-app-frontend` — React user interface.

## Run locally with Docker

1. Install Docker Desktop / Docker Engine with Compose.
2. Copy `.env.example` to `.env` and change all development credentials.
3. Start the stack:

```bash
docker compose up --build
```

4. Open:
   - Frontend: http://localhost:3000
   - API Gateway: http://localhost:8080
   - Eureka: http://localhost:8761
   - Config Server: http://localhost:8888
   - Keycloak admin: http://localhost:8181 (development admin credentials from `.env`)
   - RabbitMQ management: http://localhost:15672
   - ML API docs: http://localhost:8090/docs

The compose file imports a development Keycloak realm at `infrastructure/keycloak/realm-import/fitness-oauth2-realm.json`. Create a test user in that realm through the Keycloak admin console. This realm is for local development only; configure proper production clients, redirect URIs, secrets, HTTPS and user provisioning before deployment.

For local Vite development outside Docker:

```bash
cd fitness-app-frontend
npm ci
npm run dev
```

The default OAuth redirect is `http://localhost:5173`. The API is served through `http://localhost:8080`.

## ML training workflow

The ML service intentionally does not fabricate predictions. Add a consented and de-identified `fitness_training.csv` under `ml-service/app/data/` with these columns:

```text
age,weight,fitnessLevel,goal,weeklyWorkouts,averageDuration,averageCalories,recommendedActivity
```

Use at least 30 complete rows and at least two activity classes. Then:

```bash
curl -X POST http://localhost:8090/train \\
  -H "X-ML-Training-Token: $ML_TRAINING_TOKEN"
curl -X POST http://localhost:8090/api/ml/recommend \
  -H "Content-Type: application/json" \
  -d '{"age":22,"weight":70,"fitnessLevel":"BEGINNER","goal":"GENERAL_FITNESS","weeklyWorkouts":3,"averageDuration":30,"averageCalories":200}'
```

Training evaluates a held-out test split and reports accuracy and weighted F1. These metrics are not proof of clinical validity; use representative, consented data and monitor for bias before real-world use.

## Main API endpoints

All browser API calls should go through the gateway (`http://localhost:8080`).

| Feature | Method | Endpoint |
|---|---|---|
| My profile | GET | `/api/users/me` |
| Update fitness/privacy profile | PUT | `/api/users/me/fitness-profile` |
| Create activity | POST | `/api/activities` |
| My activities | GET | `/api/activities` |
| Public activities | GET | `/api/activities/public` |
| Activity detail | GET | `/api/activities/{id}` |
| Delete own activity | DELETE | `/api/activities/{id}` |
| Community feed | GET | `/api/community/feed` |
| Like activity | POST | `/api/community/activities/{id}/like` |
| Unlike activity | DELETE | `/api/community/activities/{id}/like` |
| Comment | POST | `/api/community/activities/{id}/comments` |
| Follow user | POST | `/api/community/follow/{userId}` |
| ML prediction | POST | `/api/ml/recommend` |

Activity create body example:

```json
{
  "type": "RUNNING",
  "duration": 30,
  "caloriesBurned": 250,
  "distanceKm": 4.2,
  "visibility": "PRIVATE",
  "startTime": "2026-11-04T08:00:00",
  "additionalMetrics": {}
}
```

`visibility` accepts `PRIVATE` or `PUBLIC`; any omitted/unknown value is stored as private. A user must first enable public activity sharing in their profile and then explicitly select Public for each workout. The backend public feed queries only public records. Public calorie values are omitted in this iteration.

## Security and privacy notes

- Keycloak authenticates users. The gateway obtains the user subject from Spring Security's authenticated JWT principal and overwrites the `X-User-ID` header before forwarding.
- Never trust `X-User-ID` supplied by a browser or direct client.
- Private activities are returned only to their owner; deletion is owner-only.
- Public activity feed includes only records with `visibility=PUBLIC`.
- Fitness profile fields are private unless explicitly configured.
- The legacy password database column remains nullable for compatibility with existing schema; new code clears it during profile sync and does not return it. For an existing deployment, review and securely migrate/delete any old stored password values.
- The compose credentials are local development defaults only. Do not expose this compose setup directly to the public internet.
- AI/ML output is general fitness guidance, not medical advice.

## Verification

Run frontend checks:

```bash
cd fitness-app-frontend
npm ci
npm run lint
npm run build
```

Run Java tests from each Spring service folder:

```bash
./mvnw test
```

Run ML tests:

```bash
cd ml-service
pip install -r requirements-dev.txt
pytest
```

A full cloud deployment, production-grade observability, complete nutrition/gamification/challenges/notifications/admin moderation, feed pagination, and full security/integration test coverage remain future implementation phases. The uploaded SRS remains the target specification for those phases.
