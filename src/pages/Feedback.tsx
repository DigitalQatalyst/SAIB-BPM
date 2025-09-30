import React, { useState } from 'react';
import { Star, Upload, Send } from 'lucide-react';
import Sidebar from '../components/shared/Sidebar';
const Feedback = () => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [feedbackType, setFeedbackType] = useState<string>('');
  const [comments, setComments] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
  };
  const handleRatingHover = (hoveredRating: number) => {
    setHoveredRating(hoveredRating);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would send the feedback to a server
    console.log({
      rating,
      feedbackType,
      comments,
      file
    });
    // Show success message
    setSubmitted(true);
    // Reset form after submission
    setTimeout(() => {
      setRating(0);
      setFeedbackType('');
      setComments('');
      setFile(null);
      setSubmitted(false);
    }, 3000);
  };
  return <div className="bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Provide Feedback</h1>
          <p className="mt-2 text-lg text-gray-600">
            Your feedback helps us improve our services and better meet your
            needs.
          </p>
        </div>
        {submitted ? <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-medium text-green-800 mb-2">
              Thank You for Your Feedback!
            </h2>
            <p className="text-green-700">
              We appreciate you taking the time to share your thoughts with us.
              Your feedback has been submitted successfully.
            </p>
          </div> : <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
            <div className="p-6 sm:p-8">
              <form onSubmit={handleSubmit}>
                <div className="mb-8">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    How would you rate your experience?
                  </h2>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map(star => <button key={star} type="button" onClick={() => handleRatingClick(star)} onMouseEnter={() => handleRatingHover(star)} onMouseLeave={() => handleRatingHover(0)} className="mr-2 focus:outline-none">
                        <Star className={`h-8 w-8 ${(hoveredRating || rating) >= star ? 'text-[#FECC0E] fill-[#FECC0E]' : 'text-gray-300'}`} />
                      </button>)}
                    <span className="ml-4 text-sm text-gray-500">
                      {rating > 0 ? `${rating} out of 5 stars` : 'Select a rating'}
                    </span>
                  </div>
                </div>
                <div className="mb-6">
                  <label htmlFor="feedbackType" className="block text-sm font-medium text-gray-700 mb-1">
                    What type of feedback are you providing?
                  </label>
                  <select id="feedbackType" value={feedbackType} onChange={e => setFeedbackType(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FECC0E] focus:border-[#FECC0E]" required>
                    <option value="">Select feedback type</option>
                    <option value="general">General Feedback</option>
                    <option value="policy_process">
                      Policy Request Process
                    </option>
                    <option value="procedure_clarity">Procedure Clarity</option>
                    <option value="user_interface">User Interface</option>
                    <option value="support_experience">
                      Support Experience
                    </option>
                    <option value="suggestion">Feature Suggestion</option>
                    <option value="bug">Bug Report</option>
                  </select>
                </div>
                <div className="mb-6">
                  <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Feedback
                  </label>
                  <textarea id="comments" value={comments} onChange={e => setComments(e.target.value)} rows={6} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FECC0E] focus:border-[#FECC0E]" placeholder="Please share your thoughts, suggestions, or report any issues you've encountered..." required></textarea>
                </div>
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Attach a Screenshot (optional)
                  </label>
                  <div className="mt-1 flex items-center">
                    <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                      <Upload className="mr-2 h-4 w-4" />
                      Choose File
                      <input type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                    </label>
                    <span className="ml-3 text-sm text-gray-500">
                      {file ? file.name : 'No file selected'}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Supported formats: JPG, PNG, GIF (max 5MB)
                  </p>
                </div>
                <div className="text-right">
                  <button type="submit" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-[#FECC0E] hover:bg-[#FECC0E]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FECC0E]" disabled={!rating || !feedbackType || !comments}>
                    Submit Feedback
                    <Send className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Why Your Feedback Matters
            </h2>
            <p className="text-gray-600 mb-6">
              At SAIB, we're committed to continuous improvement. Your feedback
              helps us:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#FECC0E]/20 flex items-center justify-center">
                  <span className="text-[#FECC0E] text-sm font-bold">1</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">
                    Enhance User Experience
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    We use your feedback to make our platform more intuitive and
                    user-friendly.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#FECC0E]/20 flex items-center justify-center">
                  <span className="text-[#FECC0E] text-sm font-bold">2</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">
                    Improve Processes
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Your insights help us streamline our policy and procedure
                    management processes.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#FECC0E]/20 flex items-center justify-center">
                  <span className="text-[#FECC0E] text-sm font-bold">3</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">
                    Develop New Features
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    We prioritize new features based on the needs you express
                    through feedback.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#FECC0E]/20 flex items-center justify-center">
                  <span className="text-[#FECC0E] text-sm font-bold">4</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">
                    Address Issues Quickly
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Your reports help us identify and fix issues promptly to
                    ensure smooth operations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Feedback;