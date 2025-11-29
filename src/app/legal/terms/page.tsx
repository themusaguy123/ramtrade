export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          
          <p className="text-sm text-gray-600 mb-8">
            Last Updated: November 2024
          </p>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using RamTrade, you accept and agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use this platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Eligibility</h2>
              <p>
                RamTrade is exclusively for current Virginia Commonwealth University (VCU) students with a valid @vcu.edu email address. 
                By using this service, you confirm that you are a current VCU student.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. User Responsibilities</h2>
              <p className="mb-3">As a user of RamTrade, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate and truthful information in your listings</li>
                <li>Only post items that you own and have the right to sell</li>
                <li>Meet in safe, public locations when conducting transactions</li>
                <li>Not post prohibited items (weapons, drugs, stolen goods, etc.)</li>
                <li>Treat other users with respect and courtesy</li>
                <li>Not engage in fraudulent or deceptive practices</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Prohibited Activities</h2>
              <p className="mb-3">Users are strictly prohibited from:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Posting false, misleading, or fraudulent listings</li>
                <li>Harassing, threatening, or abusing other users</li>
                <li>Posting spam or unsolicited advertisements</li>
                <li>Attempting to scam or defraud other users</li>
                <li>Violating any local, state, or federal laws</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Transactions and Safety</h2>
              <p>
                RamTrade is a platform that connects buyers and sellers. We do not facilitate, guarantee, or take 
                responsibility for any transactions between users. All transactions are conducted at your own risk. 
                We strongly recommend meeting in public places on campus and inspecting items before purchase.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Content Ownership</h2>
              <p>
                You retain ownership of any content you post on RamTrade. However, by posting content, you grant 
                RamTrade a non-exclusive license to display, distribute, and promote your listings on the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Account Termination</h2>
              <p>
                We reserve the right to suspend or terminate your account at any time for violations of these terms, 
                including but not limited to fraudulent activity, harassment, or posting prohibited items.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Disclaimer</h2>
              <p className="mb-3">
                RamTrade is an independent student project and is NOT affiliated with, endorsed by, or sponsored by 
                Virginia Commonwealth University (VCU). The university bears no responsibility for transactions or 
                interactions on this platform.
              </p>
              <p>
                THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE THE ACCURACY, 
                COMPLETENESS, OR RELIABILITY OF ANY CONTENT OR LISTINGS.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Limitation of Liability</h2>
              <p>
                RamTrade and its creators shall not be liable for any damages arising from your use of the platform, 
                including but not limited to direct, indirect, incidental, or consequential damages.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms of Service at any time. Continued use of the platform 
                after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Contact</h2>
              <p>
                If you have questions about these Terms of Service, please contact us through the platform's 
                messaging system.
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