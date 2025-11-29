export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          
          <p className="text-sm text-gray-600 mb-8">
            Last Updated: November 2024
          </p>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
              <p className="mb-3">When you use RamTrade, we collect the following information:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Account Information:</strong> Your name, VCU email address, and profile photo from your Google account</li>
                <li><strong>Listing Information:</strong> Details about items you post for sale, including descriptions, prices, photos, and location hints</li>
                <li><strong>Messages:</strong> Communications between buyers and sellers through our messaging system</li>
                <li><strong>Usage Data:</strong> Information about how you use the platform, including listings viewed and searches performed</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
              <p className="mb-3">We use your information to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide and maintain the RamTrade platform</li>
                <li>Verify that users are VCU students</li>
                <li>Enable communication between buyers and sellers</li>
                <li>Display your listings to other users</li>
                <li>Improve our services and user experience</li>
                <li>Detect and prevent fraud or abuse</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Information Sharing</h2>
              <p className="mb-3">We share your information in the following ways:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>With Other Users:</strong> Your name, email, and listings are visible to other registered users</li>
                <li><strong>Public Information:</strong> Listings you post are visible to all users of the platform</li>
                <li><strong>Service Providers:</strong> We use Firebase (Google) to host and store data</li>
              </ul>
              <p className="mt-3">
                We do NOT sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Data Storage and Security</h2>
              <p>
                Your data is stored securely using Google Firebase services. We implement reasonable security measures 
                to protect your information, including encryption and access controls. However, no method of transmission 
                over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. VCU Email Requirement</h2>
              <p>
                RamTrade requires users to sign in with a valid @vcu.edu email address to verify VCU student status. 
                If you sign in with a non-VCU email, you will be immediately logged out and unable to access the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Your Rights and Choices</h2>
              <p className="mb-3">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access the personal information we have about you</li>
                <li>Delete your listings at any time</li>
                <li>Request deletion of your account and associated data</li>
                <li>Update your profile information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Cookies and Tracking</h2>
              <p>
                We use Firebase Authentication, which may use cookies to maintain your login session. We do not use 
                third-party advertising or tracking cookies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Children's Privacy</h2>
              <p>
                RamTrade is intended for college students who are at least 18 years old. We do not knowingly collect 
                information from individuals under 18.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Third-Party Services</h2>
              <p className="mb-3">
                RamTrade uses the following third-party services:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Google Firebase:</strong> For authentication, database, and storage services</li>
                <li><strong>Google OAuth:</strong> For user authentication</li>
              </ul>
              <p className="mt-3">
                These services have their own privacy policies governing their use of your information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">10. University Affiliation Disclaimer</h2>
              <p>
                RamTrade is an independent student project and is NOT affiliated with, endorsed by, or sponsored by 
                Virginia Commonwealth University (VCU). VCU has no access to or control over data collected by RamTrade.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify users of any material changes by 
                updating the "Last Updated" date at the top of this policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or how we handle your data, please contact us through 
                the platform's messaging system.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <a href="/" className="text-blue-600 hover:underline">← Back to Home</a>
          </div>
        </div>
      </div>
    </main>
  );
}