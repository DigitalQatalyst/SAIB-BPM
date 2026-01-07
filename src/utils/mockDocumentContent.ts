// Mock document content for POC demonstration
// This simulates AI-generated content without calling Azure OpenAI

export const MOCK_DOCUMENT_CONTENT = `**Current Workflow for BPM Forums:**

**1.4 Establish BPM Forums**

- Define forum structure, frequency, quorum, and decision authority.
- Assign forum roles (Chair, Members, Secretariat).
- Develop and approve forum terms of reference (ToR).
- Schedule forum meetings and establish a biweekly meeting in the calendar.
- Communicate forum setup and participation requirements.
- Activate forums and commence governance operations.

**Updated Workflow for BPM Forums:**

**1.4 Establish BPM Forums (Updated)**

- Define forum structure, frequency, quorum, and decision authority, including compliance and regulatory reporting requirements.
- Assign forum roles (Chair, Members, Secretariat, Compliance Officers).
- Develop and approve forum terms of reference (ToR), ensuring alignment with updated regulations and compliance standards.

**Current Workflow for Maintaining the Registry:**

**1.6 Maintain Registry**

- Establish a centralized BPM registry for roles, forums, and assignments.
- Record all approved roles, stakeholders, and forum details.
- Track changes, versions, and effective dates.
- Perform periodic validation to ensure accuracy and completeness.
- Ensure controlled access and audit readiness of the registry.

**Updated Workflow for Maintaining the Registry:**

**1.6 Maintain Registry (Updated)**

- Establish a centralized BPM registry for roles, forums, and assignments, including tracking for compliance status.
- Record all approved roles, stakeholders, and forum details with a version history that includes compliance updates.
- Perform periodic validation to ensure accuracy and completeness, including quarterly compliance audits.`;

// Get mock content for full document
export const getMockFullDocument = (): string => {
  return MOCK_DOCUMENT_CONTENT;
};
