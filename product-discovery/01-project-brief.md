# Project Brief

## Project Name

Working name: `TrackFlow`

## Executive Summary

TrackFlow is a modular tracking platform designed to help users manage and follow personal processes across different domains from a single workspace.

The first concept comes from a job application tracker, but the new platform must support many domain templates such as job search, real estate search, shopping, and any future domain the user may want to create through controlled customization rules.

The product will provide a shared platform with:

- a personal workspace
- separated modules with a shared architecture
- configurable templates
- customizable statuses and fields with restrictions
- audit history and event-driven tracking
- future support for analytics, statistics, and multi-user usage

This project will be built as a new product from scratch. The current job tracking system will remain unchanged and may be used later as a source for data export and import.

## Problem Statement

Today, personal tracking needs are usually managed in isolated ways:

- spreadsheets
- notes
- domain-specific apps
- manual reminders
- disconnected records

This creates several problems:

- information is fragmented
- tracking is inconsistent
- workflows cannot be reused across domains
- history is hard to audit
- reporting is limited
- the system cannot evolve easily into a reusable platform

The current job tracking application solves one specific use case, but its model is strongly tied to the recruitment domain. That makes it difficult to reuse the same product structure for other types of personal tracking processes.

## Current Context

There is an existing workspace with multiple projects that currently support a job tracking solution:

- frontend application
- backend application
- event consumer service
- Mongo-based notes service

The current solution already includes valuable ideas:

- modular separation
- event publishing
- audit/event consumption
- notes and side documents
- Docker-based local environments
- partial Kubernetes support

However, the current business model is centered on job applications and related entities such as company, position, interview, and job offer.

## Opportunity

There is an opportunity to create a new platform that keeps the useful architectural ideas from the current solution while redesigning the business model into a more generic and reusable system.

This platform can support:

- job application tracking
- real estate search tracking
- shopping and purchase tracking
- future process templates created from controlled patterns
- additional domains such as car search, used item tracking, e-commerce environment monitoring, purchase follow-up, and other user-defined cases

The long-term value is not only personal productivity, but also the creation of a reusable product platform with configurable modules and templates.

## Main Goal

Build a new modular tracking platform from scratch that allows one user to manage different personal tracking domains from a single workspace, using configurable templates, controlled customization, audit history, and event-driven architecture.

## Secondary Goals

- Keep the design ready for future multi-user support
- Allow shared contacts or actors across modules
- Support template-based domain creation
- Allow controlled custom fields and configurable statuses
- Enable future reporting and analytics
- Support future export and import of templates
- Preserve the option to import historical data from the current job tracking system

## Target Users

### Primary User

A personal user who wants to organize and track ongoing processes across any domain they need, including but not limited to jobs, property search, shopping, car search, used item tracking, e-commerce follow-up, and other custom scenarios supported by the platform.

### Future Users

- users with multiple workspaces
- small teams or households
- users who want to share templates
- users who need better analytics and historical reporting

## Product Scope Overview

The new product should provide:

- one personal workspace as the main container
- multiple modules inside the same workspace
- one mandatory main entity per module
- shared contacts or actors across modules
- configurable but controlled templates
- configurable statuses with global defaults and user customization
- controlled dynamic fields
- notes and event history
- analytics-ready design
- support for new user-defined domains built from restricted template rules

## Out of Scope for This Initial Initiative

The first initiative does not aim to include:

- direct modification of the current job tracking system
- full multi-user support from day one
- file attachments in the first phase
- reminders and tasks in the first phase
- unrestricted no-code domain creation without rules

## Initial Success Criteria

This initiative will be considered successful in its early stage if it achieves the following:

- a clear and validated product vision
- a reusable domain model for multiple modules
- an architecture ready for separated services
- one first implementation path for a new platform
- a migration/import strategy from the current job tracking system
- a design that supports future reporting and scaling

## Initial Risks

- making the platform too generic and hard to use
- creating too much flexibility without enough restrictions
- overengineering microservices before defining domain boundaries
- losing useful lessons from the current system
- making reporting difficult if the core model is too abstract
- increasing complexity too early with customization features

## Assumptions

- the product starts as a personal platform
- the architecture should still be ready for future multi-user support
- modules should have their own user experience, even if the backend is shared
- event-driven auditing remains an important part of the platform
- templates should be reusable, configurable, eventually exportable, and flexible enough to support many user-defined domains without becoming fully unrestricted
- the current job tracker remains as a separate legacy source

## Project Status

Current status: discovery and definition phase.

This document is the starting point for product definition before detailed domain modeling, architecture design, and implementation planning.
