import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service",
    description:
        "The terms that govern your use of the UBC Thai Aiyara website and membership services.",
};

export default function TermsPage() {
    return (
        <main className="subpage">
            <section className="section">
                <span className="section-label">Legal</span>
                <h2>Terms of Service</h2>
                <div className="page-prose">
                    <p className="legal-updated">Last updated: July 12, 2026</p>

                    <p>
                        These Terms of Service (the Terms) govern your access to
                        and use of the UBC Thai Aiyara website and membership
                        services (the Service). By using the Service, you agree
                        to these Terms. If you do not agree, please do not use
                        the Service.
                    </p>

                    <h3>About us</h3>
                    <p>
                        UBC Thai Aiyara is a student club under the Alma Mater
                        Society (AMS) at the University of British Columbia. The
                        Service is operated by the club executive team on a
                        volunteer basis.
                    </p>

                    <h3>Eligibility</h3>
                    <p>
                        The Service is intended for UBC students and members of
                        the wider UBC community who are interested in Thai
                        culture. You must be able to form a binding agreement to
                        create an account. If you are under the age of majority
                        in your province, you may use the Service only with the
                        involvement of a parent or guardian.
                    </p>

                    <h3>Accounts and membership</h3>
                    <ul>
                        <li>
                            You are responsible for the information you provide
                            when you register, and for keeping it accurate and up
                            to date.
                        </li>
                        <li>
                            You are responsible for activity that happens under
                            your account, and for keeping your login credentials
                            secure.
                        </li>
                        <li>
                            You may sign in using your email address or a third
                            party sign in provider such as Google. Your use of
                            that provider is subject to their own terms.
                        </li>
                        <li>
                            Membership is offered for community participation. We
                            may update membership benefits from time to time.
                        </li>
                    </ul>

                    <h3>Membership pass</h3>
                    <p>
                        We may provide a digital membership pass that you can add
                        to Apple Wallet or a similar app. The pass is for
                        identification at club events and activities. Please do
                        not share your pass with others or use a pass that is not
                        yours.
                    </p>

                    <h3>Acceptable use</h3>
                    <p>When using the Service, you agree not to:</p>
                    <ul>
                        <li>
                            Break any applicable law, AMS policy, or UBC policy.
                        </li>
                        <li>
                            Harass, threaten, or harm other members or the
                            community.
                        </li>
                        <li>
                            Attempt to access accounts, data, or systems that are
                            not yours.
                        </li>
                        <li>
                            Interfere with or disrupt the Service, or attempt to
                            bypass its security.
                        </li>
                        <li>
                            Use the Service to send spam or to impersonate another
                            person or organization.
                        </li>
                    </ul>

                    <h3>Events and activities</h3>
                    <p>
                        The Service may share information about club events.
                        Attendance is voluntary and at your own risk. You agree
                        to follow any rules or instructions provided at an event.
                    </p>

                    <h3>Intellectual property</h3>
                    <p>
                        The UBC Thai Aiyara name, logo, and content on the Service
                        are owned by the club or its licensors. You may not copy,
                        modify, or distribute them without permission, except as
                        allowed by law.
                    </p>

                    <h3>Third party services</h3>
                    <p>
                        The Service relies on third party providers for hosting,
                        authentication, and data storage. We are not responsible
                        for the availability or practices of those providers, and
                        their services are subject to their own terms.
                    </p>

                    <h3>Disclaimers</h3>
                    <p>
                        The Service is provided as it is and as available,
                        without warranties of any kind, whether express or
                        implied. We do not guarantee that the Service will be
                        uninterrupted, error free, or secure.
                    </p>

                    <h3>Limitation of liability</h3>
                    <p>
                        To the fullest extent permitted by law, UBC Thai Aiyara
                        and its executives, members, and volunteers will not be
                        liable for any indirect, incidental, or consequential
                        damages arising from your use of the Service.
                    </p>

                    <h3>Changes to the Service and these Terms</h3>
                    <p>
                        We may change or discontinue the Service, and we may
                        update these Terms, at any time. If we make material
                        changes, we will update the date at the top of this page.
                        Your continued use of the Service after changes take
                        effect means you accept the updated Terms.
                    </p>

                    <h3>Termination</h3>
                    <p>
                        We may suspend or remove your account if you break these
                        Terms or if we need to protect the Service or the
                        community. You may stop using the Service and request that
                        your account be deleted at any time.
                    </p>

                    <h3>Governing law</h3>
                    <p>
                        These Terms are governed by the laws of the Province of
                        British Columbia and the applicable laws of Canada,
                        without regard to conflict of law rules.
                    </p>

                    <h3>Contact</h3>
                    <p>
                        If you have questions about these Terms, contact us at{" "}
                        <a href="mailto:contact@ubcthaiaiyara.com">
                            contact@ubcthaiaiyara.com
                        </a>
                        .
                    </p>
                </div>
            </section>
        </main>
    );
}
