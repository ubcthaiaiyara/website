import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description:
        "How UBC Thai Aiyara collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
    return (
        <main className="subpage">
            <section className="section">
                <span className="section-label">Legal</span>
                <h2>Privacy Policy</h2>
                <div className="page-prose">
                    <p className="legal-updated">Last updated: July 12, 2026</p>

                    <p>
                        This Privacy Policy explains how UBC Thai Aiyara (we, us,
                        or our) collects, uses, and protects your personal
                        information when you use our website and membership
                        services (the Service).
                    </p>

                    <h3>Information we collect</h3>
                    <p>We collect the following types of information:</p>
                    <ul>
                        <li>
                            Account information, such as your name and email
                            address, which you provide when you sign up.
                        </li>
                        <li>
                            Sign in information from a third party provider such
                            as Google, if you choose to sign in that way. We
                            receive basic profile details like your name and
                            email address.
                        </li>
                        <li>
                            Membership details related to your participation in
                            the club and its events.
                        </li>
                        <li>
                            Technical information, such as your device type and
                            general usage data, collected automatically to help
                            us keep the Service working and to understand
                            performance.
                        </li>
                    </ul>

                    <h3>How we use your information</h3>
                    <p>We use your information to:</p>
                    <ul>
                        <li>Create and manage your account and membership.</li>
                        <li>
                            Provide your membership pass and event information.
                        </li>
                        <li>
                            Communicate with you about club activities and
                            updates.
                        </li>
                        <li>
                            Keep the Service secure and improve how it works.
                        </li>
                        <li>
                            Meet legal, AMS, or UBC requirements where they apply.
                        </li>
                    </ul>

                    <h3>How we share your information</h3>
                    <p>
                        We do not sell your personal information. We share it
                        only in these situations:
                    </p>
                    <ul>
                        <li>
                            With service providers who help us run the Service,
                            such as hosting, authentication, and database
                            providers, and only to the extent needed for them to
                            perform their work.
                        </li>
                        <li>
                            With the AMS or UBC where required for club operations
                            or by policy.
                        </li>
                        <li>
                            Where required by law, or to protect the rights,
                            safety, and property of the club, its members, or
                            others.
                        </li>
                    </ul>

                    <h3>Third party services</h3>
                    <p>
                        We rely on trusted third party services to operate the
                        Service, which may include Supabase for authentication
                        and data storage, Google for optional sign in, Vercel for
                        hosting and performance monitoring, and Apple Wallet for
                        the membership pass. These providers process information
                        under their own privacy policies.
                    </p>

                    <h3>Data retention</h3>
                    <p>
                        We keep your personal information for as long as your
                        account is active or as needed to provide the Service.
                        When it is no longer needed, we take steps to delete or
                        anonymize it, unless we are required to keep it for legal
                        reasons.
                    </p>

                    <h3>Data security</h3>
                    <p>
                        We take reasonable steps to protect your information from
                        loss, misuse, and unauthorized access. No method of
                        storage or transmission is completely secure, so we cannot
                        guarantee absolute security.
                    </p>

                    <h3>Your choices and rights</h3>
                    <p>
                        You may access, update, or request deletion of your
                        account information by contacting us. Depending on your
                        location, you may have additional rights under privacy
                        laws such as the Personal Information Protection Act of
                        British Columbia. To exercise your rights, contact us
                        using the details below.
                    </p>

                    <h3>Children</h3>
                    <p>
                        The Service is intended for university students and
                        adults. We do not knowingly collect personal information
                        from children. If you believe a child has provided us
                        with information, please contact us so we can remove it.
                    </p>

                    <h3>Where your information is stored</h3>
                    <p>
                        Our service providers may store and process information on
                        servers located in Canada, the United States, or other
                        countries. By using the Service, you understand that your
                        information may be processed outside your province or
                        country.
                    </p>

                    <h3>Changes to this policy</h3>
                    <p>
                        We may update this Privacy Policy from time to time. If we
                        make material changes, we will update the date at the top
                        of this page. Your continued use of the Service after
                        changes take effect means you accept the updated policy.
                    </p>

                    <h3>Contact</h3>
                    <p>
                        If you have questions about this Privacy Policy or your
                        personal information, contact us at{" "}
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
