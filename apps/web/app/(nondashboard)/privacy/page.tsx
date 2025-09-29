import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy • PackPal",
  description:
    "How PackPal collects, uses, shares and protects your information, with Kenya DPA 2019 and global considerations.",
};

export default function PrivacyPage() {
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold">PackPal Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <div className="mt-8 space-y-8 text-base leading-7">
        <section>
          <h2 className="text-xl font-semibold">1) Who we are & scope</h2>
          <p className="mt-2">
            PackPal is provided by <strong>Light Ideas</strong> (“<strong>we</strong>”,
            “<strong>us</strong>”, “<strong>our</strong>”). We act as the{" "}
            <strong>data controller</strong> for personal data processed through
            the PackPal Android app and website. This Policy explains how we
            collect, use, share and protect information globally, with specific
            attention to the <strong>Kenya Data Protection Act, 2019 (DPA)</strong>,
            and, where applicable, the EU/UK GDPR and other local laws.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">2) The data we collect</h2>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>
              <strong>Account & basics</strong> (if you create one): name,
              email, password (hashed), profile preferences.
            </li>
            <li>
              <strong>Trip content</strong>: trip titles, dates, notes,
              locations, collaborators, documents and photos you add.
            </li>
            <li>
              <strong>Device & usage</strong>: app version, device model,
              OS/Android version, language, time zone, crash/diagnostic data,
              and interaction events (e.g., feature use).
            </li>
            <li>
              <strong>Approximate location</strong> (if you enable location):
              to show maps, nearby places, routing, time-zone helpers. You can
              disable location in Android settings at any time.
            </li>
            <li>
              <strong>Files & camera</strong> (if you grant permission):
              used only to attach documents or photos to a trip.
            </li>
            <li>
              <strong>Payments</strong> (if you buy a plan): processed via
              Google Play; we receive limited transaction metadata (e.g., a
              confirmation token) but not your full card details.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">3) Why we use your data (lawful bases)</h2>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>
              <strong>To provide the Service</strong> and core features you
              request (contract/performance).
            </li>
            <li>
              <strong>To improve reliability & safety</strong> (legitimate
              interests) including crash diagnostics, analytics, and preventing
              abuse.
            </li>
            <li>
              <strong>With your consent</strong> for optional things like
              location services, marketing emails, or certain diagnostics. You
              can withdraw consent in-app, device settings, or via email.
            </li>
            <li>
              <strong>To comply with law</strong> (e.g., lawful requests).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">4) Sharing & processors</h2>
          <p className="mt-2">
            We use service providers to operate PackPal (e.g., cloud hosting,
            analytics/diagnostics, map and place providers, email delivery,
            optional backups). These providers act under contracts that limit
            their use of your data to our documented instructions.
          </p>
          <p className="mt-2">
            When you choose to share a trip with collaborators, we share the
            trip content you selected with those people. We may share
            aggregated, de-identified insights (which don’t identify you) for
            product improvement or research.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">5) International transfers</h2>
          <p className="mt-2">
            We operate globally and may store data in or transfer data to
            countries outside Kenya and your country of residence. Where
            required, we use appropriate safeguards (such as standard
            contractual clauses) to protect personal data during transfers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">6) Retention</h2>
          <p className="mt-2">
            We keep personal data only as long as needed for the purposes
            above—usually for as long as you have an account plus a reasonable
            period—unless a longer retention period is required by law. You can
            delete trips or your account to prompt deletion of associated data
            (subject to legal holds or backup cycles).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">7) Security</h2>
          <p className="mt-2">
            We use administrative, technical and physical safeguards appropriate
            to the nature of the data (e.g., encryption in transit, access
            controls). No method is 100% secure; you also play a role by using a
            strong password and keeping your device updated.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">
            8) Your privacy rights (Kenya & global)
          </h2>
          <p className="mt-2">
            Under the Kenya DPA 2019—and in many countries—you may have rights to:
          </p>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>be informed about how your data is used;</li>
            <li>access a copy of your personal data;</li>
            <li>correct or delete personal data where appropriate;</li>
            <li>object to or restrict certain processing;</li>
            <li>data portability where applicable; and</li>
            <li>not be subject to solely automated decisions that significantly affect you.</li>
          </ul>
          <p className="mt-2">
            If you are in the EEA/UK, GDPR rights also apply. You may lodge a
            complaint with your local authority or, in Kenya, with the{" "}
            <strong>Office of the Data Protection Commissioner (ODPC)</strong>.
            We will respond to rights requests as required by law.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">9) Android permissions & controls</h2>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>
              <strong>Location</strong>: show maps/nearby places. Toggle in
              Android Settings &gt; Apps &gt; PackPal &gt; Permissions.
            </li>
            <li>
              <strong>Photos/Media/Camera</strong>: attach trip photos or scan
              documents. We access only files you choose.
            </li>
            <li>
              <strong>Notifications</strong>: trip reminders and updates. You
              can turn these off in system settings.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">10) Children</h2>
          <p className="mt-2">
            PackPal is not intended for children under 16. We do not knowingly
            collect personal data from children. If you believe a child has
            provided data, contact us to request deletion.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">11) Marketing choices</h2>
          <p className="mt-2">
            If we send marketing emails, you can unsubscribe via the email
            link. You may still receive essential transactional or service
            messages (e.g., password resets).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">12) Changes to this Policy</h2>
          <p className="mt-2">
            We may update this Policy to reflect changes to the Service or law.
            We will post the updated version here and update the “Last updated”
            date. Significant changes may be highlighted in-app.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">13) Contact</h2>
          <p className="mt-2">
            To ask questions or exercise your rights, contact{" "}
            <a className="text-brand-600 underline" href="mailto:privacy@thelightideas.co.ke">
              privacy@thelightideas.co.ke
            </a>
            . Postal: Light Ideas, Nairobi, Kenya.
          </p>
        </section>
      </div>
    </main>
  );
}
