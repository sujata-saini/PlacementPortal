import React from 'react';
import { assets } from '../assets/assets';

const AppDownload = () => {
  return (
    <div className="container px-4 2xl:px-20 mx-auto my-20">
      <div className="relative bg-gradient-to-r from-violet-50 to-purple-50 p-8 sm:p-16 lg:p-20 rounded-lg flex flex-col lg:flex-row items-center justify-between">
        
        {/* Left Text & Buttons */}
        <div className="max-w-lg text-center lg:text-left">
          <h1 className="text-2xl sm:text-3xl font-semibold leading-snug mb-6">
            Download mobile app for <br /> better experience
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a href="#">
              <img src={assets.play_store} alt="Get it on Google Play" className="h-12" />
            </a>
            <a href="#">
              <img src={assets.app_store} alt="Download on the App Store" className="h-12" />
            </a>
          </div>
        </div>

        {/* Right Image */}
        <div className="mt-10 lg:mt-0 lg:ml-8">
          <img
            src={assets.app_main_img}
            alt="App preview"
            className="max-h-72 object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default AppDownload;
