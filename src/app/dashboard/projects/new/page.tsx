"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase/browser";
import { Copy, Check, ArrowLeft, Info, Loader2 } from "lucide-react";
import Link from "next/link";
import Script from "next/script";

export default function NewProjectPage() {
  
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    form_selector: "form",
  });
  const [projectId, setProjectId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      console.log(formData);
      const { data, error } = await supabase
        .from("projects")
        .insert({
          name: formData.name,
          description: formData.description,
          form_selector: formData.form_selector,
          user_id: user.id,
        })
        .select()
        .single();
      if (error) throw error;
      setProjectId(data.id);
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const copySnippet = async () => {
    if (!projectId) return;
    const snippet = `<script>\n(function() {\n  var script = document.createElement('script');\n  script.src = '${window.location.origin}/track.js';\n  script.setAttribute('data-project-id', '${projectId}');\n  script.setAttribute('data-form-selector', '${formData.form_selector}');\n  document.head.appendChild(script);\n})();\n<\/script>`;
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  // Stepper UI
  const Step = ({ step, label, active, done }: { step: number; label: string; active: boolean; done: boolean }) => (
    <div className="flex items-center">
      <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${done ? 'bg-blue-600 border-blue-600 text-white' : active ? 'border-blue-600 text-blue-600' : 'border-gray-300 text-gray-400'} font-bold transition-all`}>{done ? <Check className="w-5 h-5" /> : step}</div>
      <span className={`ml-2 text-sm ${active || done ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>{label}</span>
    </div>
  );

  if (projectId) {
    const snippet = `<script>\n(function() {\n  var script = document.createElement('script');\n  script.src = '${window.location.origin}/track.js';\n  script.setAttribute('data-project-id', '${projectId}');\n  script.setAttribute('data-form-selector', '${formData.form_selector}');\n  document.head.appendChild(script);\n})();\n<\/script>`;
    return (
      <>
        {/* Inject tracking script with real projectId after creation */}
        <Script
          src="/track.js"
          data-project-id={projectId}
          data-form-selector={formData.form_selector}
          strategy="afterInteractive"
        />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-6 flex items-center justify-between">
            <Link href="/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
            </Link>
            <div className="flex space-x-2">
              <Step step={1} label="Project Info" active={false} done={true} />
              <div className="w-8 border-t-2 border-blue-200 mx-1" />
              <Step step={2} label="Get Snippet" active={true} done={false} />
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-white shadow-xl rounded-2xl p-8 border border-blue-100">
            <div className="text-center mb-8">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 shadow">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="mt-4 text-2xl font-bold text-gray-900">Project Created!</h2>
              <p className="mt-2 text-base text-gray-600">Your project <span className="font-semibold text-blue-600">"{formData.name}"</span> is ready. Add the tracking snippet to your website to start collecting data.</p>
            </div>
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center"><Copy className="w-4 h-4 mr-1 text-blue-500" /> Tracking Snippet</h3>
              <div className="relative group">
                <pre className="bg-gray-900 text-green-200 rounded-lg p-4 text-xs overflow-x-auto font-mono border border-gray-200 shadow-inner">
                  <code>{snippet}</code>
                </pre>
                <button
                  onClick={copySnippet}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-blue-50 border border-blue-100 transition"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5 text-blue-500" />}
                </button>
                {copied && <span className="absolute top-2 right-12 bg-green-100 text-green-700 px-2 py-1 rounded text-xs shadow">Copied!</span>}
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center"><Info className="w-4 h-4 mr-1 text-blue-500" /> Installation Instructions</h4>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Copy the tracking snippet above</li>
                <li>Paste it in the <code className="bg-blue-100 px-1 rounded">&lt;head&gt;</code> section of your webpage</li>
                <li>Make sure your form has the selector: <code className="bg-blue-100 px-1 rounded">{formData.form_selector}</code></li>
                <li>Start collecting form analytics data!</li>
              </ol>
            </div>
            <div className="flex space-x-3 mt-4">
              <Link
                href="/dashboard"
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg text-base font-medium hover:bg-gray-700 text-center shadow"
              >
                Back to Dashboard
              </Link>
              <Link
                href={`/dashboard/projects/${projectId}`}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-base font-medium hover:bg-blue-700 text-center shadow"
              >
                View Project
              </Link>
            </div>
          </div>
        </div>
        {/* Inject provided script for testing */}
        {typeof window !== 'undefined' && (
          <script dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var script = document.createElement('script');
                script.src = 'http://localhost:3000/track.js';
                script.setAttribute('data-project-id', '4a79582a-7ac5-4b18-878f-37c2dfa30f8b');
                script.setAttribute('data-form-selector', 'form');
                document.head.appendChild(script);
              })();
            `
          }} />
        )}
      </>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Inject tracking script with real project ID for the form step */}
      <Script
        src="/track.js"
        data-project-id="4a79582a-7ac5-4b18-878f-37c2dfa30f8b"
        data-form-selector={formData.form_selector}
        strategy="afterInteractive"
      />
      {/* Remove tracking script injection from the form step */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
        </Link>
        <div className="flex space-x-2">
          <Step step={1} label="Project Info" active={true} done={false} />
          <div className="w-8 border-t-2 border-blue-200 mx-1" />
          <Step step={2} label="Get Snippet" active={false} done={false} />
        </div>
      </div>
      <div className="bg-gradient-to-br from-blue-50 to-white shadow-xl rounded-2xl p-8 border border-blue-100">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Create a New Project</h2>
          <p className="mt-2 text-base text-gray-600">Set up a new form tracking project to start analyzing user interactions. All fields are required unless marked optional.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label htmlFor="name" className="block text-base font-semibold text-gray-700 flex items-center">
              Project Name <span className="ml-1 text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base px-4 py-3"
              placeholder="e.g., Contact Form, Signup Form"
              maxLength={60}
            />
            <span className="text-xs text-gray-500 mt-1 block">Give your project a descriptive name for easy identification.</span>
          </div>
          <div>
            <label htmlFor="description" className="block text-base font-semibold text-gray-700 flex items-center">
              Description <span className="ml-1 text-gray-400 text-xs">(Optional)</span>
            </label>
            <textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base px-4 py-3"
              placeholder="Brief description of this form..."
              maxLength={200}
            />
            <span className="text-xs text-gray-500 mt-1 block">Describe what this form is for (e.g., 'Newsletter Signup').</span>
          </div>
          <div>
            <label htmlFor="form_selector" className="block text-base font-semibold text-gray-700 flex items-center">
              Form Selector <span className="ml-1 text-red-500">*</span>
              <span className="ml-2" title="CSS selector for your form"><Info className="w-4 h-4 text-blue-400" /></span>
            </label>
            <input
              type="text"
              id="form_selector"
              required
              value={formData.form_selector}
              onChange={(e) => setFormData({ ...formData, form_selector: e.target.value })}
              className="mt-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base px-4 py-3"
              placeholder="e.g., form, #contact-form, .signup-form"
              maxLength={80}
            />
            <span className="text-xs text-gray-500 mt-1 block">CSS selector to identify your form. Default is <code className="bg-blue-100 px-1 rounded">form</code> for all forms.</span>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <Link
              href="/dashboard"
              className="bg-white py-2 px-6 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 py-2 px-8 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
              {loading ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 