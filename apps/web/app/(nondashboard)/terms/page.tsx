import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use • PackPal",
  description:
    "PackPal Terms of Use. Please read these terms carefully before using our trip planning and packing tools.",
};

export default function TermsPage() {
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold">PackPal Terms of Use</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <div className="mt-8 space-y-8 text-base leading-7">
        <section>
          <h2 className="text-xl font-semibold">1) Who we are</h2>
          <p className="mt-2">
            PackPal is a trip planning and packing assistant provided by{" "}
            <strong>Light Ideas</strong> (“<strong>we</strong>”, “<strong>us</strong>”, “<strong>our</strong>”),
            a Kenya-based technology company serving users globally. These Terms
            form a binding agreement between you and Light Ideas when you use
            the PackPal mobile app or website (collectively, the “Service”).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">2) Acceptance of terms</h2>
          <p className="mt-2">
            By installing, accessing or using the Service you agree to these
            Terms. If you do not agree, do not use the Service. We may update
            these Terms from time to time; continued use means you accept the
            changes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">3) Eligibility</h2>
          <p className="mt-2">
            You must be at least <strong>18 years</strong> old to use PackPal.
            If you are in Kenya and are a minor under applicable law, you must
            have consent from a parent or legal guardian. You are responsible
            for complying with local laws where you use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">4) Limited license</h2>
          <p className="mt-2">
            We grant you a personal, worldwide, revocable, non-exclusive,
            non-transferable license to use PackPal for its intended purpose.
            You may not copy, modify, distribute, reverse engineer, rent, sell,
            or create derivative works of the Service or any part thereof, nor
            remove or alter any proprietary notices.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">5) Your content</h2>
          <p className="mt-2">
            You may add content such as trip names, notes, locations, files and
            photos (“<strong>User Content</strong>”). You retain your rights to
            User Content. You grant us a limited license to host, process and
            display User Content solely to operate the Service and provide
            features you request (e.g., map views, document storage, sharing with
            collaborators). You are responsible for your User Content and for
            having the rights to share it.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">6) Acceptable use</h2>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>No illegal activity, infringement, harassment, hate or fraud.</li>
            <li>No scraping, bulk data extraction or unauthorized automation.</li>
            <li>No interference with the Service (e.g., overloading, bypassing security, introducing malware).</li>
            <li>No use that violates another person’s privacy or data protection rights.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">7) Third-party services & maps</h2>
          <p className="mt-2">
            PackPal may rely on third-party services (for example, map or place
            providers, file storage, crash reporting). Those services are
            governed by their own terms and policies. We do not control and are
            not responsible for third-party content, accuracy, or availability.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">8) Travel information disclaimer</h2>
          <p className="mt-2">
            PackPal helps you organize trips but does not provide professional
            advice, bookings, immigration guidance, or safety guarantees.
            Always verify visas, health requirements, routes, opening hours and
            local regulations independently. You are responsible for your travel
            decisions and personal safety.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">9) Devices, connectivity & availability</h2>
          <p className="mt-2">
            Some features need device permissions (e.g., location, camera) and
            an active internet connection. Charges from your mobile operator may
            apply. We do not warrant that the Service will be uninterrupted,
            secure or error-free, or that it will work on every device or OS
            version. You are responsible for keeping your device secure and
            charged.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">10) Fees & in-app purchases</h2>
          <p className="mt-2">
            PackPal may offer free and paid features. If you purchase through
            Google Play, billing, renewals, trials and refunds are handled by
            Google Play policies in your region. Prices may change with notice
            in-app or via the store listing.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">11) Intellectual property</h2>
          <p className="mt-2">
            All rights in PackPal, including software, design, logos, text,
            graphics and trademarks, are owned by Light Ideas or our licensors
            and are protected by applicable laws. No rights are granted except
            as expressly stated in these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">12) Warranties & liability</h2>
          <p className="mt-2">
            THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE” WITHOUT
            WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. TO THE MAXIMUM EXTENT
            PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES INCLUDING
            MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
            NON-INFRINGEMENT. TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL
            NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL
            OR PUNITIVE DAMAGES, OR ANY LOSS OF DATA, PROFITS, REVENUE OR
            BUSINESS, ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE. IN
            ALL CASES, OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNTS YOU PAID
            (IF ANY) FOR THE SERVICE IN THE 12 MONTHS PRECEDING THE CLAIM.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">13) Indemnity</h2>
          <p className="mt-2">
            You agree to indemnify and hold Light Ideas harmless from any claims
            arising out of your breach of these Terms, your User Content, or
            your unlawful use of the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">14) Suspension & termination</h2>
          <p className="mt-2">
            We may suspend or terminate your access if you breach these Terms or
            if we discontinue the Service. Upon termination, your right to use
            PackPal ends and you must stop using it. Sections that by their
            nature should survive termination will survive (e.g., IP, warranty
            disclaimers, limitations of liability).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">15) Governing law & venue</h2>
          <p className="mt-2">
            These Terms are governed by the laws of the Republic of Kenya,
            without regard to conflict-of-law principles. You and Light Ideas
            submit to the non-exclusive jurisdiction of the courts of Nairobi,
            Kenya. If you are a consumer resident outside Kenya, you may have
            mandatory rights under your local law which are not superseded by
            this clause.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">16) Contact</h2>
          <p className="mt-2">
            Questions about these Terms? Email{" "}
            <a className="text-brand-600 underline" href="mailto:support@thelightideas.co.ke">
              support@thelightideas.co.ke
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
