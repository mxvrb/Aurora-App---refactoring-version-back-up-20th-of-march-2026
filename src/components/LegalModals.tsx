import React from 'react';
import { Button } from './ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from './ui/dialog';

interface LegalModalsProps {
  showTermsModal: boolean;
  setShowTermsModal: (v: boolean) => void;
  showPrivacyModal: boolean;
  setShowPrivacyModal: (v: boolean) => void;
}

export function LegalModals({
  showTermsModal, setShowTermsModal,
  showPrivacyModal, setShowPrivacyModal,
}: LegalModalsProps) {
  return (
    <>
      {/* Terms Modal */}
      <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
        <DialogContent className="max-w-4xl h-[85vh] flex flex-col bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-2xl rounded-xl p-6">
          <DialogHeader className="pb-4 shrink-0 space-y-2">
            <DialogTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Terms of Service</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Please review our terms carefully before continuing.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 min-h-0 relative">
            <div className="absolute inset-0 overflow-y-auto rounded-lg border border-blue-200 dark:border-blue-900/30 bg-gray-50/50 dark:bg-gray-800/50 p-6 shadow-sm scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
              <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                <p className="font-semibold uppercase tracking-wider mb-4 text-xs text-gray-400">Last Updated: January 13, 2026</p>
                
                <p className="font-bold mb-4">
                  THESE TERMS OF SERVICE (the "Agreement") GOVERN YOUR RECEIPT, ACCESS TO, AND USE OF THE SERVICES PROVIDED BY ACES AI ("Aces AI"). BY (A) PURCHASING ACCESS TO THE SERVICE THROUGH AN ONLINE ORDERING PROCESS THAT REFERENCES THIS AGREEMENT, (B) SIGNING UP FOR A FREE OR PAID ACCESS PLAN FOR THE SERVICE VIA A PLATFORM THAT REFERENCES THIS AGREEMENT, OR (C) CLICKING A BOX INDICATING ACCEPTANCE, YOU AGREE TO BE BOUND BY THE TERMS OF THIS AGREEMENT. THE INDIVIDUAL ACCEPTING THIS AGREEMENT DOES SO ON BEHALF OF A COMPANY OR OTHER LEGAL ENTITY ("Customer"); SUCH INDIVIDUAL REPRESENTS AND WARRANTS THAT THEY HAVE THE AUTHORITY TO BIND SUCH ENTITY AND ITS AFFILIATES TO THIS AGREEMENT. IF THE INDIVIDUAL ACCEPTING THIS AGREEMENT DOES NOT HAVE SUCH AUTHORITY, OR IF THE ENTITY DOES NOT AGREE WITH THESE TERMS AND CONDITIONS, SUCH INDIVIDUAL MUST NOT ACCEPT THIS AGREEMENT AND MAY NOT USE THE SERVICES. CAPITALIZED TERMS HAVE THE MEANINGS SET FORTH HEREIN. THE PARTIES AGREE AS FOLLOWS:
                </p>

                <h3 className="text-gray-900 dark:text-gray-100 font-bold mt-6 mb-2">1. The Service</h3>
                <p className="font-semibold mb-1">1.1 Service Description</p>
                <p className="mb-4">Aces AI owns and provides a cloud-based artificial intelligence service offering agents for customer support, sales, and user engagement (the "Service"). Anything the Customer (including Users) configures, customizes, uploads, or otherwise utilizes through the Service is considered a "User Submission." Customer is solely responsible for all User Submissions it contributes to the Service. Additional terms regarding User Submissions, including ownership, are in Section 8.2 below. The Service may include templates, scripts, documentation, and other materials that assist Customer in using the Service ("Aces AI Content"). Customers will not receive or have access to the underlying code or software of the Service (collectively, the "Software") nor receive a copy of the Software itself.</p>

                <p className="font-semibold mb-1">1.2. Customer's Subscription</p>
                <p className="mb-4">Subject to the terms of this Agreement, Customer may purchase a subscription to, and has the right to access and use, the Service as specified in one or more ordering screens agreed upon by the parties through Aces AI's website or service portal that reference this Agreement and describe the business terms related to Customer's subscription ("Order(s)"). All subscriptions are for the period described in the applicable Order ("Subscription Period"). Use of and access to the Service is permitted only for individuals authorized by the Customer and solely for Customer's own internal business purposes, not for the benefit of any third party ("Users").</p>

                <p className="font-semibold mb-1">1.3. Aces AI's Ownership</p>
                <p className="mb-4">Aces AI owns the Service, Software, Aces AI Content, Documentation, and anything else provided by Aces AI to the Customer (collectively, the "Aces AI Materials"). Aces AI retains all rights, title, and interest (including all intellectual property rights) in and to the Aces AI Materials, all related and underlying technology, and any updates, enhancements, modifications, or fixes thereto, as well as all derivative works of or modifications to any of the foregoing. No implied licenses are granted under this Agreement, and any rights not expressly granted to the Customer are reserved by Aces AI.</p>

                <p className="font-semibold mb-1">1.4 Permissions</p>
                <p className="mb-4">The Service includes customizable settings allowing Users to grant permissions to other Users to perform various tasks within the Service ("Permissions"). It is solely the Customer's responsibility to set and manage all Permissions, including determining which Users can set such Permissions. Accordingly, Aces AI has no responsibility for managing Permissions and no liability for Permissions set by the Customer and its Users. The Customer may provide access to the Service to its Affiliates, in which case all rights granted and obligations incurred under this Agreement shall extend to such Affiliates. The Customer represents and warrants it is fully responsible for any breaches of this Agreement by its Affiliates and has the authority to negotiate this Agreement on behalf of its Affiliates. The Customer is also responsible for all payment obligations under this Agreement, regardless of whether the use of the Service is by the Customer or its Affiliates. Any claim by an Affiliate against Aces AI must be brought by the Customer, not the Affiliate. An "Affiliate" of a party means any entity directly or indirectly controlling, controlled by, or under common control with that party, where "control" means the ownership of more than fifty percent (50%) of the voting shares or other equity interests.</p>

                <h3 className="text-gray-900 dark:text-gray-100 font-bold mt-6 mb-2">2. Restrictions</h3>
                <p className="font-semibold mb-1">2.1 Customer's Responsibilities</p>
                <p className="mb-4">The Customer is responsible for all activity on its account and those of its Users, except where such activity results from unauthorized access due to vulnerabilities in the Service itself. The Customer will ensure its Users are aware of and comply with the obligations and restrictions in this Agreement, bearing responsibility for any breaches by a User.</p>

                <p className="font-semibold mb-1">2.2 Use Restrictions</p>
                <p className="mb-4">The Customer agrees not to, and not to permit Users or third parties to, directly or indirectly: (a) modify, translate, copy, or create derivative works based on the Service; (b) reverse engineer, decompile, or attempt to discover the source code or underlying ideas of the Service, except as permitted by law; (c) sublicense, sell, rent, lease, distribute, or otherwise commercially exploit the Service; (d) remove proprietary notices from the Service; (e) use the Service in violation of laws or regulations; (f) attempt unauthorized access to or disrupt the Service; (g) use the Service to support products competitive to Aces AI; (h) test the Service's vulnerability without authorization. If the Customer's use of the Service significantly harms Aces AI or the Service's security or integrity, Aces AI may suspend access to the Service, taking reasonable steps to notify the Customer and resolve the issue promptly.</p>

                <p className="font-semibold mb-1">2.3. API Access Restrictions</p>
                <p className="mb-4">Aces AI may provide access to APIs as part of the Service. Aces AI reserves the right to set and enforce usage limits on the APIs, and the Customer agrees to comply with such limits. Aces AI may also suspend or terminate API access at any time.</p>

                <h3 className="text-gray-900 dark:text-gray-100 font-bold mt-6 mb-2">3. Third-Party Services</h3>
                <p className="mb-4">The Service may interface with third-party products, services, or applications that are not owned or controlled by Aces AI ("Third-Party Services"). Customers have the discretion to utilize these Third-Party Services in conjunction with our Service. Should the integration of the Service with any Third-Party Service require, customers will be responsible for providing their login information to Aces AI solely for the purpose of enabling Aces AI to deliver its Service. Customers affirm that they have the authority to provide such information without violating any terms and conditions governing their use of the Third-Party Services. Aces AI does not endorse any Third-Party Services. Customers acknowledge that this Agreement does not cover the use of Third-Party Services, and they may need to enter into separate agreements with the providers of these services. Aces AI expressly disclaims all representations and warranties concerning Third-Party Services. Customers must direct any warranty claims or other disputes directly to the providers of the Third-Party Services. The use of Third-Party Services is at the customer's own risk. Aces AI shall not be liable for any issues arising from the use or inability to use Third-Party Services.</p>

                <h3 className="text-gray-900 dark:text-gray-100 font-bold mt-6 mb-2">4. Financial Terms</h3>
                <p className="font-semibold mb-1">4.1 Fees</p>
                <p className="mb-4">Customers are required to pay for access to and use of the Service as detailed in the applicable order ("Fees"). All Fees will be charged in the currency stated in the order or, if no currency is specified, in U.S. dollars. Payment obligations are non-cancellable and, except as explicitly stated in this Agreement, Fees are non-refundable. Aces AI reserves the right to modify its Fees or introduce new fees at its discretion. Customers have the option not to renew their subscription if they disagree with any revised fees.</p>

                <p className="font-semibold mb-1">4.2 Payment</p>
                <p className="mb-4">Aces AI, either directly or through its third-party payment processor ("Payment Processor"), will bill the customer for the Fees using the credit card or ACH payment information provided by the customer. Aces AI reserves the right to charge the customer's credit card or ACH payment method for any services provided under the order, including recurring Fees. It is the customer's responsibility to ensure that Aces AI has current and accurate credit card or ACH payment information. Failure to provide accurate information may lead to a suspension of access to the Services. Aces AI also reserves the right to offset any Fees owed by the customer. If the customer pays through a Payment Processor, such transactions will be subject to the Payment Processor's terms, conditions, and privacy policies, in addition to this Agreement. Aces AI is not responsible for errors or omissions by the Payment Processor. Aces AI reserves the right to correct any errors made by the Payment Processor, even if payment has already been requested or received. If the customer authorizes, through accepting an order, recurring charges will be automatically applied to the customer's payment method without further authorization until the customer terminates this Agreement or updates their payment method.</p>

                <p className="font-semibold mb-1">4.3 Taxes</p>
                <p className="mb-4">Fees do not include any taxes, levies, duties, or similar governmental assessments, including value-added, sales, use, or withholding taxes, imposed by any jurisdiction (collectively, "Taxes"). Customers are responsible for paying all Taxes associated with their purchases. If Aces AI is obligated to pay or collect Taxes for which the customer is responsible, Aces AI will invoice the customer for such Taxes unless the customer provides Aces AI with a valid tax exemption certificate authorized by the appropriate taxing authority beforehand. For clarity, Aces AI is solely responsible for taxes based on its income, property, and employees.</p>

                <p className="font-semibold mb-1">4.4 Failure to Pay</p>
                <p className="mb-4">If a customer fails to pay any Fees when due, Aces AI may suspend access to the Service until overdue amounts are paid. Aces AI is authorized to attempt charging the customer's payment method multiple times if an initial charge is unsuccessful. If a customer believes they have been incorrectly billed, they must contact Aces AI within sixty (60) days from the first billing statement showing the error to request an adjustment or credit. Upon receiving a dispute notice, Aces AI will review and provide the customer with a written decision, including evidence supporting this decision. If it is determined that the billed amounts are due, the customer must pay these amounts within ten (10) days of receiving Aces AI's written decision.</p>

                <h3 className="text-gray-900 dark:text-gray-100 font-bold mt-6 mb-2">5. Term and Termination</h3>
                <p className="font-semibold mb-1">5.1. Agreement Term and Renewals</p>
                <p className="mb-4">Subscriptions to access and use Aces AI's service ("Service") commence on the start date specified on the applicable Order ("Subscription Start Date") and continue for the duration of the Subscription Period. Customers may opt not to renew their Subscription Period by notifying Aces AI at billing@aces.ai (provided that Aces AI confirms such cancellation in writing) or by modifying their subscription through the Customer's account settings within the Service. This Agreement takes effect on the first day of the Subscription Period and remains effective for the duration of the Subscription Period stated on the Order, including any renewals of the Subscription Period and any period that the Customer is using the Service, even if such use is not under a paid Order ("Term"). If this Agreement is terminated by either party, it will automatically terminate all Orders. If a Customer cancels or chooses not to renew their paid subscription to the Service, the Customer's subscription will still be accessible but will automatically be downgraded to a version of the Service with reduced features and functionality that Aces AI offers to unpaid subscribers ("Free Version"). Should this Agreement be terminated by either Aces AI or the Customer, or should the Customer delete its workspace within the Service, access to the Free Version will be revoked.</p>

                <p className="font-semibold mb-1">5.2. Termination</p>
                <p className="mb-4">Either party may terminate this Agreement with written notice to the other party if the other party materially breaches this Agreement and such breach is not cured within thirty (30) days after receipt of such notice. Aces AI may terminate a Customer's access to the Free Version at any time upon notice.</p>

                <p className="font-semibold mb-1">5.3. Effect of Termination</p>
                <p className="mb-4">If the Customer terminates this Agreement due to an uncured breach by Aces AI, Aces AI will refund any unused, prepaid Fees for the remainder of the then-current Subscription Period. If Aces AI terminates this Agreement due to an uncured breach by the Customer, the Customer will pay any unpaid Fees covering the remainder of the then-current Subscription Period after the date of termination. No termination will relieve the Customer of the obligation to pay any Fees payable to Aces AI for the period prior to the effective date of termination. Upon termination, all rights and licenses granted by Aces AI will cease immediately, and the Customer will lose access to the Service. Within thirty (30) days of termination for cause, upon the Customer's request, or if the Customer deletes its workspace within the Service, Aces AI will delete the Customer's User Information, including passwords, files, and submissions, unless an earlier deletion is requested in writing. For Customers using the Free Version, Aces AI may retain User Submissions and User Information to facilitate continued use. Aces AI may delete all User Submissions and User Information if an account remains inactive for more than one (1) year.</p>

                <p className="font-semibold mb-1">5.4. Survival</p>
                <p className="mb-4">Sections titled "Aces AI's Ownership", "Third-Party Services", "Financial Terms", "Term and Termination", "Warranty Disclaimer", "Limitation of Liability", "Confidentiality", "Data" and "General Terms" will survive any termination or expiration of this Agreement.</p>

                <h3 className="text-gray-900 dark:text-gray-100 font-bold mt-6 mb-2">6. Warranties and Disclaimers</h3>
                <p className="font-semibold mb-1">6.1. Warranties</p>
                <p className="mb-4">Customers represent and warrant that all User Submissions submitted by Users comply with all applicable laws, rules, and regulations.</p>

                <p className="font-semibold mb-1">6.2. Warranty Disclaimer</p>
                <p className="mb-4">EXCEPT AS EXPRESSLY STATED HEREIN, THE SERVICES AND ALL RELATED COMPONENTS AND INFORMATION ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT ANY WARRANTIES OF ANY KIND, AND ACES AI EXPRESSLY DISCLAIMS ANY AND ALL WARRANTIES, WHETHER EXPRESS OR IMPLIED, INCLUDING THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. CUSTOMERS ACKNOWLEDGE THAT ACES AI DOES NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE. SOME JURISDICTIONS DO NOT ALLOW THE DISCLAIMER OF CERTAIN WARRANTIES, SO THE FOREGOING DISCLAIMERS MAY NOT APPLY TO THE EXTENT PROHIBITED BY LAW.</p>

                <h3 className="text-gray-900 dark:text-gray-100 font-bold mt-6 mb-2">7. Limitation of Liability</h3>
                <p className="mb-4">NOTWITHSTANDING ANY PROVISION TO THE CONTRARY, ACES AI WILL NOT BE LIABLE FOR ANY INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL DAMAGES, OR DAMAGES BASED ON THE USE OR ACCESS, INTERRUPTION, DELAY, OR INABILITY TO USE THE SERVICE, LOST REVENUES OR PROFITS, LOSS OF BUSINESS OR GOODWILL, DATA CORRUPTION, OR SYSTEM FAILURES, REGARDLESS OF THE LEGAL THEORY. FURTHER, ACES AI'S TOTAL LIABILITY WILL NOT EXCEED THE TOTAL FEES PAID OR PAYABLE BY THE CUSTOMER FOR THE SERVICE DURING THE TWELVE (12) MONTHS PRIOR TO THE CLAIM. THESE LIMITATIONS APPLY REGARDLESS OF WHETHER ACES AI HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES AND NOTWITHSTANDING ANY FAILURE OF ESSENTIAL PURPOSE OF ANY LIMITED REMEDY.</p>

                <h3 className="text-gray-900 dark:text-gray-100 font-bold mt-6 mb-2">8. Confidentiality</h3>
                <p className="font-semibold mb-1">8.1 Definition</p>
                <p className="mb-4">Each party (the "Receiving Party") recognizes that the other party (the "Disclosing Party") may share business, technical, or financial information pertaining to the Disclosing Party's operations that, due to the nature of the information and the context of disclosure, is reasonably considered confidential ("Confidential Information"). For Aces AI, Confidential Information includes non-public details about features, functionality, and performance of the Service. For Customers, Confidential Information comprises User Information and User Submissions. This Agreement, along with all related Orders, is considered Confidential Information of both parties. However, Confidential Information does not include information that: (a) becomes publicly available without breaching any duty to the Disclosing Party; (b) was known to the Receiving Party before disclosure by the Disclosing Party without breaching any duty; (c) is received from a third party without breaching any duty; or (d) was independently developed by the Receiving Party without using the Disclosing Party's Confidential Information.</p>

                <p className="font-semibold mb-1">8.2 Protection and Use of Confidential Information</p>
                <p className="mb-4">The Receiving Party must: (a) protect the Disclosing Party's Confidential Information with at least the same degree of care it uses for its own similar information, but no less than a reasonable level of care; (b) restrict access to Confidential Information to personnel, affiliates, subcontractors, agents, consultants, legal advisors, financial advisors, and contractors ("Representatives") who need this information in relation to this Agreement and who are bound by confidentiality obligations similar to those in this Agreement; (c) not disclose any Confidential Information to third parties without prior written consent from the Disclosing Party, except as expressly stated herein; and (d) use the Confidential Information solely to fulfill obligations under this Agreement. This does not prevent sharing of Agreement terms or the other party's name with potential investors or buyers under standard confidentiality terms.</p>

                <p className="font-semibold mb-1">8.3 Compelled Access or Disclosure</p>
                <p className="mb-4">If required by law, the Receiving Party may access or disclose the Disclosing Party's Confidential Information, provided that it notifies the Disclosing Party in advance (when legally permissible) and offers reasonable help, at the Disclosing Party's expense, if the Disclosing Party wants to contest the disclosure.</p>

                <p className="font-semibold mb-1">8.4 Feedback</p>
                <p className="mb-4">Customers may occasionally offer feedback on the Service ("Feedback"). Aces AI may choose to incorporate this Feedback into its services. Customers grant Aces AI a royalty-free, worldwide, perpetual, irrevocable, fully transferable, and sublicensable license to use, disclose, modify, create derivative works from, distribute, display, and exploit any Feedback as Aces AI sees fit, without any obligation or restriction, except for not identifying the Customer as the source of Feedback.</p>

                <h3 className="text-gray-900 dark:text-gray-100 font-bold mt-6 mb-2">9. Data</h3>
                <p className="font-semibold mb-1">9.1 User Information</p>
                <p className="mb-4">Customers and their Users must provide information like names, email addresses, usernames, IP addresses, browsers, and operating systems ("User Information") to access the Service. Customers authorize Aces AI and its subcontractors to store, process, and retrieve User Information as part of the Service usage. Customers guarantee they have the necessary rights to provide User Information to Aces AI for processing as described in this Agreement. Customers are liable for their User Information and any unauthorized use of their credentials.</p>

                <p className="font-semibold mb-1">9.2 User Submissions</p>
                <p className="mb-4">Customers grant Aces AI a non-exclusive, worldwide, royalty-free, transferable license to use, process, and display User Submissions solely to provide the Service. Beyond the rights granted here, Customers retain all rights to User Submissions, with no implied licenses under this Agreement.</p>

                <p className="font-semibold mb-1">9.3 Service Data</p>
                <p className="mb-4">Aces AI collects data on Service performance and operation ("Service Data") as Customers use the Service. Provided Service Data is aggregated and anonymized, without disclosing any personal information, Aces AI can use this data freely. Aces AI owns all rights to Service Data, but will not identify Customers or Users as its source.</p>

                <p className="font-semibold mb-1">9.4 Data Protection</p>
                <p className="mb-4">Aces AI maintains reasonable security practices to protect Customer Data, including User Submissions and User Information. Nonetheless, Customers are responsible for securing their systems and data. Aces AI processes all Customer Data in accordance with its Data Processing Agreement, available at https://aces.ai/legal/dpa</p>

                <h3 className="text-gray-900 dark:text-gray-100 font-bold mt-6 mb-2">10. General Terms</h3>
                <p className="font-semibold mb-1">10.1 Publicity</p>
                <p className="mb-4">You agree that Aces AI may identify the Customer as a user of the Service and use and display the Customer's name, logo, trademarks, or service marks on Aces AI's website and in marketing materials to demonstrate the clientele and user base of Aces AI, provided that the Customer has an active account (including Free Version). This right is granted upon acceptance of this Agreement.</p>

                <p className="font-semibold mb-1">10.2 Force Majeure</p>
                <p className="mb-4">Aces AI shall not be liable for any failure or delay in performing its obligations hereunder caused by events beyond its reasonable control, including but not limited to failures of third-party hosting or utility providers, strikes (excluding those involving Aces AI's employees), riots, fires, natural disasters, wars, terrorism, or government actions. These circumstances provide a shield for Aces AI against unforeseen events that prevent it from fulfilling its service obligations.</p>

                <p className="font-semibold mb-1">10.3 Changes</p>
                <p className="mb-4">Aces AI acknowledges that its service is an evolving, subscription-based product. To enhance customer experience, Aces AI reserves the right to make modifications to the Service. However, Aces AI commits to not materially reducing the core functionality provided to Customers. Furthermore, Aces AI may modify the terms of this Agreement unilaterally, provided that Customers are notified at least thirty (30) days before such changes take effect, with changes posted prominently, for example, on the Aces AI website terms page.</p>

                <p className="font-semibold mb-1">10.4 Relationship of the Parties</p>
                <p className="mb-4">This Agreement does not create a partnership, franchise, joint venture, agency, fiduciary, or employment relationship between Aces AI and the Customer. Both parties are independent contractors, maintaining their respective operations and autonomy while cooperating under the terms laid out in this Agreement.</p>

                <p className="font-semibold mb-1">10.5 No Third-Party Beneficiaries</p>
                <p className="mb-4">This Agreement is strictly between Aces AI and the Customer. It is not intended to benefit any third party, nor shall any third party have the right to enforce any of its terms, directly or indirectly. This clause clarifies the intended scope of the Agreement, limiting obligations and benefits to the parties involved.</p>

                <p className="font-semibold mb-1">10.6 Email Communications</p>
                <p className="mb-4">Notices under this Agreement will be communicated via email, although Aces AI may choose to provide notices through the Service instead. Notices to Aces AI must be directed to a designated Aces AI email, while notices to Customers will be sent to the email addresses provided by them through the Service. Notices are considered delivered the next business day after emailing or the same day if provided through the Service.</p>

                <p className="font-semibold mb-1">10.7 Amendment and Waivers</p>
                <p className="mb-4">No modifications to this Agreement will be effective unless in writing and signed or acknowledged by authorized representatives of both parties. Neither party's delay or failure to exercise any right under this Agreement will be deemed a waiver of that right. Waivers must also be in writing and signed by the party granting the waiver.</p>

                <p className="font-semibold mb-1">10.8 Severability</p>
                <p className="mb-4">Should any provision of this Agreement be found unlawful or unenforceable by a court, it will be modified to the minimum extent necessary to make it lawful or enforceable, while the remaining provisions continue in full effect. This clause ensures the Agreement remains operational even if parts of it are modified or removed.</p>

                <p className="font-semibold mb-1">10.9 Assignment</p>
                <p className="mb-4">Neither party may assign or delegate their rights or obligations under this Agreement without the other party's prior written consent, except that Aces AI may do so without consent in cases of mergers, acquisitions, corporate reorganizations, or sales of substantially all assets. Any unauthorized assignment will be void. This Agreement binds and benefits the parties, their successors, and permitted assigns.</p>

                <p className="font-semibold mb-1">10.10 Governing Law and Venue</p>
                <p className="mb-4">This Agreement will be governed by the laws of Dubai, United Arab Emirates, excluding its conflict of laws principles. Disputes arising under this Agreement will be resolved in the courts of Dubai, United Arab Emirates, to which both parties consent to jurisdiction and venue. There is a waiver of any right to a jury trial for disputes arising under this Agreement. The prevailing party in any enforcement action is entitled to recover its reasonable costs and attorney fees.</p>

                <p className="font-semibold mb-1">10.11 Entire Agreement</p>
                <p className="mb-4">This Agreement, including any referenced documents and Orders, constitutes the full agreement between Aces AI and the Customer, superseding all prior discussions, agreements, and understandings of any nature. This ensures clarity and completeness in the mutual expectations and obligations of the parties involved.</p>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 text-right shrink-0">
            <Button 
              onClick={() => setShowTermsModal(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 cursor-pointer"
            >
              I Understand
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Privacy Modal */}
      <Dialog open={showPrivacyModal} onOpenChange={setShowPrivacyModal}>
        <DialogContent className="max-w-4xl h-[85vh] flex flex-col bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-2xl rounded-xl p-6">
          <DialogHeader className="pb-4 shrink-0 space-y-2">
            <DialogTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Privacy Policy</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              How we collect, use, and protect your data.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 min-h-0 relative">
            <div className="absolute inset-0 overflow-y-auto rounded-lg border border-blue-200 dark:border-blue-900/30 bg-gray-50/50 dark:bg-gray-800/50 p-6 shadow-sm scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
              <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                <p className="font-semibold uppercase tracking-wider mb-4 text-xs text-gray-400">Last Updated: January 13, 2026</p>

                <p className="mb-4">
                  At Aces AI, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy describes how we collect, use, store, and share your data when you use our cloud-based artificial intelligence service.
                </p>

                <h3 className="text-gray-900 dark:text-gray-100 font-bold mt-6 mb-2">1. Information We Collect</h3>
                <p className="font-semibold mb-1">1.1 Account Information</p>
                <p className="mb-4">When you create an account, we collect your name, email address, company name, and payment information. This information is necessary to provide you with access to our Service.</p>

                <p className="font-semibold mb-1">1.2 Usage Data</p>
                <p className="mb-4">We automatically collect information about how you interact with our Service, including pages visited, features used, time spent, and actions taken within the platform.</p>

                <p className="font-semibold mb-1">1.3 User Submissions</p>
                <p className="mb-4">Any content you upload, configure, or create within the Service, including AI training data, chat configurations, and business documents, is stored securely on our servers.</p>

                <p className="font-semibold mb-1">1.4 Technical Data</p>
                <p className="mb-4">We collect technical information such as your IP address, browser type, operating system, device information, and referring URLs to improve our Service and ensure security.</p>

                <h3 className="text-gray-900 dark:text-gray-100 font-bold mt-6 mb-2">2. How We Use Your Information</h3>
                <p className="mb-4">We use collected information to: (a) provide, maintain, and improve our Service; (b) process transactions and send related information; (c) send technical notices, updates, and support messages; (d) respond to your comments and questions; (e) monitor and analyze usage patterns; (f) detect, prevent, and address technical issues and security threats; (g) comply with legal obligations.</p>

                <h3 className="text-gray-900 dark:text-gray-100 font-bold mt-6 mb-2">3. Data Storage and Security</h3>
                <p className="mb-4">Your data is stored on secure servers with industry-standard encryption. We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.</p>

                <h3 className="text-gray-900 dark:text-gray-100 font-bold mt-6 mb-2">4. Data Sharing</h3>
                <p className="mb-4">We do not sell your personal information. We may share your data with: (a) service providers who assist in operating our Service; (b) law enforcement when required by law; (c) business partners with your consent; (d) in connection with a merger, acquisition, or sale of assets. All third-party service providers are contractually obligated to protect your data.</p>

                <h3 className="text-gray-900 dark:text-gray-100 font-bold mt-6 mb-2">5. Your Rights</h3>
                <p className="mb-4">You have the right to: (a) access your personal data; (b) correct inaccurate data; (c) request deletion of your data; (d) object to processing of your data; (e) request data portability; (f) withdraw consent at any time. To exercise these rights, contact us at privacy@aces.ai.</p>

                <h3 className="text-gray-900 dark:text-gray-100 font-bold mt-6 mb-2">6. Cookies and Tracking</h3>
                <p className="mb-4">We use cookies and similar tracking technologies to enhance your experience. You can control cookie preferences through your browser settings. Essential cookies are required for the Service to function properly.</p>

                <h3 className="text-gray-900 dark:text-gray-100 font-bold mt-6 mb-2">7. Data Retention</h3>
                <p className="mb-4">We retain your data for as long as your account is active or as needed to provide the Service. Upon account deletion or termination, we will delete your data within 30 days, unless retention is required by law or for legitimate business purposes.</p>

                <h3 className="text-gray-900 dark:text-gray-100 font-bold mt-6 mb-2">8. International Data Transfers</h3>
                <p className="mb-4">Your data may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for international data transfers in compliance with applicable data protection laws.</p>

                <h3 className="text-gray-900 dark:text-gray-100 font-bold mt-6 mb-2">9. Children's Privacy</h3>
                <p className="mb-4">Our Service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected data from a child, we will take steps to delete it promptly.</p>

                <h3 className="text-gray-900 dark:text-gray-100 font-bold mt-6 mb-2">10. Changes to This Policy</h3>
                <p className="mb-4">We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the "Last Updated" date. Your continued use of the Service after changes constitutes acceptance of the updated policy.</p>

                <h3 className="text-gray-900 dark:text-gray-100 font-bold mt-6 mb-2">11. Contact Us</h3>
                <p className="mb-4">If you have questions about this Privacy Policy or our data practices, please contact us at: privacy@aces.ai or through the support channels available within the Service.</p>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 text-right shrink-0">
            <Button 
              onClick={() => setShowPrivacyModal(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 cursor-pointer"
            >
              I Understand
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}