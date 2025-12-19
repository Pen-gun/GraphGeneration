# 3.3 Description of Project Involved in Internship

During the internship, the primary objective was to build a robust full-stack **"GraphGeneration - AI-Powered Learning Assistant"** that facilitated intelligent, conversational learning experiences with automated diagram generation. The platform enables users to engage in ChatGPT-like multi-turn conversations, receive educational content with interactive Mermaid diagrams, and manage their learning history through organized conversations.

The system was developed using the **MERN stack**, with React and TypeScript on the frontend, Node.js and Express on the backend, and MongoDB for data storage. For efficient state and data handling, **TanStack Query (React Query)** was employed for server state management and caching, while Axios simplified frontend API integration and asynchronous data fetching. AI integration was achieved through **Ollama** (local LLM) with optional HuggingFace API support.

## System Interfaces

The system has 2 different interfaces:

### User Portal (Authenticated Mode)
- For registered users to create conversations, ask questions, and receive AI-generated content.
- Save conversation history with full context across multiple messages.
- Manage conversations (view, rename, delete).
- Access past conversations with complete message history.

### Guest Mode (Unauthenticated)
- For visitors to try the AI assistant without registration.
- Generate educational content and diagrams instantly.
- No data persistence - focuses on demonstration and immediate value.
## Key Features

Some of the additional features are:
- **Conversational AI with Context Awareness**: Multi-turn conversations where the AI maintains context across messages for coherent, progressive learning.
- **Automatic Mermaid Diagram Generation**: AI generates structured diagrams (flowcharts, mind maps, sequence diagrams) for visual learning.
- **Structured Educational Content**: Every response includes 6 beginner-friendly bullet points explaining the topic.
- **JWT-based Authentication**: Secure access and refresh token implementation with httpOnly cookies.
- **Guest Mode**: Try the system without signup - AI responses without database persistence.
- **Optimistic UI Updates**: Instant feedback with React Query mutations for smooth user experience.
- **Role-based Message System**: User and assistant messages tracked separately with conversation threading.

## System Design

### MongoDB Schema Design: Collections

Collections were designed with Mongoose using a mix of embedded documents and references to ensure both scalability and proper data relationships. While MongoDB is inherently schema-less, Mongoose was implemented to provide a structured and consistent schema on the backend. This approach not only improved data integrity but also made the API responses more predictable and easier to work with during development. It ensured smooth integration between different parts of the application, especially when handling complex nested data or populating related conversation messages.

---

### Collection 1: Users
**Purpose**: Stores user authentication and profile information.

**Fields**:
- `_id`: ObjectId (Primary Key)
- `username`: String, unique, indexed (for fast login lookups)
- `email`: String, unique, lowercase
- `fullName`: String, indexed (for search)
- `avatar`: String (optional profile image URL)
- `password`: String (bcrypt hashed)
- `refreshToken`: String (JWT refresh token)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

**Indexes**:
- `username` (unique, index)
- `email` (unique)
- `fullName` (index)

**Methods**:
- `isPasswordCorrect(password)`: Compares hashed password
- `generateAccessToken()`: Issues JWT access token (1 day expiry)
- `generateRefreshToken()`: Issues JWT refresh token (7 day expiry)

**Pre-save Hook**:
- Automatically hashes password using bcrypt (10 salt rounds) before saving

---

### Collection 2: Conversations
**Purpose**: Groups related messages into organized conversation threads with metadata.

**Fields**:
- `_id`: ObjectId (Primary Key)
- `owner`: ObjectId (References `User._id`)
- `title`: String (max 200 chars, default "New Conversation")
- `messages`: Array of ObjectId (References `Query._id`)
- `lastMessage`: Date (timestamp of most recent message)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

**Indexes**:
- `{owner: 1, lastMessage: -1}`: Optimized for fetching user's conversations sorted by recency

**Relationships**:
- **One-to-Many** with User (one user owns many conversations)
- **One-to-Many** with Query (one conversation contains many messages)

**Cascade Behavior**:
- Deleting a conversation also deletes all associated messages (Query documents)

---

