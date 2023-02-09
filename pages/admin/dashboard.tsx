
import { useRouter } from 'next/router'

import { useContext, useEffect, useRef } from 'react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { IonButton, IonIcon } from '@ionic/react';


const DashboardPage = (props) => {
  const router = useRouter();
  const user = useUser();
  const supabase = useSupabaseClient();

  const handleReturn = () => {
    router.push('/');
  }

  const goToAdminChat = () => {
    router.push('/admin/chats/1');
  }


  const goToAdminUsers = () => {
    router.push('/admin/users');
  }
  const goToUgcReports = () => {
    router.push('/admin/reports');
  }
  

  // Render the chats and messages
  return (
    <div className="mx-auto pt-8 px-8" >

      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Admin Dashboard
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            onClick={handleReturn}
            type="button"
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-ww-secondary focus:ring-offset-2"
          >
            Return
          </button>
        </div>
      </div>

      {/* <h3 className="text-lg font-medium leading-6 text-gray-900">Last 30 days</h3> */}

      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* First Admin Module */}
          <div
            key='users'
            className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
            onClick={goToAdminUsers}
          >
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                U
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">Users</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">Manage Users</p>
         
              <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <div className="font-medium text-ww-primary hover:text-ww-secondary">
                    {' '}
                    View all
                  </div>
                </div>
              </div>
            </dd>
          </div>

          <div
            key='chats'
            className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
            onClick={goToAdminChat}
          >
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                C
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">Chats</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">Manage Chats</p>
         
              <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <div className="font-medium text-ww-primary hover:text-ww-secondary">
                    {' '}
                    View all
                  </div>
                </div>
              </div>
            </dd>
          </div>

          <div
            key='reports'
            className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
            onClick={goToUgcReports}
          >
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                R
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">Reports</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">Manage UGC Reports</p>
         
              <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <div className="font-medium text-ww-primary hover:text-ww-secondary">
                    {' '}
                    View all
                  </div>
                </div>
              </div>
            </dd>
          </div>
      </dl>
    </div>
  )
}

export default DashboardPage