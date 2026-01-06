// Mock document content for POC demonstration
// This simulates AI-generated content without calling Azure OpenAI

export const MOCK_DOCUMENT_CONTENT = `# Business Processes and Procedures Manual - Forms Rules Update

## Document Information
**Document Version:** 2.0  
**Last Updated:** January 2026  
**Effective Date:** January 15, 2026  
**Document Owner:** Compliance Department

---

## Section 2.3: Forms Rules - Updated Based on SAMA Circular

### Rule 3: Customer Signatures on Contracts

**Rule Description:**

As per the new amendment in the SAMA Circular No. 391000020013, dated 20/02/1439H (09/11/2017) and its subsequent updates, the requirement for obtaining customer signatures on every page of contracts and agreements remains applicable. This rule is reinforced for **individual customers only**. 

However, **corporate customers are excluded** from this requirement and may not be required to provide signatures on every page of a contract or agreement. 

All forms and contracts related to microfinance activities must ensure compliance with the consumer protection principles, including obtaining clear consent from individual customers for every term, clause, and page of the document.

**Impacted Area:**

- **Forms Related to Microfinance Activities:** Ensure all forms for individual customers in microfinance contracts include the customer signature on each page of the agreement.
- **Corporate Customers:** Forms for corporate customers do not need to include signature fields on every page of the contract or agreement.

**Compliance Requirements:**
1. Individual customer contracts must have signature fields on every page
2. Corporate customer contracts are exempt from page-by-page signatures
3. All microfinance forms must comply with consumer protection principles
4. Clear consent must be obtained for every term and clause

---

### Rule 4: Exclusion of Signature Requirement for Account Opening

**Rule Description:**

In line with SAMA Circular No. 29811/67, dated 11/05/1440H, the requirement to obtain a customer's signature on every page of the account opening agreement for individual customers is **no longer applicable**. 

This allows flexibility in form design, as the focus is now on ensuring that individual customers acknowledge and understand the terms via specific controls within the form rather than requiring a signature on each page. 

This update applies to all forms concerning account opening agreements and customer consent in microfinance institutions.

**Impacted Area:**

- **Account Opening Forms:** Update the form design for individual customer account opening agreements to exclude the requirement of signatures on every page while maintaining other necessary consent fields.

**Implementation Guidelines:**
1. Remove signature fields from every page of account opening forms
2. Implement alternative consent mechanisms (checkboxes, electronic acknowledgment)
3. Ensure customers can review and understand all terms
4. Maintain audit trail of customer acknowledgment
5. Update form templates by February 1, 2026

---

### Rule 5: Prohibition of Official Company Stamp in Forms for Entities

**Rule Description:**

As per SAMA Circular 42043529, dated 26/06/1442, which clarifies SAMA Circular 41028325, the inclusion of the **Company's Official Stamp field is prohibited** in forms that are related to corporate customers or entities. 

This ensures that microfinance forms for entities comply with the updated regulatory guidelines and avoid unnecessary fields that do not align with the new requirements.

**Impacted Area:**

- **Corporate Forms:** Revise any corporate-related microfinance forms to exclude the official stamp field, ensuring compliance with SAMA's updated guidance for forms related to entities.

**Action Items:**
1. Review all corporate customer forms
2. Remove official stamp fields from entity-related forms
3. Update form templates and systems
4. Train staff on new requirements
5. Complete implementation by January 31, 2026

---

## Summary of Affected Rules

The following rules have been updated to reflect the latest SAMA circular amendments:

1. **Rule 3: Customer Signatures on Contracts**
   - Individual customers: Signatures required on every page
   - Corporate customers: Signatures NOT required on every page
   - Applies to: Microfinance contracts and agreements

2. **Rule 4: Exclusion of Signature Requirement for Account Opening**
   - Individual customers: Signatures NOT required on every page of account opening forms
   - Alternative consent mechanisms must be implemented
   - Applies to: Account opening agreements

3. **Rule 5: Prohibition of Official Company Stamp in Forms for Entities**
   - Corporate forms: Official stamp field is prohibited
   - Applies to: All entity-related microfinance forms

---

## Implementation Timeline

| Task | Responsible Party | Deadline |
|------|------------------|----------|
| Update form templates | Forms Management Team | January 20, 2026 |
| System configuration changes | IT Department | January 25, 2026 |
| Staff training | Training Department | January 28, 2026 |
| Final review and approval | Compliance Department | January 30, 2026 |
| Go-live date | All Departments | February 1, 2026 |

---

## Compliance and Monitoring

**Compliance Officer:** Khalid Al-Otaibi  
**Review Frequency:** Quarterly  
**Next Review Date:** April 2026

**Monitoring Requirements:**
- Monthly audit of form compliance
- Quarterly review of customer feedback
- Annual regulatory compliance assessment
- Immediate review upon new SAMA circulars

---

## References

1. SAMA Circular No. 391000020013, dated 20/02/1439H (09/11/2017)
2. SAMA Circular No. 29811/67, dated 11/05/1440H
3. SAMA Circular 42043529, dated 26/06/1442
4. SAMA Circular 41028325
5. Consumer Protection Principles for Microfinance Activities

---

## Approval

**Prepared by:** Compliance Department  
**Reviewed by:** Legal Department  
**Approved by:** Chief Compliance Officer  

**Approval Date:** January 6, 2026

---

## Language Dominance in Discrepancies

In case of any discrepancies between the Arabic and the English text of this policy, the Arabic text shall prevail.

---

**Document Version:** 2.0  
**Approval Date:** January 2026  
**Approval Version Control:**  
Version: 2.0  
Date: January 6, 2026
`;

