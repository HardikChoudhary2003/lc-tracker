import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link

function PrivacyPolicyPage() {
  useEffect(() => {
    document.title = 'Privacy Policy - LeetCode Tracker';
  }, []);

  // Placeholder Email - replace this!
  const contactEmail = "[anon.developer.chat@gmail.com]"; 

  return (
    // Removed card styling (bg, shadow, rounded, border), kept padding and margin
    <div className="py-10 px-6 sm:px-8 lg:px-10 mt-8 relative"> {/* Added relative positioning */}
      
      {/* Back to Home Link */}
      <Link 
        to="/dashboard" 
        className="absolute top-4 left-4 sm:left-6 lg:left-8 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        aria-label="Back to Dashboard"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 text-center pt-8 sm:pt-0"> {/* Added padding-top for small screens */}
        🔒 Privacy Policy
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 border-b pb-4 border-gray-300 dark:border-gray-600 text-center">
        Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
      
      {/* Adjusted prose size to base, removed sm:text-lg for consistency */}
      <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-6 text-base leading-relaxed">
        {/* Apply italic style to intro */}
        <p className="italic text-gray-600 dark:text-gray-400"> 
          Hey there! Thanks for checking out LeetCode Tracker. Here's the deal on what data we collect, how we use it, and how we keep it safe.
        </p>
        <p>
          If you’re not cool with this policy, feel free not to use the app — but if you’re curious (or just like reading privacy stuff), here’s everything you need to know:
        </p>

        {/* Section styling */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4">📥 What We Collect</h2>
          <ol className="list-decimal pl-6 space-y-3">
            <li>
              <strong className="font-medium">Personal Info (via Google Login):</strong> If you log in with Google, we get your name, email, and profile picture — just enough to identify you and personalize your experience inside the app. That’s it.
            </li>
            <li>
              <strong className="font-medium">LeetCode Data:</strong> If you give us your LeetCode username or session key, we use it to pull your public profile, contest activity, and problem submissions. This is core to how the app works.
            </li>
            <li>
              <strong className="font-medium">App Usage Data:</strong> Some basic info like IP address, browser type, OS, and access times may be logged automatically. (Still deciding how much we really need here — if at all.)
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4">🧠 How We Use It</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To create and manage your account</li>
            <li>To display your LeetCode progress and stats</li>
            <li>To understand usage and improve the app</li>
            <li>To send important updates</li>
            <li>And generally, to make your experience smoother</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4">🔐 How We Keep It Safe</h2>
          <p>
            We care about your data. We use encryption for sensitive stuff (like session keys), host everything securely, and regularly check our security setup.
          </p>
          <p className="mt-2 italic text-gray-600 dark:text-gray-400">
            But just being real: no system is 100% hack-proof. We’ll always do our best, but we can’t promise absolute security.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4">🤝 When We Share (Rarely)</h2>
          <p>
            We don’t sell or trade your info — ever. We might share it:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>If legally required to (e.g. a legit court order)</li>
            <li>With trusted service providers (e.g. for hosting or analytics) who are bound to respect your privacy</li>
          </ul>
        </section>

        <section>
           <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4">⚙️ Your Choices</h2>
           <ul className="list-disc pl-6 space-y-2">
            <li>You can request to view, change, or delete your account anytime.</li>
            <li>Don’t want your LeetCode data used? Remove your username/session key in the app or just contact us.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4">🔄 Policy Changes</h2>
          <p>
            If we ever update this policy, you’ll see the new version here and the date at the top will change. We’ll try to keep things transparent and simple.
          </p>
        </section>

        <section className="pt-6 border-t border-gray-300 dark:border-gray-600 mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">📬 Contact</h2>
          {/* Apply similar styling to final paragraph */}
          <p className="font-semibold tracking-tight"> 
            Got questions? Suggestions? Concerns? Reach out at: 
            <a 
              href={`mailto:${contactEmail}`} 
              className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline ml-1"
            >
              {contactEmail}
            </a>
            <br />
          </p>
        </section>
      </div>
    </div>
  );
}

export default PrivacyPolicyPage;
