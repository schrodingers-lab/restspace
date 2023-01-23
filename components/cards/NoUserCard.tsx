import React from 'react';
import Card from '../ui/Card';

export const NoUserCard = () => {
  return (
    <Card className="my-20 mx-auto border-2 border-gray-400 rounded-md">
      <div className="py-10 mx-auto max-w-md sm:max-w-3xl">
            <div>
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.813 2.602 9.288 6.286M30 14a6 6 0 11-12 0 6 6 0 0112 0zm12 6a4 4 0 11-8 0 4 4 0 018 0zm-28 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <h2 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-200">No logged in User</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">This feature needs an account.</p>
                <a href="/tabs/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Sign in
                </a>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Or</p>
                <a href="/tabs/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Sign Up
                </a>
              </div>
            </div>

      </div>
    </Card>
  );
}
  
export default NoUserCard;