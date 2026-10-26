import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 text-center">
      <div className="max-w-md w-full">
        <h1 className="text-9xl font-extrabold text-indigo-600 tracking-widest">404</h1>
        <div className="bg-indigo-600 text-white px-3 py-1 text-sm rounded rotate-12 inline-block -mt-6 mb-6">
          Page Not Found
        </div>
        <p className="text-gray-600 text-lg mb-8">
          Sorry, the page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
