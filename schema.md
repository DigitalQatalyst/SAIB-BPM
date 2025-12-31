# SAIB-BPM Database Schema

## Overview
This document defines the Supabase/Postgres database schema for the SAIB Business Process Management system. The system manages policies, procedures, documents, service requests, and collaborative workflows.

## Table of Contents
- [Core Tables](#core-tables)
- [Relationships](#relationships)
- [Indexes](#indexes)
- [RLS Policies](#row-level-security-policies)
- [Functions & Triggers](#functions--triggers)

---

## Core Tables

### 1. users

User authentication, authorization, and team management.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'pp_team', 'approver', 'admin')),
  department VARCHAR(255),
  phone VARCHAR(50),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  avatar_url TEXT,
  permissions TEXT[] DEFAULT ARRAY['view'],
  is_authenticated BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_department ON users(department);
```

**Roles:**
- `user` - Standard user who can create requests
- `pp_team` - Policies & Procedures team member
- `approver` - Can approve documents
- `admin` - Full system access

**Permissions:** `['view', 'edit', 'approve', 'admin']`

---

### 2. services

Catalog of available services for policy/procedure requests.

```sql
CREATE TABLE services (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  category VARCHAR(100) NOT NULL,
  department VARCHAR(255) DEFAULT 'All',
  priority VARCHAR(20) DEFAULT 'Medium' CHECK (priority IN ('High', 'Medium', 'Low')),
  complexity VARCHAR(20) DEFAULT 'Low' CHECK (complexity IN ('High', 'Medium', 'Low')),
  response_sla INT DEFAULT 48, -- hours
  resolution_sla INT DEFAULT 14, -- days
  delivery_sla INT DEFAULT 14, -- days
  domain VARCHAR(255),
  audience TEXT[],
  tags TEXT[],
  use_cases JSONB,
  process_steps JSONB,
  escalation_tiers JSONB,
  requestors TEXT,
  required_info TEXT,
  faqs JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_department ON services(department);
CREATE INDEX idx_services_priority ON services(priority);
```

**JSONB Structures:**

**use_cases:**
```json
["Use case 1", "Use case 2"]
```

**process_steps:**
```json
["Step 1: Description", "Step 2: Description"]
```

**escalation_tiers:**
```json
[
  {"level": 1, "title": "L1 Support", "sla": 24},
  {"level": 2, "title": "L2 Manager", "sla": 48}
]
```

**faqs:**
```json
[
  {"question": "Q?", "answer": "A"}
]
```

---

### 3. requests

Track user requests for policies, procedures, and documents.

```sql
CREATE TABLE requests (
  id SERIAL PRIMARY KEY,
  ticket_number VARCHAR(50) UNIQUE NOT NULL,
  date_created DATE NOT NULL DEFAULT CURRENT_DATE,
  request_type VARCHAR(100) NOT NULL,
  request_detail TEXT NOT NULL,
  service_name VARCHAR(500),
  service_category VARCHAR(100),
  sla_target_date DATE NOT NULL,
  priority VARCHAR(20) NOT NULL CHECK (priority IN ('High', 'Medium', 'Low')),
  status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Approved', 'Completed', 'Rejected')),
  latest_note TEXT,
  requester VARCHAR(255) NOT NULL,
  requester_email VARCHAR(255) NOT NULL,
  department VARCHAR(255),
  assigned_to VARCHAR(255),
  full_description TEXT,
  document_id VARCHAR(100),
  approval_status VARCHAR(50) CHECK (approval_status IN ('Not Started', 'In Review', 'Changes Requested', 'Approved')),
  approver_comments JSONB DEFAULT '[]',
  qualifying_questions JSONB,
  impact_questions JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_requests_ticket_number ON requests(ticket_number);
CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_requests_requester_email ON requests(requester_email);
CREATE INDEX idx_requests_assigned_to ON requests(assigned_to);
CREATE INDEX idx_requests_date_created ON requests(date_created);
CREATE INDEX idx_requests_priority ON requests(priority);
```

**Ticket Number Format:** `REQ-YYYY-XXX` (e.g., REQ-2025-001)

**SLA Calculation:**
- High priority: 3 business days
- Medium priority: 7 business days
- Low priority: 10 business days

**JSONB Structures:**

**approver_comments:**
```json
[
  {
    "approver": "John Doe",
    "comment": "Needs revision",
    "date": "2025-01-15T10:30:00Z"
  }
]
```

**qualifying_questions:**
```json
[
  {"id": "q1", "question": "Is this a major change?", "checked": true}
]
```

**impact_questions:**
```json
[
  {
    "id": "i1",
    "question": "Does this affect employees?",
    "checked": true,
    "assignedStakeholder": "HR Department"
  }
]
```

---

### 4. documents

Policy/procedure documents with content and metadata.

```sql
CREATE TABLE documents (
  id VARCHAR(100) PRIMARY KEY,
  request_id INT REFERENCES requests(id) ON DELETE SET NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  content TEXT, -- Markdown format
  category VARCHAR(100),
  department VARCHAR(255),
  type VARCHAR(50), -- 'Policy' | 'Procedure' | 'Manual'
  version VARCHAR(20),
  status VARCHAR(50) DEFAULT 'Draft',
  language VARCHAR(50) DEFAULT 'English',
  last_updated DATE,
  created_by VARCHAR(255) NOT NULL,
  approved_by VARCHAR(255),
  approval_date DATE,
  effective_date DATE,
  next_review_date DATE,
  current_approval_level INT DEFAULT 0 CHECK (current_approval_level BETWEEN 0 AND 3),
  document_link TEXT,
  document_url TEXT,
  tags TEXT[],
  sections JSONB,
  related_documents JSONB,
  references TEXT[],
  approvers JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_documents_request_id ON documents(request_id);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_created_by ON documents(created_by);
CREATE INDEX idx_documents_category ON documents(category);
CREATE INDEX idx_documents_type ON documents(type);
CREATE INDEX idx_documents_effective_date ON documents(effective_date);
```

**Status Workflow:**
1. Draft
2. In Review (Level 1)
3. In Review (Level 2)
4. In Review (Level 3)
5. Approved for Publication
6. Published / Active

**JSONB Structures:**

**sections:**
```json
[
  {"title": "Introduction", "content": "Content here..."},
  {"title": "Scope", "content": "Content here..."}
]
```

**related_documents:**
```json
[
  {"id": "DOC-123", "title": "Related Policy", "type": "Policy"}
]
```

**approvers:**
```json
[
  {
    "name": "Jane Smith",
    "role": "Department Head",
    "email": "jane@saib.com",
    "level": 1,
    "status": "Approved",
    "date": "2025-01-15",
    "comments": "Looks good"
  }
]
```

---

### 5. document_comments

Collaboration and feedback on documents.

```sql
CREATE TABLE document_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id VARCHAR(100) NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author VARCHAR(255) NOT NULL,
  author_email VARCHAR(255),
  resolved BOOLEAN DEFAULT false,
  parent_id UUID REFERENCES document_comments(id) ON DELETE CASCADE,
  selection JSONB, -- For inline comments
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_comments_document_id ON document_comments(document_id);
CREATE INDEX idx_comments_author ON document_comments(author);
CREATE INDEX idx_comments_parent_id ON document_comments(parent_id);
CREATE INDEX idx_comments_resolved ON document_comments(resolved);
```

**Features:**
- Threaded comments via `parent_id`
- Inline comments via `selection` JSONB
- Mark comments as resolved

**selection JSONB:**
```json
{
  "start": 150,
  "end": 200,
  "text": "selected text for context"
}
```

---

### 6. document_versions

Track document revision history.

```sql
CREATE TABLE document_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id VARCHAR(100) NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_by VARCHAR(255) NOT NULL,
  version_number INT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_versions_document_id ON document_versions(document_id);
CREATE INDEX idx_versions_version_number ON document_versions(document_id, version_number);
CREATE UNIQUE INDEX idx_unique_version_per_doc ON document_versions(document_id, version_number);
```

**Version Numbering:**
- Auto-increments per document
- Snapshot created on each significant change
- Immutable after creation

---

### 7. shared_documents

Document sharing and access control.

```sql
CREATE TABLE shared_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  original_document_id VARCHAR(100) NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  share_link TEXT UNIQUE NOT NULL,
  access_level VARCHAR(20) NOT NULL CHECK (access_level IN ('view', 'comment', 'edit')),
  allowed_users TEXT[], -- Email addresses
  password_hash TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_shared_docs_document_id ON shared_documents(original_document_id);
CREATE INDEX idx_shared_docs_share_link ON shared_documents(share_link);
```

**Access Levels:**
- `view` - Read-only access
- `comment` - Can add comments
- `edit` - Full editing (if document status allows)

---

### 8. favorites

User bookmarks for quick access to documents and services.

```sql
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id INT NOT NULL,
  item_type VARCHAR(50) NOT NULL CHECK (item_type IN ('document', 'policy', 'procedure', 'service', 'regulation', 'process')),
  title VARCHAR(500),
  description TEXT,
  link TEXT,
  date_added DATE DEFAULT CURRENT_DATE,
  last_viewed DATE,
  UNIQUE(user_id, item_id, item_type)
);

CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_item_type ON favorites(item_type);
```

---

### 9. notification_settings

User notification preferences (one-to-one with users).

```sql
CREATE TABLE notification_settings (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT false,
  request_updates BOOLEAN DEFAULT true,
  status_changes BOOLEAN DEFAULT true,
  comments BOOLEAN DEFAULT true,
  approvals BOOLEAN DEFAULT true,
  weekly_digest BOOLEAN DEFAULT false,
  marketplace_updates BOOLEAN DEFAULT true,
  regulation_alerts BOOLEAN DEFAULT true,
  daily_summary BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 10. marketplace_items

Catalog of tools and templates available in the marketplace.

```sql
CREATE TABLE marketplace_items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('process_mining', 'performance_management', 'risk_management')),
  industry VARCHAR(100),
  use_case VARCHAR(255),
  complexity VARCHAR(20) CHECK (complexity IN ('High', 'Medium', 'Low')),
  ai_powered BOOLEAN DEFAULT false,
  integration VARCHAR(100),
  platform VARCHAR(100),
  feature VARCHAR(255),
  risk_level VARCHAR(20) CHECK (risk_level IN ('High', 'Medium', 'Low')),
  ease_of_use VARCHAR(50) CHECK (ease_of_use IN ('Beginner', 'Intermediate', 'Advanced')),
  metric VARCHAR(100),
  real_time BOOLEAN DEFAULT false,
  difficulty VARCHAR(50),
  format VARCHAR(50),
  department VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_marketplace_type ON marketplace_items(type);
CREATE INDEX idx_marketplace_industry ON marketplace_items(industry);
CREATE INDEX idx_marketplace_use_case ON marketplace_items(use_case);
```

---

## Relationships

### Entity Relationship Summary

```
users (1) ──────< (∞) requests [requester_email]
users (1) ──────< (∞) requests [assigned_to]
users (1) ──────< (∞) documents [created_by]
users (1) ──────< (∞) document_comments [author]
users (1) ──────< (∞) favorites
users (1) ─────── (1) notification_settings

services (1) ──────< (∞) requests [implied]

requests (1) ─────── (1) documents [document_id]

documents (1) ──────< (∞) document_comments
documents (1) ──────< (∞) document_versions
documents (1) ──────< (∞) shared_documents

document_comments (1) ──────< (∞) document_comments [parent_id]
```

---

## Functions & Triggers

### Auto-update `updated_at` timestamp

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_requests_updated_at
  BEFORE UPDATE ON requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON document_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketplace_updated_at
  BEFORE UPDATE ON marketplace_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_settings_updated_at
  BEFORE UPDATE ON notification_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Auto-generate ticket numbers

```sql
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TRIGGER AS $$
DECLARE
  current_year TEXT;
  next_number INT;
BEGIN
  current_year := TO_CHAR(CURRENT_DATE, 'YYYY');

  SELECT COALESCE(MAX(
    CAST(SUBSTRING(ticket_number FROM 'REQ-' || current_year || '-(.*)') AS INT)
  ), 0) + 1 INTO next_number
  FROM requests
  WHERE ticket_number LIKE 'REQ-' || current_year || '-%';

  NEW.ticket_number := 'REQ-' || current_year || '-' || LPAD(next_number::TEXT, 3, '0');
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER generate_ticket_number_trigger
  BEFORE INSERT ON requests
  FOR EACH ROW
  WHEN (NEW.ticket_number IS NULL)
  EXECUTE FUNCTION generate_ticket_number();
```

### Auto-increment document versions

```sql
CREATE OR REPLACE FUNCTION set_document_version_number()
RETURNS TRIGGER AS $$
DECLARE
  next_version INT;
BEGIN
  SELECT COALESCE(MAX(version_number), 0) + 1 INTO next_version
  FROM document_versions
  WHERE document_id = NEW.document_id;

  NEW.version_number := next_version;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_version_number_trigger
  BEFORE INSERT ON document_versions
  FOR EACH ROW
  WHEN (NEW.version_number IS NULL)
  EXECUTE FUNCTION set_document_version_number();
```

### Create default notification settings for new users

```sql
CREATE OR REPLACE FUNCTION create_default_notification_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notification_settings (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER create_notification_settings_trigger
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_notification_settings();
```

---

## Row Level Security Policies

### Enable RLS on all tables

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_items ENABLE ROW LEVEL SECURITY;
```

### Users table policies

```sql
-- Users can view all active users
CREATE POLICY "Users can view active users"
  ON users FOR SELECT
  USING (status = 'active');

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Admins can do everything
CREATE POLICY "Admins can manage users"
  ON users FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### Requests table policies

```sql
-- Users can view their own requests
CREATE POLICY "Users can view own requests"
  ON requests FOR SELECT
  USING (
    requester_email = (SELECT email FROM users WHERE id = auth.uid())
  );

-- P&P team can view all requests
CREATE POLICY "PP team can view all requests"
  ON requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('pp_team', 'admin')
    )
  );

-- Users can create requests
CREATE POLICY "Users can create requests"
  ON requests FOR INSERT
  WITH CHECK (
    requester_email = (SELECT email FROM users WHERE id = auth.uid())
  );

-- P&P team can update requests
CREATE POLICY "PP team can update requests"
  ON requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('pp_team', 'admin')
    )
  );
```

### Documents table policies

```sql
-- All authenticated users can view published documents
CREATE POLICY "Users can view published documents"
  ON documents FOR SELECT
  USING (
    status IN ('Published', 'Active') OR
    created_by = (SELECT name FROM users WHERE id = auth.uid()) OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('pp_team', 'approver', 'admin')
    )
  );

-- P&P team can create documents
CREATE POLICY "PP team can create documents"
  ON documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('pp_team', 'admin')
    )
  );

-- P&P team and approvers can update documents
CREATE POLICY "Authorized users can update documents"
  ON documents FOR UPDATE
  USING (
    created_by = (SELECT name FROM users WHERE id = auth.uid()) OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('pp_team', 'approver', 'admin')
    )
  );
```

### Comments table policies

```sql
-- Users can view comments on documents they can access
CREATE POLICY "Users can view comments on accessible documents"
  ON document_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM documents d
      WHERE d.id = document_id AND (
        d.status IN ('Published', 'Active') OR
        d.created_by = (SELECT name FROM users WHERE id = auth.uid()) OR
        EXISTS (
          SELECT 1 FROM users
          WHERE id = auth.uid() AND role IN ('pp_team', 'approver', 'admin')
        )
      )
    )
  );

-- Authenticated users can add comments
CREATE POLICY "Users can add comments"
  ON document_comments FOR INSERT
  WITH CHECK (
    author = (SELECT name FROM users WHERE id = auth.uid())
  );

-- Users can update their own comments
CREATE POLICY "Users can update own comments"
  ON document_comments FOR UPDATE
  USING (
    author = (SELECT name FROM users WHERE id = auth.uid())
  );
```

### Favorites table policies

```sql
-- Users can manage their own favorites
CREATE POLICY "Users can manage own favorites"
  ON favorites FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
```

### Notification settings policies

```sql
-- Users can manage their own notification settings
CREATE POLICY "Users can manage own notification settings"
  ON notification_settings FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
```

### Marketplace items policies

```sql
-- All authenticated users can view marketplace items
CREATE POLICY "Users can view marketplace items"
  ON marketplace_items FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can manage marketplace items
CREATE POLICY "Admins can manage marketplace items"
  ON marketplace_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

## Initial Setup SQL

Complete setup script to create all tables, indexes, triggers, and RLS policies:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Run all CREATE TABLE statements above
-- Run all CREATE INDEX statements
-- Run all CREATE FUNCTION statements
-- Run all CREATE TRIGGER statements
-- Run all ALTER TABLE ENABLE RLS statements
-- Run all CREATE POLICY statements
```

---

## Migration Notes

### From Existing Airtable

If migrating from Airtable (as indicated by `id` formats like `recXXX`):

1. Keep existing IDs for `services` table
2. Generate new UUIDs for other tables
3. Map Airtable relationships to foreign keys
4. Convert linked records to proper foreign key references
5. Migrate attachments/files to Supabase Storage

### Data Migration Checklist

- [ ] Export all Airtable data to JSON/CSV
- [ ] Create Supabase tables with schema above
- [ ] Import services data (keep Airtable IDs)
- [ ] Import users (generate UUIDs, map emails)
- [ ] Import requests (generate IDs, map relationships)
- [ ] Import documents (generate IDs, map to requests)
- [ ] Set up Storage buckets for file attachments
- [ ] Configure RLS policies
- [ ] Test authentication and authorization
- [ ] Verify data integrity and relationships

---

## Storage Buckets

Recommended Supabase Storage buckets:

### document-files
```sql
-- Store uploaded policy/procedure documents
-- Path structure: {document_id}/{version}/{filename}
```

### user-avatars
```sql
-- Store user profile images
-- Path structure: {user_id}/avatar.{ext}
```

### shared-documents
```sql
-- Store temporarily shared document exports
-- Path structure: {share_id}/{filename}
```

---

## API Considerations

### Recommended Supabase Client Queries

**Get user with role:**
```typescript
const { data: user } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .single();
```

**Get requests with related data:**
```typescript
const { data: requests } = await supabase
  .from('requests')
  .select(`
    *,
    documents (*)
  `)
  .eq('requester_email', userEmail)
  .order('date_created', { ascending: false });
```

**Get document with comments and versions:**
```typescript
const { data: document } = await supabase
  .from('documents')
  .select(`
    *,
    document_comments (*),
    document_versions (*)
  `)
  .eq('id', documentId)
  .single();
```

---

## Performance Optimization

### Recommended Indexes (already included above)

- Foreign key columns
- Frequently queried status fields
- Email and ticket number lookups
- Date fields for sorting

### Query Optimization Tips

1. Use `select('*')` sparingly - specify needed columns
2. Leverage Postgres materialized views for complex reports
3. Use database functions for complex calculations
4. Implement pagination for large datasets
5. Cache frequently accessed reference data (services, users)

---

## Backup and Maintenance

### Automated Backups
Supabase provides automated daily backups. For additional safety:

1. Enable Point-in-Time Recovery (PITR)
2. Schedule weekly exports of critical tables
3. Store backups in separate S3 bucket
4. Test restore procedures quarterly

### Regular Maintenance

```sql
-- Vacuum and analyze tables monthly
VACUUM ANALYZE users;
VACUUM ANALYZE requests;
VACUUM ANALYZE documents;
VACUUM ANALYZE document_comments;
VACUUM ANALYZE document_versions;

-- Review and update table statistics
ANALYZE;

-- Check for bloat and dead tuples
SELECT schemaname, tablename, n_dead_tup
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC;
```

---

## Security Considerations

1. **Authentication**: Use Supabase Auth with email/password or SSO
2. **RLS Policies**: Enforce row-level security on all tables
3. **API Keys**: Rotate anon/service keys regularly
4. **Sensitive Data**: Encrypt sensitive fields at application layer
5. **Audit Logs**: Consider adding audit trail table for compliance
6. **GDPR**: Implement data retention and deletion policies

---

## Future Enhancements

### Potential Additional Tables

1. **audit_logs** - Track all changes for compliance
2. **notifications** - Store system notifications
3. **workflows** - Configurable workflow definitions
4. **templates** - Document templates
5. **tags** - Normalized tags table
6. **departments** - Normalized departments table
7. **sla_tracking** - Detailed SLA metrics

### Potential Features

- Full-text search using Postgres `tsvector`
- Document analytics and view tracking
- Advanced workflow engine
- Integration webhooks
- Real-time collaboration via Supabase Realtime
- AI-powered document suggestions

---

## Support

For questions about this schema:
1. Review Supabase documentation: https://supabase.com/docs
2. Check Postgres documentation: https://www.postgresql.org/docs/
3. Consult with database admin or backend team

---

**Version:** 1.0
**Last Updated:** 2025-01-15
**Maintained By:** Development Team
