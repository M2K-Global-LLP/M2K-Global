// Preserve these source tokens so this remains an editable legal-review template.
// The renderer substitutes the configured company details; forms are implemented; legal review remains required.
export const legal = {
  privacy: { status: "draft", bodyMarkdown: `## About this draft

This draft describes the contact and recruitment features of [COMPANY NAME]. It is not a final privacy policy. The website provides a contact form and, for open roles, an application form with a PDF resume upload.

## Contact enquiries

The contact form requests a name, email address, optional phone number and organization, service interest, and an enquiry message. The purpose is to receive and respond to the enquiry. A privacy-consent checkbox is required.

## Recruitment applications

Applications request the selected role, name, email address, optional phone number, LinkedIn URL and cover message, and a PDF resume. A privacy-consent checkbox is required. The intended purpose is to review an application and communicate about the role.

## Storage, delivery and retention

Submissions are stored in Supabase Postgres. Resumes are stored in a private Supabase Storage bucket with generated keys. The server generates resume download links that expire within ten minutes. Email notifications are attempted after a submission is stored. In development, notification summaries are logged instead of emailing; production email requires a configured SMTP provider. Request identifiers and diagnostic information support operation of the service. Temporary upload files are removed after validation. Access responsibilities, production email providers, retention/deletion periods and the process for privacy requests must be confirmed before public launch.

## Contacting us directly

If you choose to contact us by email or telephone, that communication takes place outside the website forms. The final policy must explain the actual handling of those communications.

## Questions

Contact [COMPANY NAME] at [EMAIL]. Requests and the applicable process should be described in the final reviewed policy.

## Before publication

Legal counsel must review this template against the actual services, providers, applicable requirements and data-handling procedures. Do not use this draft as a statement of completed compliance.` },
  terms: { status: "draft", bodyMarkdown: `## About this draft

These are draft website terms for [COMPANY NAME]. They require legal review before launch and do not replace a separate written engagement agreement.

## Website information

Service descriptions introduce potential areas of support. The scope, deliverables, fees, responsibilities and timelines of any engagement must be agreed separately. Draft content and sample interfaces are not evidence of completed engagements.

## Tender information

The Tender Saar dashboard on this website uses sample data. Official tender notices, documents and amendments should be checked at their official source. An advisory discussion does not determine the issuing body's decision.

## Contact and recruitment features

Contact and application forms request consent and validate the supplied fields. Resume uploads accept PDF files up to 5 MB. Submitting an enquiry or application does not create an engagement or guarantee a role. The privacy notice remains a draft requiring legal review before public launch.

## Third-party links

Links may lead to official procurement sources or, once configured, a separate application. Their availability, terms and data practices are outside this draft's scope and should be reviewed at the destination.

## Technology delivery

Products are delivered through managed delivery and technology partners. Responsibilities, ownership, acceptance and support arrangements are defined in the relevant engagement terms.

## Questions and review

Contact [COMPANY NAME] at [EMAIL]. Legal counsel must review website use, content rights, liability, applicable law and other required terms before a final version is published. No governing-law or dispute-resolution terms are assumed by this template.` },
};
