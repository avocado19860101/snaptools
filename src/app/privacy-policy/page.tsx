import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Privacy Policy', description: 'SnapTools privacy policy. Learn how we handle your data.' };

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 prose prose-gray">
      <h1>Privacy Policy</h1>
      <p><strong>Last updated:</strong> February 2026</p>
      <p>At SnapTools (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;), your privacy is our priority. This Privacy Policy explains how we collect, use, and protect your information when you use our website at snaptools.dev.</p>

      <h2>Information We Collect</h2>
      <p><strong>Files and Data You Process:</strong> All files and text you use with our tools are processed entirely in your web browser. We do not upload, store, or have access to any files or data you process using our tools.</p>
      <p><strong>Analytics Data:</strong> We may use Google Analytics to collect anonymous usage data such as pages visited, time spent, browser type, and device type. This data is aggregated and cannot identify you personally.</p>
      <p><strong>Cookies:</strong> We use cookies for analytics and advertising purposes. You can control cookie preferences through your browser settings or our cookie consent banner.</p>

      <h2>Advertising</h2>
      <p>We use Google AdSense to display advertisements. Google may use cookies to serve ads based on your prior visits to this and other websites. You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.</p>

      <h2>Data Security</h2>
      <p>Since all tool processing happens locally in your browser, your data is inherently secure. We never receive, transmit, or store your files or text content on any server.</p>

      <h2>Third-Party Services</h2>
      <p>We use the following third-party services:</p>
      <ul>
        <li>Google AdSense (advertising)</li>
        <li>Google Analytics (anonymous usage analytics)</li>
        <li>Vercel (website hosting)</li>
      </ul>

      <h2>Your Rights (GDPR)</h2>
      <p>If you are in the European Economic Area, you have the right to access, correct, or delete your personal data. Since we don&apos;t collect personal data through our tools, this primarily applies to analytics cookies, which you can control through your browser.</p>

      <h2>Children&apos;s Privacy</h2>
      <p>Our services are not directed to children under 13. We do not knowingly collect information from children.</p>

      <h2>Changes to This Policy</h2>
      <p>We may update this policy from time to time. Changes will be posted on this page with an updated date.</p>

      <h2>Contact Us</h2>
      <p>If you have questions about this Privacy Policy, please visit our <a href="/contact">Contact page</a>.</p>
    </div>
  );
}
