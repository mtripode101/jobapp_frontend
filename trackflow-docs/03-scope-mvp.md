# MVP Scope

## MVP Goal

The MVP of TrackFlow is meant to validate the new platform design through one real module while keeping the product architecture generic, reusable, and simple.

The first implementation is not intended to solve every planned domain. Its purpose is to prove that the platform core, template-based model, audit logic, event model, and controlled customization approach can support future modules with the same foundation.

## MVP Strategy

The MVP will include:

- one initial workspace already created
- one first operational module: `job search`
- system-defined templates
- limited personalization
- shared platform concepts designed for future domain expansion

This means the MVP validates the platform by using `job search` as the first template-driven module, not as the permanent center of the product.

## Included Scope

### Platform Base

The MVP includes the minimum platform foundation required to support template-based modules:

- one personal workspace
- one active module instance based on a system template
- template-driven entity structure
- template-driven allowed operations
- controlled statuses
- notes
- event generation
- audit logging
- soft delete
- timestamps
- user-readable identifiers

### Initial Domain Module

The first domain module included in the MVP is:

- `job search`

This module exists as the first validation template of the platform.

### Included Entities in the Initial Template

The `job search` MVP template includes:

- applications
- companies
- positions
- interviews
- offers
- notes

These entities are not meant to define the final product structure for every domain. They are the first concrete implementation of the generic platform model.

## Core MVP Rules

The MVP should follow these rules:

- the workspace is assumed to already exist
- there is no login in the first version
- the platform must still be designed for future authentication and multi-user support
- the user sees a modular navigation structure from the start
- only one active instance of the `job search` template is needed in the first version
- modules are independent from each other at business level
- notes belong to the platform core, not only to one module

## Template-Driven Operations

The MVP must already validate that operations are defined by template behavior, not by hardcoded module logic.

The platform core should support shared capabilities such as:

- create
- edit
- list
- view detail
- change status
- add note
- register related activity
- emit event
- audit action

The `job search` template will define which operations are enabled for each relevant record type in the MVP.

Those operations may still be fixed in this first version, but they should already exist as template-defined behavior.

## Functional Scope

### Included Functional Capabilities

The MVP includes:

- essential CRUD operations for the records included in the `job search` template
- manual status changes
- note registration
- related activity tracking
- audit trail generation
- business event generation
- controlled import from a prepared source
- basic platform-level statistics

### Statistics Scope

The MVP should include simple and generic statistics, designed to be reusable later across other modules.

Examples:

- total records
- records by status
- recent activity
- timeline-based counts
- created versus updated records in a period

The purpose of MVP statistics is to validate the analytics-ready design, not to build a full BI layer.

### AI Scope in the MVP

AI is optional and assistive in the MVP.

It should not be responsible for core calculations or for mandatory business logic.

Possible MVP-level AI usage:

- summarize activity
- explain simple trends
- help interpret generic statistics
- support future template thinking

AI is not required for the platform to work in the MVP.

## Import Scope

The MVP includes a controlled import approach from a prepared source related to the current job tracking system.

The purpose of this import is to validate:

- migration feasibility
- mapping quality
- template compatibility
- design assumptions of the new model

The MVP does not require a fully automated production migration process yet.

## Out of Scope for the MVP

The following items are outside the MVP scope:

- full multi-user support
- authentication and authorization
- unrestricted user-created templates
- unrestricted dynamic field creation
- unrestricted workflow editing
- more than one production-ready domain module
- file attachments
- reminders and tasks
- advanced reporting
- cross-module business relations
- complex template marketplace flows
- advanced AI automation

## Controlled Personalization Scope

The MVP allows limited personalization through system templates.

This may include:

- visible concept renaming
- limited status customization
- limited field customization

The MVP does not include fully open-ended template creation by end users.

## Acceptance Criteria at High Level

The MVP will be considered valid if it can demonstrate that:

- the platform supports one workspace with one real module
- the module behavior is driven by template structure
- the core model supports main and related records
- statuses, notes, events, and audit logs work together
- soft delete and timestamps are part of the model
- the import flow can map prepared legacy data into the new structure
- basic statistics can be generated from the new model
- the architecture remains ready for future modules and future users

## MVP Risks

- making the first module too close to the legacy system
- adding too much flexibility too early
- building template metadata that is too weak for future domains
- building template metadata that is too complex for the MVP
- introducing AI before the core platform model is stable
- confusing platform capabilities with module-specific behavior

## MVP Design Intention

The MVP should be simple, reusable, and honest.

It should prove that the product can evolve from a single validated template into a real multi-domain platform without forcing a redesign of the core model later.
