# Photographer Portfolio – Backend (Phase 1: Foundation)

## What's in this phase
- Maven project (Spring Boot 3.3.4, Java 17 — matches your working I. Anwar & Associates setup)
- `application.yml` — PostgreSQL + JWT config via environment variables
- 13 JPA entities covering every table from the spec:
  Admin, Category, Photo, Gallery, ServiceItem, PackageItem, Testimonial,
  Video, Booking (with status enum), Contact, About, Faq, SocialLinks
- Auditing (`createdAt`/`updatedAt`) built into every entity via `BaseEntity`

## Before running locally
1. Install PostgreSQL, create a database:
   ```sql
   CREATE DATABASE photographer_portfolio;
   ```
2. Set environment variables (PowerShell — remember `$env:`, not `export`):
   ```powershell
   $env:DB_USERNAME="postgres"
   $env:DB_PASSWORD="your_password"
   $env:JWT_SECRET="a-long-random-string-at-least-32-chars"
   ```
3. From `/backend`: `mvn spring-boot:run`

Note: I couldn't run `mvn compile` in this sandbox (Maven Central isn't reachable from here), so please run a build locally before we move on — catch any issues now while the codebase is still small.

## Next phases
2. Repositories, Services, DTOs
3. REST Controllers + JWT Security (admin login, protected routes)
4. Image upload handling
5–7. React frontend (public pages, booking/testimonials/contact, admin dashboard)
8. Integration testing + deployment README
