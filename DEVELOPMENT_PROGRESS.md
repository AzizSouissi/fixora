# Fixora Development Progress Playbook

This file is the working plan for delivery progress, feature branches, AI prompts per step, and release tags.

## 1. Branch Naming Standard

Use feature-first branch names:

- feature/auth-multi-tenant-login
- feature/jobs-create-update-flow
- feature/calendar-dispatch-board
- feature/invoices-payments-core
- feature/mobile-tech-checklist
- feature/notifications-sms-email
- feature/analytics-kpi-dashboard
- feature/devops-cicd-hardening

Supporting branch types:

- fix/<area>-<short-description>
- chore/<area>-<short-description>
- refactor/<area>-<short-description>
- docs/<area>-<short-description>

## 2. Delivery Roadmap (Progress Tracker)

Status legend: [ ] not started, [~] in progress, [x] done.

| Status | Phase                 | Branch Name                     | Outcome                                             |
| ------ | --------------------- | ------------------------------- | --------------------------------------------------- |
| [ ]    | Foundation hardening  | feature/devops-cicd-hardening   | CI stable, lint/typecheck/build/test gates enforced |
| [ ]    | Auth + tenant model   | feature/auth-multi-tenant-login | Role-based auth, tenant isolation, secure sessions  |
| [ ]    | Customer + job flow   | feature/jobs-create-update-flow | Customer CRUD, job lifecycle, assignment flow       |
| [ ]    | Dispatch calendar     | feature/calendar-dispatch-board | Drag-drop scheduling and technician dispatch board  |
| [ ]    | Invoicing + payments  | feature/invoices-payments-core  | Estimates, invoices, payment tracking               |
| [ ]    | Mobile field workflow | feature/mobile-tech-checklist   | On-site job view, checklist, notes, status updates  |
| [ ]    | Notifications         | feature/notifications-sms-email | Email/SMS reminders and status notifications        |
| [ ]    | Analytics             | feature/analytics-kpi-dashboard | Revenue, conversion, completion KPI dashboards      |
| [ ]    | Release candidate     | chore/release-v1-prep           | Changelog, docs, migration checks, performance pass |

## 3. Prompt Pack For Each Step

Use these prompts when starting each branch.

### 3.1 Foundation Hardening

Prompt:

Improve CI and delivery safety for this monorepo. Keep existing architecture. Add caching optimization, branch protections checklist, dependency update policy, and quality gates for web, api, and shared packages. Output changes and run validation commands.

### 3.2 Auth + Tenant Model

Prompt:

Implement production-ready authentication and tenant isolation in the NestJS API and connect the web login flow. Include JWT/session strategy, refresh token handling, role guards, tenant scoping on data access, and tests for auth and authorization paths.

### 3.3 Customer + Job Flow

Prompt:

Create customer management and job lifecycle modules end-to-end. Include API endpoints, DTO validation, shared types, web screens for create/edit/list, and status transitions (new, scheduled, in_progress, completed, cancelled). Add tests for core lifecycle transitions.

### 3.4 Dispatch Calendar

Prompt:

Build a dispatch board in web for scheduling jobs by technician and time slot. Include drag-drop scheduling UX, conflict checks, API integration, and optimistic updates with rollback on error. Keep components reusable in packages/ui where possible.

### 3.5 Invoicing + Payments

Prompt:

Implement estimate and invoice domain logic with line items, tax, discounts, and payment status tracking. Add web workflows for draft, sent, paid, overdue, and API tests for amount calculations and status transitions.

### 3.6 Mobile Field Workflow

Prompt:

Implement mobile technician workflows in Expo: assigned jobs list, job details, checklist completion, notes, and photo placeholders. Integrate with API and shared types. Prioritize offline-safe UX patterns for intermittent connectivity.

### 3.7 Notifications

Prompt:

Add notification orchestration for job reminders and status changes with provider abstraction (email and SMS). Include templates, retries, failure logging, and idempotency safeguards.

### 3.8 Analytics

Prompt:

Add analytics endpoints and dashboard views for key SaaS metrics: MRR proxy, jobs completed, average ticket size, technician utilization, and conversion funnel. Include clear query boundaries and performant aggregations.

### 3.9 Release Prep

Prompt:

Prepare release candidate: run full quality gates, verify Docker build and startup, update documentation, produce changelog summary from merged branches, and list any migration or rollback instructions.

## 4. Tagging Strategy (When To Tag)

Create tags only from main after CI is green.

### 4.1 Milestone Tags

Use milestone tags at the end of each major phase group:

- m1-foundation
- m2-auth-jobs
- m3-dispatch-invoicing
- m4-mobile-notifications
- m5-analytics-release

When to tag:

- After phase merge to main
- After smoke checks pass locally and in CI
- After docs/changelog update for that milestone

### 4.2 Release Tags (Semantic Versioning)

Use semantic release tags:

- v0.1.0 for first usable internal release
- v0.2.0 for major feature expansion
- v1.0.0 for production launch

Tag rules:

- Patch: vX.Y.Z for bug-only release
- Minor: vX.Y.0 for backward-compatible features
- Major: vX.0.0 for breaking changes

## 5. Practical Git Flow

1. Create branch from main using feature naming.
2. Implement with small commits and passing checks.
3. Open PR to main with scope, test evidence, and risk notes.
4. Merge after review and green CI.
5. Add milestone tag if phase completion criteria are met.
6. Add semantic release tag when a releasable increment is ready.

## 6. Progress Log Template

Copy this block for each completed branch:

### Branch: <branch-name>

- Date merged:
- Scope delivered:
- Validation run:
- Risks left:
- Tag created:
