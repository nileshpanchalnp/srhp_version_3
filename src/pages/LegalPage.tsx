import { motion, useScroll, useSpring } from 'framer-motion';
import { MaskText } from '../components/motion/MaskText';
import { EASE } from '../motion/language';

interface LegalPageProps {
  type: 'terms' | 'privacy';
}

export const LegalPage = ({ type }: LegalPageProps) => {
  const isTerms = type === 'terms';
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  return (
    <main id="main" className="on-paper min-h-screen bg-paper px-5 pb-28 pt-36 text-ink md:px-8 md:pt-44">
      {/* reading progress */}
      <motion.div aria-hidden className="fixed inset-x-0 top-0 z-[99] h-[2px] origin-left bg-gilt" style={{ scaleX: progress }} />

      <article className="mx-auto max-w-[44rem]">
        {/* HEADER */}
        <header className="mb-16 border-b border-ink/70 pb-10">
          <MaskText
            as="h1"
            text={isTerms ? 'Terms & Conditions' : 'Privacy Policy'}
            trigger="mount"
            className="mb-8 font-display text-[clamp(2.6rem,8vw,5.2rem)] font-light leading-[1] tracking-[-0.02em] text-ink"
          />
          <motion.p
            className="label text-[0.75rem] tracking-[0.3em] text-soft"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.5, duration: 0.8, ease: EASE.out } }}
          >
            Last Updated: May 12, 2026
          </motion.p>
        </header>

        {/* CONTENT */}
        <div className="legal-body space-y-8 text-[1.02rem] font-light leading-[1.85] text-soft">

        {isTerms ? (
          <>
            <p className="font-display text-2xl italic leading-snug text-ink">
              Please read these terms and conditions carefully before using Our Service.
            </p>

            {/* 1 */}
            <section className="scroll-mt-28">
              <h2 className="font-display text-3xl font-medium text-ink md:text-4xl mt-16 mb-6">Interpretation and Definitions</h2>
              <h3 className="font-display text-2xl font-medium text-ink mb-3">Interpretation</h3>
              <p>The words whose initial letters are capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>

              <h3 className="font-display text-2xl font-medium text-ink mt-8 mb-3">Definitions</h3>
              <p className="mb-3">For the purposes of these Terms and Conditions:</p>
              <ul className="list-disc pl-6 marker:text-gilt space-y-3 text-[0.95rem]">
                <li><strong className="font-semibold text-ink">Affiliate</strong> means an entity that controls, is controlled by, or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.</li>
                <li><strong className="font-semibold text-ink">Country</strong> refers to: Maharashtra, India.</li>
                <li><strong className="font-semibold text-ink">Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in these Terms and Conditions) refers to SRHP Films.</li>
                <li><strong className="font-semibold text-ink">Device</strong> means any device that can access the Service such as a computer, a cell phone or a digital tablet.</li>
                <li><strong className="font-semibold text-ink">Service</strong> refers to the Website.</li>
                <li><strong className="font-semibold text-ink">Terms and Conditions</strong> (also referred to as "Terms") means these Terms and Conditions that form the entire agreement between You and the Company regarding the use of the Service.</li>
                <li><strong className="font-semibold text-ink">Third-Party Social Media Service</strong> means any services or content provided by a third party that is displayed, included, or linked to through the Service.</li>
                <li><strong className="font-semibold text-ink">Website</strong> refers to SRHP Films, accessible from <a href="https://srhpfilms.com/" target="_blank" rel="noopener noreferrer" className="text-gilt underline decoration-gilt/40 underline-offset-4 transition-colors hover:decoration-gilt">https://srhpfilms.com/</a></li>
                <li><strong className="font-semibold text-ink">You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service.</li>
              </ul>
            </section>

            {/* 2 */}
            <section className="scroll-mt-28">
              <h2 className="font-display text-3xl font-medium text-ink md:text-4xl mt-16 mb-6">Acknowledgment</h2>
              <p>These are the Terms and Conditions governing the use of this Service and the agreement between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.</p>
              <p className="mt-4">Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.</p>
              <p className="mt-4">By accessing or using the Service You agree to be bound by these Terms and Conditions. If You disagree with any part of these Terms and Conditions then You may not access the Service.</p>
              <p className="mt-4">You represent that you are over the age of 18. The Company does not permit those under 18 to use the Service.</p>
              <p className="mt-4">Your access to and use of the Service is also subject to Our Privacy Policy, which describes how We collect, use, and disclose personal information. Please read Our Privacy Policy carefully before using Our Service.</p>
            </section>

            {/* 3 */}
            <section className="scroll-mt-28">
              <h2 className="font-display text-3xl font-medium text-ink md:text-4xl mt-16 mb-6">Links to Other Websites</h2>
              <p>Our Service may contain links to third-party websites or services that are not owned or controlled by the Company.</p>
              <p className="mt-4">The Company has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You further acknowledge and agree that the Company shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods or services available on or through any such websites or services.</p>
              <p className="mt-4">We strongly advise You to read the terms and conditions and privacy policies of any third-party websites or services that You visit.</p>

              <h3 className="font-display text-2xl font-medium text-ink mt-8 mb-3">Links from a Third-Party Social Media Service</h3>
              <p>The Service may display, include, make available, or link to content or services provided by a Third-Party Social Media Service. A Third-Party Social Media Service is not owned or controlled by the Company, and the Company does not endorse or assume responsibility for any Third-Party Social Media Service.</p>
              <p className="mt-4">You acknowledge and agree that the Company shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with Your access to or use of any Third-Party Social Media Service. Your use of any Third-Party Social Media Service is governed by that service's own terms and privacy policies.</p>
            </section>

            {/* 4 */}
            <section className="scroll-mt-28">
              <h2 className="font-display text-3xl font-medium text-ink md:text-4xl mt-16 mb-6">Termination</h2>
              <p>We may terminate or suspend Your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach these Terms and Conditions.</p>
              <p className="mt-4">Upon termination, Your right to use the Service will cease immediately.</p>
            </section>

            {/* 5 */}
            <section className="scroll-mt-28">
              <h2 className="font-display text-3xl font-medium text-ink md:text-4xl mt-16 mb-6">Limitation of Liability</h2>
              <p>Notwithstanding any damages that You might incur, the entire liability of the Company and any of its suppliers under any provision of these Terms and Your exclusive remedy for all of the foregoing shall be limited to the amount actually paid by You through the Service or 100 USD if You haven't purchased anything through the Service.</p>
              <p className="mt-4">To the maximum extent permitted by applicable law, in no event shall the Company or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever (including, but not limited to, damages for loss of profits, loss of data or other information, for business interruption, for personal injury, loss of privacy arising out of or in any way related to the use of or inability to use the Service, third-party software and/or third-party hardware used with the Service, or otherwise in connection with any provision of these Terms), even if the Company or any supplier has been advised of the possibility of such damages and even if the remedy fails of its essential purpose.</p>
              <p className="mt-4">Some states do not allow the exclusion of implied warranties or limitation of liability for incidental or consequential damages, which means that some of the above limitations may not apply. In these states, each party's liability will be limited to the greatest extent permitted by law.</p>
            </section>

            {/* 6 */}
            <section className="scroll-mt-28">
              <h2 className="font-display text-3xl font-medium text-ink md:text-4xl mt-16 mb-6">"AS IS" and "AS AVAILABLE" Disclaimer</h2>
              <p>The Service is provided to You "AS IS" and "AS AVAILABLE" and with all faults and defects without warranty of any kind. To the maximum extent permitted under applicable law, the Company expressly disclaims all warranties, whether express, implied, statutory or otherwise, with respect to the Service, including all implied warranties of merchantability, fitness for a particular purpose, title and non-infringement.</p>
              <p className="mt-4">Without limiting the foregoing, neither the Company nor any of the company's providers makes any representation or warranty of any kind, express or implied: (i) as to the operation or availability of the Service; (ii) that the Service will be uninterrupted or error-free; (iii) as to the accuracy, reliability, or currency of any information provided through the Service; or (iv) that the Service is free of viruses, scripts, trojan horses, worms, malware, timebombs or other harmful components.</p>
            </section>

            {/* 7 */}
            <section className="scroll-mt-28">
              <h2 className="font-display text-3xl font-medium text-ink md:text-4xl mt-16 mb-6">Governing Law</h2>
              <p>The laws of the Country (India), excluding its conflicts of law rules, shall govern these Terms and Your use of the Service. Your use of the Application may also be subject to other local, state, national, or international laws.</p>
            </section>

            {/* 8 */}
            <section className="scroll-mt-28">
              <h2 className="font-display text-3xl font-medium text-ink md:text-4xl mt-16 mb-6">Disputes Resolution</h2>
              <p>If You have any concern or dispute about the Service, You agree to first try to resolve the dispute informally by contacting the Company.</p>
            </section>

            {/* 9 */}
            <section className="scroll-mt-28">
              <h2 className="font-display text-3xl font-medium text-ink md:text-4xl mt-16 mb-6">For European Union (EU) Users</h2>
              <p>If You are a European Union consumer, you will benefit from any mandatory provisions of the law of the country in which You are resident.</p>
            </section>

            {/* 10 */}
            <section className="scroll-mt-28">
              <h2 className="font-display text-3xl font-medium text-ink md:text-4xl mt-16 mb-6">United States Legal Compliance</h2>
              <p>You represent and warrant that (i) You are not located in a country that is subject to the United States government embargo, or that has been designated as a "terrorist supporting" country, and (ii) You are not listed on any United States government list of prohibited or restricted parties.</p>
            </section>

            {/* 11 */}
            <section className="scroll-mt-28">
              <h2 className="font-display text-3xl font-medium text-ink md:text-4xl mt-16 mb-6">Severability and Waiver</h2>
              <h3 className="font-display text-2xl font-medium text-ink mb-3">Severability</h3>
              <p>If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law and the remaining provisions will continue in full force and effect.</p>
              <h3 className="font-display text-2xl font-medium text-ink mt-8 mb-3">Waiver</h3>
              <p>Except as provided herein, the failure to exercise a right or to require performance of an obligation under these Terms shall not affect a party's ability to exercise such right or require such performance at any time thereafter nor shall the waiver of a breach constitute a waiver of any subsequent breach.</p>
            </section>

            {/* 12 */}
            <section className="scroll-mt-28">
              <h2 className="font-display text-3xl font-medium text-ink md:text-4xl mt-16 mb-6">Translation Interpretation</h2>
              <p>These Terms and Conditions may have been translated if We have made them available to You on our Service. You agree that the original English text shall prevail in the case of a dispute.</p>
            </section>

            {/* 13 */}
            <section className="scroll-mt-28">
              <h2 className="font-display text-3xl font-medium text-ink md:text-4xl mt-16 mb-6">Changes to These Terms and Conditions</h2>
              <p>We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. If a revision is material We will make reasonable efforts to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at Our sole discretion.</p>
              <p className="mt-4">By continuing to access or use Our Service after those revisions become effective, You agree to be bound by the revised terms. If You do not agree to the new terms, in whole or in part, please stop using the Service.</p>
            </section>

            {/* Contact */}
            <section className="mt-16 border border-ink/20 bg-ivory p-8">
              <h2 className="font-display text-2xl font-medium text-ink mb-4">Contact Us</h2>
              <p>If you have any questions about these Terms and Conditions, You can contact us:</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>By email: <a href="mailto:sandip@srhpfilms.com" className="text-gilt underline decoration-gilt/40 underline-offset-4 transition-colors hover:decoration-gilt">sandip@srhpfilms.com</a></li>
                <li>By visiting: <a href="https://srhpfilms.com/" target="_blank" rel="noopener noreferrer" className="text-gilt underline decoration-gilt/40 underline-offset-4 transition-colors hover:decoration-gilt">https://srhpfilms.com/</a></li>
              </ul>
            </section>
          </>

        ) : (

          <>
            <p className="font-display text-2xl italic leading-snug text-ink">
              This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
            </p>
            <p className="mt-4">We use Your Personal Data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.</p>

            {/* 1 */}
            <section className="scroll-mt-28">
              <h2 className="font-display text-3xl font-medium text-ink md:text-4xl mt-16 mb-6">Interpretation and Definitions</h2>
              <h3 className="font-display text-2xl font-medium text-ink mb-3">Interpretation</h3>
              <p>The words whose initial letters are capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>

              <h3 className="font-display text-2xl font-medium text-ink mt-8 mb-3">Definitions</h3>
              <p className="mb-3">For the purposes of this Privacy Policy:</p>
              <ul className="list-disc pl-6 marker:text-gilt space-y-3 text-[0.95rem]">
                <li><strong className="font-semibold text-ink">Account</strong> means a unique account created for You to access our Service or parts of our Service.</li>
                <li><strong className="font-semibold text-ink">Affiliate</strong> means an entity that controls, is controlled by, or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.</li>
                <li><strong className="font-semibold text-ink">Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Privacy Policy) refers to SRHP Films.</li>
                <li><strong className="font-semibold text-ink">Cookies</strong> are small files that are placed on Your computer, mobile device or any other device by a website, containing the details of Your browsing history on that website among its many uses.</li>
                <li><strong className="font-semibold text-ink">Country</strong> refers to: Maharashtra, India.</li>
                <li><strong className="font-semibold text-ink">Device</strong> means any device that can access the Service such as a computer, a cell phone or a digital tablet.</li>
                <li><strong className="font-semibold text-ink">Personal Data</strong> (or "Personal Information") is any information that relates to an identified or identifiable individual. We use "Personal Data" and "Personal Information" interchangeably unless a law uses a specific term.</li>
                <li><strong className="font-semibold text-ink">Service</strong> refers to the Website.</li>
                <li><strong className="font-semibold text-ink">Service Provider</strong> means any natural or legal person who processes the data on behalf of the Company. It refers to third-party companies or individuals employed by the Company to facilitate the Service or assist the Company in analyzing how the Service is used.</li>
                <li><strong className="font-semibold text-ink">Usage Data</strong> refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself.</li>
                <li><strong className="font-semibold text-ink">Website</strong> refers to SRHP Films, accessible from <a href="https://srhpfilms.com/" target="_blank" rel="noopener noreferrer" className="text-gilt underline decoration-gilt/40 underline-offset-4 transition-colors hover:decoration-gilt">https://srhpfilms.com/</a></li>
                <li><strong className="font-semibold text-ink">You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service.</li>
              </ul>
            </section>

            {/* 2 */}
            <section className="scroll-mt-28">
              <h2 className="font-display text-3xl font-medium text-ink md:text-4xl mt-16 mb-6">Collecting and Using Your Personal Data</h2>
              <h3 className="font-display text-2xl font-medium text-ink mb-3">Types of Data Collected</h3>

              <h4 className="label text-[0.8rem] text-gilt mt-7 mb-3">Personal Data</h4>
              <p>While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:</p>
              <ul className="list-disc pl-6 marker:text-gilt mt-3 space-y-1 text-[0.95rem]">
                <li>Email address</li>
                <li>First name and last name</li>
                <li>Phone number</li>
              </ul>

              <h4 className="label text-[0.8rem] text-gilt mt-8 mb-3">Usage Data</h4>
              <p>Usage Data is collected automatically when using the Service. Usage Data may include information such as Your Device's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data.</p>
              <p className="mt-4">When You access the Service by or through a mobile device, We may collect certain information automatically, including, but not limited to, the type of mobile device You use, Your mobile device unique ID, the IP address of Your mobile device, Your mobile operating system, the type of mobile Internet browser You use, unique device identifiers and other diagnostic data.</p>

              <h4 className="label text-[0.8rem] text-gilt mt-8 mb-3">Tracking Technologies and Cookies</h4>
              <p>We use Cookies and similar tracking technologies to track the activity on Our Service and store certain information. Tracking technologies We use include beacons, tags, and scripts to collect and track information and to improve and analyze Our Service. The technologies We use may include:</p>
              <ul className="list-disc pl-6 marker:text-gilt mt-3 space-y-3 text-[0.95rem]">
                <li><strong className="font-semibold text-ink">Cookies or Browser Cookies.</strong> A cookie is a small file placed on Your Device. You can instruct Your browser to refuse all Cookies or to indicate when a Cookie is being sent. However, if You do not accept Cookies, You may not be able to use some parts of our Service.</li>
                <li><strong className="font-semibold text-ink">Web Beacons.</strong> Certain sections of our Service and our emails may contain small electronic files known as web beacons (also referred to as clear gifs, pixel tags, and single-pixel gifs) that permit the Company to count users who have visited those pages or opened an email and for other related website statistics.</li>
              </ul>
              <p className="mt-4">Cookies can be "Persistent" or "Session" Cookies. Persistent Cookies remain on Your personal computer or mobile device when You go offline, while Session Cookies are deleted as soon as You close Your web browser.</p>
              <p className="mt-4">Where required by law, we use non-essential cookies only with Your consent. You can withdraw or change Your consent at any time using Your browser or device settings.</p>

              <p className="mt-4 mb-3">We use both Session and Persistent Cookies for the purposes set out below:</p>
              <ul className="list-disc pl-6 marker:text-gilt space-y-4 text-[0.95rem]">
                <li>
                  <strong className="font-semibold text-ink">Necessary / Essential Cookies</strong>
                  <p className="mt-1">Type: Session Cookies — Administered by: Us</p>
                  <p className="mt-1">Purpose: These Cookies are essential to provide You with services available through the Website and to enable You to use some of its features. They help to authenticate users and prevent fraudulent use of user accounts.</p>
                </li>
                <li>
                  <strong className="font-semibold text-ink">Cookies Policy / Notice Acceptance Cookies</strong>
                  <p className="mt-1">Type: Persistent Cookies — Administered by: Us</p>
                  <p className="mt-1">Purpose: These Cookies identify if users have accepted the use of cookies on the Website.</p>
                </li>
                <li>
                  <strong className="font-semibold text-ink">Functionality Cookies</strong>
                  <p className="mt-1">Type: Persistent Cookies — Administered by: Us</p>
                  <p className="mt-1">Purpose: These Cookies allow Us to remember choices You make when You use the Website, such as remembering your login details or language preference.</p>
                </li>
              </ul>

              <h3 className="font-display text-2xl font-medium text-ink mt-10 mb-3">Use of Your Personal Data</h3>
              <p className="mb-3">The Company may use Personal Data for the following purposes:</p>
              <ul className="list-disc pl-6 marker:text-gilt space-y-3 text-[0.95rem]">
                <li><strong className="font-semibold text-ink">To provide and maintain our Service</strong>, including to monitor the usage of our Service.</li>
                <li><strong className="font-semibold text-ink">To manage Your Account:</strong> to manage Your registration as a user of the Service.</li>
                <li><strong className="font-semibold text-ink">For the performance of a contract:</strong> the development, compliance and undertaking of the purchase contract for the products, items or services You have purchased or of any other contract with Us through the Service.</li>
                <li><strong className="font-semibold text-ink">To contact You:</strong> To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication regarding updates or informative communications related to the functionalities, products or contracted services, including security updates.</li>
                <li><strong className="font-semibold text-ink">To provide You</strong> with news, special offers, and general information about other goods, services and events which We offer that are similar to those that you have already purchased or inquired about.</li>
                <li><strong className="font-semibold text-ink">To manage Your requests:</strong> To attend and manage Your requests to Us.</li>
                <li><strong className="font-semibold text-ink">For business transfers:</strong> We may use Your Personal Data to evaluate or conduct a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of Our assets.</li>
                <li><strong className="font-semibold text-ink">For other purposes:</strong> We may use Your information for other purposes, such as data analysis, identifying usage trends, determining the effectiveness of our promotional campaigns and to evaluate and improve our Service.</li>
              </ul>

              <p className="mt-6 mb-3">We may share Your Personal Data in the following situations:</p>
              <ul className="list-disc pl-6 marker:text-gilt space-y-3 text-[0.95rem]">
                <li><strong className="font-semibold text-ink">With Service Providers:</strong> We may share Your Personal Data with Service Providers to monitor and analyze the use of our Service, to contact You.</li>
                <li><strong className="font-semibold text-ink">For business transfers:</strong> We may share or transfer Your Personal Data in connection with, or during negotiations of, any merger, sale of Company assets, financing, or acquisition of all or a portion of Our business to another company.</li>
                <li><strong className="font-semibold text-ink">With Affiliates:</strong> We may share Your Personal Data with Our affiliates, in which case we will require those affiliates to honor this Privacy Policy.</li>
                <li><strong className="font-semibold text-ink">With business partners:</strong> We may share Your Personal Data with Our business partners to offer You certain products, services or promotions.</li>
                <li><strong className="font-semibold text-ink">With other users:</strong> when You share Personal Data or otherwise interact in the public areas with other users, such information may be viewed by all users and may be publicly distributed outside.</li>
                <li><strong className="font-semibold text-ink">With Your consent:</strong> We may disclose Your Personal Data for any other purpose with Your consent.</li>
              </ul>
            </section>

            {/* 3 */}
            <section className="scroll-mt-28">
              <h2 className="font-display text-3xl font-medium text-ink md:text-4xl mt-16 mb-6">Retention of Your Personal Data</h2>
              <p>The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use Your Personal Data to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our legal agreements and policies.</p>
              <p className="mt-4">We apply different retention periods to different categories of Personal Data based on the purpose of processing and legal obligations:</p>
              <ul className="list-disc pl-6 marker:text-gilt mt-3 space-y-3 text-[0.95rem]">
                <li><strong className="font-semibold text-ink">Account Information:</strong> User Accounts retained for the duration of your account relationship plus up to 24 months after account closure.</li>
                <li><strong className="font-semibold text-ink">Customer Support Data:</strong> Support tickets and correspondence: up to 24 months from the date of ticket closure. Chat transcripts: up to 24 months for quality assurance purposes.</li>
                <li><strong className="font-semibold text-ink">Usage Data:</strong> Website analytics data (cookies, IP addresses, device identifiers): up to 24 months from the date of collection. Server logs (IP addresses, access times): up to 24 months for security monitoring.</li>
              </ul>
              <p className="mt-4">We may retain Personal Data beyond the periods stated above for legal obligations, legal claims, your explicit request, or technical limitations involving backup systems.</p>
              <p className="mt-4">When retention periods expire, We securely delete or anonymize Personal Data. In some cases, We convert Personal Data into anonymous statistical data that cannot be linked back to You and may be retained indefinitely for research and analytics.</p>
            </section>

            {/* 4 */}
            <section className="scroll-mt-28">
              <h2 className="font-display text-3xl font-medium text-ink md:text-4xl mt-16 mb-6">Transfer of Your Personal Data</h2>
              <p>Your information, including Personal Data, is processed at the Company's operating offices and in any other places where the parties involved in the processing are located. It means that this information may be transferred to — and maintained on — computers located outside of Your state, province, country or other governmental jurisdiction where the data protection laws may differ from those from Your jurisdiction.</p>
              <p className="mt-4">The Company will take all steps reasonably necessary to ensure that Your data is treated securely and in accordance with this Privacy Policy and no transfer of Your Personal Data will take place to an organization or a country unless there are adequate controls in place.</p>
            </section>

            {/* 5 */}
            <section className="scroll-mt-28">
              <h2 className="font-display text-3xl font-medium text-ink md:text-4xl mt-16 mb-6">Delete Your Personal Data</h2>
              <p>You have the right to delete or request that We assist in deleting the Personal Data that We have collected about You.</p>
              <p className="mt-4">You may update, amend, or delete Your information at any time by signing in to Your Account, if you have one, and visiting the account settings section that allows you to manage Your personal information. You may also contact Us to request access to, correct, or delete any Personal Data that You have provided to Us.</p>
              <p className="mt-4">Please note, however, that We may need to retain certain information when we have a legal obligation or lawful basis to do so.</p>
            </section>

            {/* 6 */}
            <section className="scroll-mt-28">
              <h2 className="font-display text-3xl font-medium text-ink md:text-4xl mt-16 mb-6">Disclosure of Your Personal Data</h2>
              <h3 className="font-display text-2xl font-medium text-ink mb-3">Business Transactions</h3>
              <p>If the Company is involved in a merger, acquisition or asset sale, Your Personal Data may be transferred. We will provide notice before Your Personal Data is transferred and becomes subject to a different Privacy Policy.</p>
              <h3 className="font-display text-2xl font-medium text-ink mt-8 mb-3">Law Enforcement</h3>
              <p>Under certain circumstances, the Company may be required to disclose Your Personal Data if required to do so by law or in response to valid requests by public authorities (e.g. a court or a government agency).</p>
              <h3 className="font-display text-2xl font-medium text-ink mt-8 mb-3">Other Legal Requirements</h3>
              <p className="mb-3">The Company may disclose Your Personal Data in the good faith belief that such action is necessary to:</p>
              <ul className="list-disc pl-6 marker:text-gilt space-y-2 text-[0.95rem]">
                <li>Comply with a legal obligation</li>
                <li>Protect and defend the rights or property of the Company</li>
                <li>Prevent or investigate possible wrongdoing in connection with the Service</li>
                <li>Protect the personal safety of Users of the Service or the public</li>
                <li>Protect against legal liability</li>
              </ul>
            </section>

            {/* 7 */}
            <section className="scroll-mt-28">
              <h2 className="font-display text-3xl font-medium text-ink md:text-4xl mt-16 mb-6">Security of Your Personal Data</h2>
              <p>The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially reasonable means to protect Your Personal Data, We cannot guarantee its absolute security.</p>
            </section>

            {/* 8 */}
            <section className="scroll-mt-28">
              <h2 className="font-display text-3xl font-medium text-ink md:text-4xl mt-16 mb-6">Children's Privacy</h2>
              <p>Our Service does not address anyone under the age of 16. We do not knowingly collect personally identifiable information from anyone under the age of 16. If You are a parent or guardian and You are aware that Your child has provided Us with Personal Data, please contact Us.</p>
              <p className="mt-4">If We need to rely on consent as a legal basis for processing Your information and Your country requires consent from a parent, We may require Your parent's consent before We collect and use that information.</p>
            </section>

            {/* 9 */}
            <section className="scroll-mt-28">
              <h2 className="font-display text-3xl font-medium text-ink md:text-4xl mt-16 mb-6">Links to Other Websites</h2>
              <p>Our Service may contain links to other websites that are not operated by Us. If You click on a third party link, You will be directed to that third party's site. We strongly advise You to review the Privacy Policy of every site You visit.</p>
              <p className="mt-4">We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.</p>
            </section>

            {/* 10 */}
            <section className="scroll-mt-28">
              <h2 className="font-display text-3xl font-medium text-ink md:text-4xl mt-16 mb-6">Changes to this Privacy Policy</h2>
              <p>We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page.</p>
              <p className="mt-4">We will let You know via email and/or a prominent notice on Our Service, prior to the change becoming effective and update the "Last updated" date at the top of this Privacy Policy.</p>
              <p className="mt-4">You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
            </section>

            {/* Contact */}
            <section className="mt-16 border border-ink/20 bg-ivory p-8">
              <h2 className="font-display text-2xl font-medium text-ink mb-4">Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, You can contact us:</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>By email: <a href="mailto:sandip@srhpfilms.com" className="text-gilt underline decoration-gilt/40 underline-offset-4 transition-colors hover:decoration-gilt">sandip@srhpfilms.com</a></li>
                <li>By visiting: <a href="https://srhpfilms.com/" target="_blank" rel="noopener noreferrer" className="text-gilt underline decoration-gilt/40 underline-offset-4 transition-colors hover:decoration-gilt">https://srhpfilms.com/</a></li>
              </ul>
            </section>
          </>
        )}

        </div>
      </article>
    </main>
  );
};
