import React, { useState } from 'react';
import axios from 'axios';

const EmailForm = () => {
  const [recipients, setRecipients] = useState('');
  const [prompt, setPrompt] = useState('');
  const [subject, setSubject] = useState('');
  const [status, setStatus] = useState('');
  const [generatedEmails, setGeneratedEmails] = useState([]); 
  const [emailBody, setEmailBody] = useState(''); 

  // Generate Email(s) from Prompt
  const generateEmail = async () => {
    setStatus('Generating email...');

    try {
      const res = await axios.post('http://localhost:5000/api/email/generate', { prompt });

      // If response is an array of suggestions
      const emails = Array.isArray(res.data.email) ? res.data.email : [res.data.email];
      setGeneratedEmails(emails);
      setStatus('Email(s) generated successfully');
    } catch (err) {
      console.error('Error in generating email:', err);
      setStatus('Failed to generate email');
    }
  };

  // Send Selected Email
  const sendEmail = async () => {
    if (!emailBody.trim()) return alert("Email body can't be empty");

    setStatus('Sending email...');
    try {
      const res = await axios.post('http://localhost:5000/api/email/send', {
        recipients: recipients.split(',').map((e) => e.trim()),
        subject,
        body: emailBody,
      });

      if (res.data.success) {
        alert('Email sent successfully');
        setStatus('Email sent successfully');
      } else {
        alert('Failed to send email');
        setStatus('Failed to send email');
      }
    } catch (err) {
      console.log('Error sending email:', err);
      alert('Error occurred while sending');
      setStatus('Failed to send');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 lg:p-10 max-w-7xl mx-auto">
      {/* Left Panel: Prompt + Suggestions */}
      <div className="flex-1 bg-gradient-to-br from-white to-blue-50 shadow-lg p-8 rounded-xl space-y-6 border border-blue-100">
        <h2 className="text-3xl font-bold text-blue-700 mb-4 text-center">✨ AI Email Generator</h2>

        <input
          className="w-full border border-blue-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="📧 Recipients (comma-separated)"
          value={recipients}
          onChange={(e) => setRecipients(e.target.value)}
        />

        <input
          className="w-full border border-blue-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="📝 Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <textarea
          className="w-full border border-blue-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="💡 Prompt for email"
          rows="3"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 font-medium shadow transition"
          onClick={generateEmail}
        >
          🚀 Generate Email
        </button>

        {status && <p className="text-sm italic text-red-600 text-center">{status}</p>}

        {/* Show multiple generated suggestions */}
        {generatedEmails.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-700">🧠 Choose from Suggestions:</h3>
            {generatedEmails.map((email, idx) => (
              <div
                key={idx}
                className="bg-white p-4 border border-gray-300 rounded-lg shadow-sm space-y-2"
              >
                <textarea 
                rows="16"
                className="w-full border border-green-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition">{email}</textarea>
                <button
                  className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition"
                  onClick={() => setEmailBody(email)}
                >
                  ✅ Use this Email
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Panel: Final Email Editor */}
      <div className="flex-1 bg-white p-6 rounded-xl border border-gray-200 shadow-inner h-fit space-y-4">
        <h3 className="font-semibold text-xl text-gray-700 text-center">📝 Email</h3>
        <textarea
          className="w-full border border-green-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          rows="16"
          value={emailBody}
          onChange={(e) => setEmailBody(e.target.value)}
          placeholder="✍️ Your final email to send..."
        />
        <button
          className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 font-medium shadow transition"
          onClick={sendEmail}
        >
          📤 Send Email
        </button>
      </div>
    </div>
  );
};

export default EmailForm;
