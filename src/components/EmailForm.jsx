import React, { useState } from 'react';
import axios from 'axios';
import './emailForm.css';


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
      const res = await axios.post('https://ai-email-sender-oheb.vercel.app/api/email/generate', { prompt });

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
      const res = await axios.post('https://ai-email-sender-oheb.vercel.app/api/email/send', {
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
  <div className="container">
    {/* Left Panel: Prompt + Suggestions */}
    <div className="left-panel">
      <h2 className="title">✨ AI Email Generator</h2>

      <input
        className="input"
        placeholder="📧 Recipients (comma-separated)"
        value={recipients}
        onChange={(e) => setRecipients(e.target.value)}
      />

      <input
        className="input"
        placeholder="📝 Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      <textarea
        className="textarea"
        placeholder="💡 Prompt for email"
        rows="3"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button className="btn-generate" onClick={generateEmail}>
        🚀 Generate Email
      </button>

      {status && <p className="status">{status}</p>}

      {generatedEmails.length > 0 && (
        <div className="suggestions">
          <h3 className="suggestions-title">🧠 Choose from Suggestions:</h3>
          {generatedEmails.map((email, idx) => (
            <div key={idx} className="suggestion">
              <textarea
                rows="16"
                className="textarea"
                value={email}
                readOnly
              ></textarea>
              <button className="btn-use" onClick={() => setEmailBody(email)}>
                ✅ Use this Email
              </button>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Right Panel: Final Email Editor */}
    <div className="right-panel">
      <h3 className="email-title">📝 Email</h3>
      <textarea
        className="textarea"
        rows="16"
        value={emailBody}
        onChange={(e) => setEmailBody(e.target.value)}
        placeholder="✍️ Your final email to send..."
      />
      <button className="btn-send" onClick={sendEmail}>
        📤 Send Email
      </button>
    </div>
  </div>
);

};

export default EmailForm;
