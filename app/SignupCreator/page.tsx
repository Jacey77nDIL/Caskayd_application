'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignupCreatorPage() {
  const router = useRouter();

  const category = 'Creator'; 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string;} = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    } else if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      newErrors.password = 'Password should contain at least 1 uppercase letter and 1 number';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiError(null);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    const payload = { category, email, password};
    console.log(payload);

    try {
        {/*INPUT REAL API URL*/}
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to submit waitlist data');

      localStorage.setItem(
        'sign up creator -data',
        JSON.stringify({ category, email})
      );

      router.push('/');
    } catch (err) {
      console.error('Error submitting data:', err);
      setApiError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/'); 
    }
  };

  return (
    <main>
      <div className="relative bg-black backdrop-blur-sm w-full max-w-[650px] rounded-xl p-6 text-white shadow-xl">
        {/* Back button */}
        <button
          onClick={handleBack}
          className="ml-8 absolute top-4 left-4 text-3xl text-white hover:text-gray-300 hover:scale-110 hover:shadow-lg transition-transform duration-300"
        >
          ←
        </button>

        <h1 className="text-2xl font-bold">Signup Creator</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-16 items-start sm:pl-6">
          {/* Email */}
          <div className="w-full sm:w-[350px]">
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setErrors((prev) => ({ ...prev, ...validateForm() }))}
              placeholder="Enter your email"
              autoComplete="email"
              type="email"
              name="email"
              required
              className="w-full sm:w-[350px] border-b border-gray-400 px-4 py-2 bg-transparent text-white placeholder-gray-400 focus:outline-none"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="w-full sm:w-[350px]">
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setErrors((prev) => ({ ...prev, ...validateForm() }))}
              type="password"
              name="password"
              placeholder="*********"
              required
              className="w-full sm:w-[350px] border-b border-gray-400 px-4 py-2 bg-transparent text-white placeholder-gray-400 focus:outline-none"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>


          {/* API error */}
          {apiError && <p className="text-red-500 text-sm">{apiError}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`self-center mt-4 px-8 py-3 w-[150px] h-[50px] text-2xl font-semibold font-sans rounded transition-transform duration-300 ${
              isSubmitting ? 'bg-gray-500 cursor-not-allowed' : 'bg-white text-black hover:scale-110 hover:shadow-lg'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin border-2 border-t-transparent border-black rounded-full w-5 h-5"></span>
                Submitting...
              </span>
            ) : (
              'Submit'
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