### Collection 3: Queries (Messages)
**Purpose**: Stores individual messages (user questions and AI responses) within conversations.

**Fields**:
- `_id`: ObjectId (Primary Key)
- `conversationId`: ObjectId (References `Conversation._id`)
- `owner`: ObjectId (References `User._id`)
- `topic`: String (user's question or AI's response topic)
- `points`: Array of Strings (6 educational bullet points - required for assistant messages)
- `diagram`: String (Mermaid diagram code - required for assistant messages)
- `role`: String, enum: [`user`, `assistant`]
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

**Indexes**:
- `{conversationId: 1, createdAt: 1}`: Optimized for chronological message retrieval
- `{owner: 1}`: Fast lookup of all user messages

**Role-based Validation**:
- **User messages**: Only `topic` required (the question)
- **Assistant messages**: Requires `topic`, `points` array, and `diagram` (AI-generated content)

**Relationships**:
- **Many-to-One** with Conversation (many messages belong to one conversation)
- **Many-to-One** with User (many messages owned by one user)

---

## Schema Relationships Diagram

```
┌─────────────────┐
│     Users       │
│  (Collection)   │
│─────────────────│
│ _id (PK)        │
│ username        │◄─────────┐
│ email           │          │
│ fullName        │          │ owner (FK)
│ password        │          │
│ refreshToken    │          │
└─────────────────┘          │
                             │
                             │
                    ┌────────┴────────┐
                    │  Conversations  │
                    │  (Collection)   │
                    │─────────────────│
                    │ _id (PK)        │◄─────────┐
                    │ owner (FK)      │          │
                    │ title           │          │
                    │ messages[]      │          │ conversationId (FK)
                    │ lastMessage     │          │
                    └─────────────────┘          │
                                                 │
                                                 │
                                        ┌────────┴────────┐
                                        │ Queries/Messages│
                                        │  (Collection)   │
                                        │─────────────────│
                                        │ _id (PK)        │
                                        │ conversationId  │
                                        │ owner (FK)      │
                                        │ topic           │
                                        │ points[]        │
                                        │ diagram         │
                                        │ role            │
                                        └─────────────────┘
```

---

## Data Flow Example

### Scenario: User asks "Explain React hooks"

1. **Frontend** sends POST request to `/api/v1/conversations/:id/messages` with `{topic: "Explain React hooks"}`

2. **Backend Controller**:
   - Validates user ownership of conversation
   - Builds conversation history from existing messages
   - Creates user message document (role: "user", topic: "Explain React hooks")

3. **AI Service**:
   - Receives conversation history + new question
   - Calls Ollama LLM with structured prompt
   - Returns JSON with:
     - `points`: 6 educational bullet points
     - `diagram`: Mermaid flowchart code
     - `reasoning`: AI's thought process

4. **Backend Controller**:
   - Creates assistant message document (role: "assistant", points, diagram)
   - Updates conversation's `messages` array and `lastMessage` timestamp
   - Returns both user and assistant messages to frontend

5. **Frontend**:
   - Optimistically displays user message
   - Receives assistant response and renders:
     - Bullet points in styled list
     - Mermaid diagram as interactive SVG

---

## Performance Optimizations

### Database Indexes
- **User lookups**: `username` and `email` indexed for fast authentication
- **Conversation listings**: Compound index on `{owner, lastMessage}` for sorted user conversations
- **Message retrieval**: Compound index on `{conversationId, createdAt}` for chronological ordering

### Frontend Caching
- React Query caches conversation lists and individual conversation details
- Stale-while-revalidate strategy for instant UI with background updates
- Cache invalidation on mutations (create, update, delete)

### Schema Design Decisions
- **Separated Messages**: Queries stored as separate documents (not embedded) to support:
  - Efficient pagination for long conversations
  - Independent message operations
  - Flexible future features (message editing, reactions)
- **Reference vs. Embed**: Conversations reference messages instead of embedding to:
  - Avoid 16MB document size limits
  - Enable faster conversation metadata queries
  - Support concurrent message additions

---

This schema design ensures scalability, maintainability, and optimal performance for the conversational AI learning platform.
