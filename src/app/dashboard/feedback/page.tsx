'use client';

import { useState } from 'react';
import { MessageSquare, Send, CheckCircle, User, Mail } from 'lucide-react';

export default function FeedbackPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would send the feedback to your backend or email
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 py-8 sm:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Share Your Feedback
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Help us improve FormMirror by sharing your thoughts, suggestions, or reporting any issues.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {submitted ? (
            <div className="p-8 sm:p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h2>
              <p className="text-gray-600 mb-6">
                Your feedback has been submitted successfully. We&apos;ll review it and get back to you soon.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Submit Another
              </button>
            </div>
          ) : (
            <form className="p-8 sm:p-12 space-y-8" onSubmit={handleSubmit}>
              {/* Name Field */}
              <div className="relative">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3">
                  Your Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="relative">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                  Email Address <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Message Field */}
              <div className="relative">
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-3">
                  Your Feedback
                </label>
                <div className="relative">
                  <div className="absolute top-4 left-4 flex items-start pointer-events-none">
                    <MessageSquare className="h-5 w-5 text-gray-400 mt-0.5" />
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={form.message}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                    rows={6}
                    placeholder="Share your thoughts, suggestions, or report any issues..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3"
                >
                  <Send className="h-5 w-5" />
                  Submit Feedback
                </button>
              </div>

              {/* Additional Info */}
              <div className="text-center pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  We typically respond within 24 hours. For urgent issues, please contact us directly.
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Your feedback helps us make FormMirror better for everyone. Thank you! 🙏
          </p>
        </div>
      </div>
    </div>
  );
} 