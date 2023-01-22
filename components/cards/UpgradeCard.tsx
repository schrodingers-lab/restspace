import React from 'react';
import Card from '../ui/Card';

export const UpgradeCard = () => {
  return (
    <Card className="my-20 mx-auto">
      <div className="px-4 py-4 bg-white rounded-b-xl dark:bg-gray-900">
        <h4 className="font-bold py-0 text-s text-gray-400 dark:text-gray-500 uppercase">Upgrade Now</h4>
        <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-100">New Version is Available</h2>
        <div className="my-30">
            <br/>
            <a href="https://itunes.apple.com/us/app/restspace/id1266607495?ls=1&mt=8" className="w-full text-center mx-auto my-20">
              <img  alt="App Store" src="/img/app-store.svg"  className="w-full text-center"/>
            </a>
            <br/>
            <br/>
            <a href="https://play.google.com/store/apps/details?id=com.wewatch.app" className="w-full text-center my-20">
              <img  alt="Play Store" src="/img/google-play-badge.png"  className="w-full text-center"/>
            </a>
            <br/>
        </div>

      </div>
    </Card>
  );
}
  
export default UpgradeCard;