import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Contact', description: 'Get in touch with the SnapTools team.' };

export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 prose prose-gray">
      <h1>Contact Us</h1>
      <p>Have a question, suggestion, or found a bug? We&apos;d love to hear from you. Reach out using any of the methods below.</p>

      <h2>Email</h2>
      <p>Send us an email at: <strong>avocado19860101@gmail.com</strong></p>
      <p>We typically respond within 1-2 business days.</p>

      <h2>Feedback & Suggestions</h2>
      <p>Want to see a new tool added to SnapTools? Have an idea for improving an existing one? Send us your suggestions — we&apos;re always looking for ways to be more useful.</p>

      <h2>Bug Reports</h2>
      <p>If you&apos;ve encountered an issue with any of our tools, please include:</p>
      <ul>
        <li>Which tool you were using</li>
        <li>What you expected to happen</li>
        <li>What actually happened</li>
        <li>Your browser and device (e.g., Chrome on Windows 11)</li>
      </ul>
      <p>This helps us fix issues quickly and improve the experience for everyone.</p>
    </div>
  );
}
