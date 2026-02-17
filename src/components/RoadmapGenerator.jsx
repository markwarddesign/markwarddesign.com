import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Sparkles, Loader2, MapPin } from 'lucide-react';

const RoadmapGenerator = () => {
  const [roadmap, setRoadmap] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateForm = (values) => {
    const errors = {};
    
    if (!values.apiKey) {
      errors.apiKey = 'API Key is required';
    }
    
    if (!values.projectDescription) {
      errors.projectDescription = 'Project description is required';
    } else if (values.projectDescription.length < 10) {
      errors.projectDescription = 'Project description must be at least 10 characters';
    }
    
    if (!values.duration) {
      errors.duration = 'Duration is required';
    }
    
    return errors;
  };

  const generateRoadmap = async (values) => {
    setLoading(true);
    setError('');
    setRoadmap('');

    try {
      const genAI = new GoogleGenerativeAI(values.apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `Create a detailed project roadmap for the following project:

Project Description: ${values.projectDescription}
Duration: ${values.duration}
Goals: ${values.goals || 'Not specified'}

Please provide:
1. Project phases and milestones
2. Key deliverables for each phase
3. Estimated timeline for each phase
4. Critical dependencies
5. Risk factors to consider

Format the roadmap in a clear, structured manner.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      setRoadmap(text);
    } catch (err) {
      console.error('Error generating roadmap:', err);
      setError(err.message || 'Failed to generate roadmap. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <MapPin className="w-12 h-12 text-indigo-600 mr-2" />
            <h1 className="text-4xl font-bold text-gray-900">AI Roadmap Generator</h1>
          </div>
          <p className="text-lg text-gray-600">
            Powered by Google Gemini AI - Create detailed project roadmaps in seconds
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-lg p-8 mb-8">
          <Formik
            initialValues={{
              apiKey: '',
              projectDescription: '',
              duration: '',
              goals: '',
            }}
            validate={validateForm}
            onSubmit={generateRoadmap}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                    Google Gemini API Key
                  </label>
                  <Field
                    id="apiKey"
                    name="apiKey"
                    type="password"
                    placeholder="Enter your Gemini API key"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <ErrorMessage
                    name="apiKey"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Get your API key from{' '}
                    <a
                      href="https://makersuite.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      Google AI Studio
                    </a>
                  </p>
                </div>

                <div>
                  <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Project Description
                  </label>
                  <Field
                    as="textarea"
                    id="projectDescription"
                    name="projectDescription"
                    rows="4"
                    placeholder="Describe your project in detail..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <ErrorMessage
                    name="projectDescription"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                      Project Duration
                    </label>
                    <Field
                      as="select"
                      id="duration"
                      name="duration"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select duration</option>
                      <option value="1-2 weeks">1-2 weeks</option>
                      <option value="1 month">1 month</option>
                      <option value="2-3 months">2-3 months</option>
                      <option value="3-6 months">3-6 months</option>
                      <option value="6-12 months">6-12 months</option>
                      <option value="1+ year">1+ year</option>
                    </Field>
                    <ErrorMessage
                      name="duration"
                      component="div"
                      className="mt-1 text-sm text-red-600"
                    />
                  </div>

                  <div>
                    <label htmlFor="goals" className="block text-sm font-medium text-gray-700 mb-2">
                      Project Goals (Optional)
                    </label>
                    <Field
                      id="goals"
                      name="goals"
                      type="text"
                      placeholder="e.g., Launch MVP, Scale to 10k users"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating Roadmap...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Roadmap
                    </>
                  )}
                </button>
              </Form>
            )}
          </Formik>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {roadmap && (
          <div className="bg-white shadow-xl rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Project Roadmap</h2>
            <div className="prose prose-indigo max-w-none">
              <pre className="whitespace-pre-wrap text-gray-700 font-sans leading-relaxed">
                {roadmap}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadmapGenerator;
