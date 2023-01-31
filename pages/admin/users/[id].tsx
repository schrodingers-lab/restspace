
import { useRouter } from 'next/router'
import addHours from 'date-fns/addHours';
import { useContext, useEffect, useRef, useState } from 'react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { updateProfile, useStore } from '../../../store/user'
import Layout from '../../../components/adminchat/Layout'
import Message from '../../../components/adminchat/Message'
import MessageInput from '../../../components/adminchat/MessageInput'
import { handleClientScriptLoad } from 'next/script'
import UserProfileAvatar from '../../../components/ui/UserProfileAvatar'

const UserPage = (props) => {
  const router = useRouter();
  const user = useUser();
  const supabase = useSupabaseClient();


  // Else load up the page
  const { id: userId } = router.query
  const { userProfiles, authUser, authUserProfile } = useStore({ userId })
  const [userProfile, setUserProfile] = useState<any>();

  const handleReturn = () => {
    router.push('/admin/users');
  }

  const shadowBan = (hours: number) => {
    userProfile.banned_to = addHours(new Date(),  hours)
    const res = updateProfile(userProfile, supabase);

    router.push('/admin/users');
  }


  // redirect to public chat when current chat is deleted
  useEffect(() => {
    if (userProfiles.has(userId)){
      setUserProfile(userProfiles.get(userId));
    } else {
       setUserProfile(undefined);
    }
  }, [userProfiles, userId]);

  
  // Render the chats and messages
  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-8">
      <div className="sm:flex sm:items-center mb-6">
      <div className="sm:flex-auto">
        <h1 className="text-2xl font-semibold text-gray-900">Manage User</h1>
        
      </div>
      <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none px-4">
        <button
            onClick={handleReturn}
            type="button"
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 mx-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-ww-secondary focus:ring-offset-2"
        >
            Users
        </button>
      </div>
    </div>

    <form className="space-y-8 divide-y divide-gray-20 overflow-scroll">
    <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
      <div className="space-y-6 sm:space-y-5">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">Profile</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            This information will be displayed publicly so be careful what you share.
          </p>
        </div>

        <div className="space-y-6 sm:space-y-5">
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
              Username
            </label>
            <div className="mt-1 sm:col-span-2 sm:mt-0">
              <div className="flex max-w-lg rounded-md shadow-sm">
                <input
                  type="text"
                  name="username"
                  id="username"
                  disabled
                  value={userProfile?.username}
                  className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-ww-secondary focus:ring-ww-secondary sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
            <label htmlFor="about" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
              About
            </label>
            <div className="mt-1 sm:col-span-2 sm:mt-0">
              <textarea
                id="about"
                name="about"
                rows={3}
                value={userProfile?.about}
                className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-ww-secondary focus:ring-ww-secondary sm:text-sm"
              />
              <p className="mt-2 text-sm text-gray-500">Write a few sentences about yourself.</p>
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
            <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
              Avatar
            </label>
            <div className="mt-1 sm:col-span-2 sm:mt-0">
              <div className="flex items-center">
                <UserProfileAvatar userProfile={userProfile} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="pt-5">
      <div className="flex justify-end">
        <button
          type="button"
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-ww-secondary focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          onClick={()=>shadowBan(24)}
          type="button"
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-ww-secondary focus:ring-offset-2"
        >
          Ban 24 hours
        </button>        
        <button
        onClick={()=>shadowBan(48)}
          type="button"
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-ww-secondary focus:ring-offset-2"
        >
          Ban 48 hours
        </button>
        <button
        onClick={()=>shadowBan(-1)}
          type="button"
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-ww-secondary focus:ring-offset-2"
        >
          End Ban
        </button>
        <button
          type="submit"
          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-yellow-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-ww-secondary focus:ring-offset-2"
        >
          Save
        </button>
      </div>
    </div>
    
  </form>
  </div>
)
}

export default UserPage