// Mock section-specific content for POC
export const MOCK_SECTION_CONTENT: { [key: string]: string } = {
  'Abbreviations': `## Abbreviations

| Term | Full Form |
|------|-----------|
| SAIB | Saudi Investment Bank |
| SAMA | Saudi Central Bank (Saudi Arabian Monetary Authority) |
| P&P | Policies and Procedures |
| SLA | Service Level Agreement |
| KYC | Know Your Customer |
| AML | Anti-Money Laundering |
`,

  'Definitions': `## Definitions

| Term | Definition |
|------|-----------|
| Individual Customer | A natural person who enters into a contract or agreement with the bank for personal purposes |
| Corporate Customer | A legal entity, company, or organization that enters into business relationships with the bank |
| Microfinance Activities | Financial services provided to low-income individuals or small businesses |
| Consumer Protection Principles | Regulatory guidelines ensuring fair treatment and transparency for customers |
| Official Stamp | A company's registered seal or stamp used for authentication purposes |
`,

  'Introduction': `## Introduction

### Policy Definition

This policy update addresses the Forms Rules section of the Business Processes and Procedures Manual, specifically incorporating amendments from recent SAMA circulars regarding customer signatures, account opening procedures, and corporate documentation requirements.

### Purpose of this Update

This update ensures compliance with the latest regulatory requirements from SAMA while maintaining operational efficiency and customer satisfaction. The changes reflect a modernized approach to documentation that balances regulatory compliance with practical business needs.
`,

  'Purpose of this Policy': `## Purpose of this Policy

The purpose of this policy update is to:

1. **Ensure Regulatory Compliance:** Align all forms and procedures with the latest SAMA circular requirements
2. **Enhance Customer Experience:** Reduce unnecessary documentation burden while maintaining proper controls
3. **Differentiate Requirements:** Clearly distinguish between individual and corporate customer requirements
4. **Modernize Processes:** Implement contemporary documentation practices that reflect digital transformation
5. **Maintain Audit Trail:** Ensure proper documentation and consent mechanisms are in place
`,

  'Bank\'s Documents Used in Tandem': `## Bank's Documents Used in Tandem

This policy should be used in conjunction with:

1. **Forms Management Manual** - Detailed procedures for form creation and maintenance
2. **Customer Onboarding Procedures** - Guidelines for account opening and customer verification
3. **Compliance Manual** - Overall regulatory compliance framework
4. **Microfinance Operations Manual** - Specific procedures for microfinance activities
5. **Digital Signature Policy** - Guidelines for electronic signatures and consent
`,

  'Regulatory Reference Documents': `## Regulatory Reference Documents

This policy references the following SAMA circulars and regulations:

1. **SAMA Circular No. 391000020013** (20/02/1439H / 09/11/2017)
   - Customer signatures on contracts and agreements
   
2. **SAMA Circular No. 29811/67** (11/05/1440H)
   - Account opening signature requirements
   
3. **SAMA Circular 42043529** (26/06/1442)
   - Official company stamp requirements
   
4. **SAMA Circular 41028325**
   - Clarification on entity documentation
   
5. **SAMA Consumer Protection Framework**
   - General consumer protection principles
`,

  'Ownership and Updates': `## Ownership and Updates

**Policy Owner:** Compliance Department  
**Document Custodian:** Forms Management Team  
**Review Frequency:** Quarterly or upon regulatory changes  

**Update Process:**
1. Monitor SAMA circulars and regulatory updates
2. Assess impact on existing forms and procedures
3. Draft policy updates with legal review
4. Obtain approval from Chief Compliance Officer
5. Communicate changes to all stakeholders
6. Implement updates in systems and forms
7. Conduct training for affected staff

**Next Scheduled Review:** April 2026
`,
};

// Simulate AI generation delay
export const simulateAIGeneration = (durationMs: number = 30000): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, durationMs);
  });
};

// Get mock content for full document
export const getMockFullDocument = (): string => {
  return MOCK_DOCUMENT_CONTENT;
};

// Get mock content for specific section
export const getMockSectionContent = (sectionTitle: string): string => {
  // Check if we have specific content for this section
  if (MOCK_SECTION_CONTENT[sectionTitle]) {
    return MOCK_SECTION_CONTENT[sectionTitle];
  }
  
  // Return generic content for sections we don't have specific content for
  return `## ${sectionTitle}

*This section contains information about ${sectionTitle.toLowerCase()}.*

The content for this section will be developed based on the specific requirements and regulatory guidelines applicable to ${sectionTitle.toLowerCase()}.

**Key Points:**
- Compliance with SAMA regulations
- Alignment with bank policies
- Clear documentation requirements
- Regular review and updates

**Implementation:**
This section should be reviewed and updated in accordance with the latest regulatory requirements and operational needs.
`;
};
