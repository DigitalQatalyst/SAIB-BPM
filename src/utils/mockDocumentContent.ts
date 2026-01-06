// Mock document content for POC demonstration
// This simulates AI-generated content without calling Azure OpenAI

export const MOCK_DOCUMENT_CONTENT = `**Current Rule:**

**2.3 Forms Rules**

**Rule 1:** As per SAMA Circular No. 391000020013, dated 20/02/1439H (09/11/2017), SAIB should obtain customer signatures on all pages of a contract or agreement if it consists of multiple pages or contains fields for the customer's signature, to ensure the client has read and understood all the terms and conditions mentioned thereon and also to be in compliance with consumer protection principles.

**Rule 2:** The above circular was followed by another circular from SAMA with reference number 391000080993, dated 19/07/1439H, stating that the above circular applies only to individual customers and not to corporate customers. The banks have the right not to obtain a corporate customer's signature on every page of the contract or agreement if it consists of multiple pages.

**Rule 3:** Another circular has been received from SAMA with reference number 29811/67, dated 11/05/1440H, instructing banks to exclude the requirement of obtaining a customer's signature on every page of the account opening agreement applicable to individual customers.

**Rule 4:** Circular reference number 29811/67, dated 11/05/1440H, has listed the following controls related to individual customer account opening agreements: (Text from the circular would follow here.)

**Rule 5:** As per SAMA's Circular 42043529 dated 26/06/1442, which refers to SAMA Circular 41028325 dated 22/04/1441 and SAMA's circular 391000031596 dated 18/03/1439H, and 381000053456 dated 17/05/1438H, it's not allowed to include Companies Official stamp field within the Bank's forms and agreements that are related to entities.

**Rule 6:** As per SAMA's circular Financial Consumer Protection Principles and Rules 1444H/2022, SAIB should adhere to the following for individual customer-related external forms: (Text from the circular would follow here.)

**Updated Rule:**

**2.3 Forms Rules**

**Rule 1:** As per SAMA Circular No. 391000020013, dated 09/11/2017, SAIB must obtain customer signatures on all pages of a contract or agreement if it consists of multiple pages or contains fields for customer signatures to ensure the client has read and understood all the terms and conditions.

**Rule 2:** As per SAMA Circular No. 391000080993, dated 19/07/1439, the signature requirement applies only to individual customers. Corporate customers are not required to provide a signature on every page of contracts or agreements that consist of multiple pages.

**Rule 3:** As per SAMA Circular No. 29811/67, dated 11/05/1440, banks are no longer required to obtain a customer's signature on every page of the account opening agreement for individual customers.

**Rule 4:** SAMA Circular 42043529, dated 26/06/1442, prohibits the inclusion of a company's official stamp in forms related to agreements or contracts involving entities.

**Rule 5:** SAIB is required to comply with SAMA's Financial Consumer Protection Principles & Rules (1444H/2022), ensuring all external forms for individual customers adhere to consumer protection guidelines.

**Implementation Guideline:**

**For Customer Signatures:**
Ensure signature fields are required only for pages containing essential terms and conditions.
Modify digital forms to include signature fields only where needed (e.g., for acknowledging key terms).

**For Corporate Customers:**
Remove the signature requirement on every page for corporate customers in multi-page contracts.
Update internal forms to ensure that corporate customers are only asked to sign specific, critical sections of agreements.

**For Account Opening Agreements:**
Exclude the signature requirement for individual customers on every page of account opening agreements in compliance with SAMA Circular No. 29811/67.

**For Company Stamps:**
Remove any company official stamp fields from forms related to corporate agreements as per SAMA Circular 42043529.

**For Consumer Protection:**
Ensure that all external forms for individual customers are compliant with SAMA's Financial Consumer Protection Principles & Rules (1444H/2022), and update the forms as necessary.`;

// Get mock content for full document
export const getMockFullDocument = (): string => {
  return MOCK_DOCUMENT_CONTENT;
};
