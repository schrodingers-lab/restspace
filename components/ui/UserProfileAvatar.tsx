import React from 'react';
import classNames from 'classnames';

export const UserProfileAvatar = ({userProfile}) => {
    let initials = userProfile?.username?.length > 1 ? userProfile.username.substring(0,1) : null
    let avatarSrc = userProfile?.avatar?.length > 1 ? userProfile.avatar : null;

    return (
      <>
        {avatarSrc && 
            <img
                className="inline-block h-8 w-8 rounded-full"
                src="avatarSrc"
                alt="avatar"
            />
        }
        { !avatarSrc && initials && 
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-500">
                <span className="text-xs font-medium leading-none text-white">{initials}</span>
            </span>
        }
        {  !avatarSrc && !initials && 
            <span className="inline-block h-8 w-8 overflow-hidden rounded-full bg-gray-100">
                <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            </span>
        }
      </>
    )
  }

export default UserProfileAvatar;