# Weekly Activity Log (10 Weeks)

## Week 1
- Activity Topic: Project Setup & Scope Alignment
- Activity Log: Reviewed requirements; set up monorepo (Backend + Frontend); initialized Node/Express and React/Vite/TS; created environment templates; baseline README.

## Week 2
- Activity Topic: Data Modeling & Auth
- Activity Log: Modeled Conversation and Message schemas; implemented JWT auth (access + refresh), user routes, guards, middleware, and DB connection helper.

## Week 3
- Activity Topic: Conversation API & CRUD
- Activity Log: Built create/list/get/update/delete endpoints for conversations; added POST /conversations/:id/messages to append user and AI replies; integrated error handling utilities.

## Week 4
- Activity Topic: AI Integration (Ollama) & Prompting
- Activity Log: Implemented ollama.service with conversation history; defined strict prompt contract; added tolerant JSON/Mermaid parsing; exposed guest AI endpoint.

## Week 5
- Activity Topic: Frontend Migration to Conversations
- Activity Log: Implemented conversation sidebar and chat page; created React Query hooks; added optimistic updates and navigation for new chats.

## Week 6
- Activity Topic: Guest Mode & Auth Robustness
- Activity Log: Added guest flow without DB persistence; gated Axios refresh by isAuthenticated; cleared caches on logout; refined route guards.

## Week 7
- Activity Topic: Validation, Indexing, and Cleanup
- Activity Log: Applied role-based schema validation; added MongoDB indexes; removed deprecated POST /queries; improved empty-state responses.

## Week 8
- Activity Topic: UI Polish & Error Handling
- Activity Log: Enhanced optimistic UI; added toasts and loading states; improved Mermaid parsing resilience; refined layout.

## Week 9
- Activity Topic: Documentation & Testing
- Activity Log: Expanded README (setup, API, troubleshooting); prepared Postman checklist; smoke-tested end-to-end flows.

## Week 10
- Activity Topic: Hardening & Future Enhancements
- Activity Log: Reviewed security and CORS; proposed rate limiting; drafted export/rename features; identified load-testing needs.
