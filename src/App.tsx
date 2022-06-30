import { useState } from 'react';
import icon from './assets/icon.svg';
import demoImage from './assets/demo.jpg';
import CanvasImage from './components/CanvasImage';
import Control from './components/Control';
import { getLanguage, isMobile } from './utils';

function App() {
  const [imageUrl, setImageUrl] = useState(demoImage);
  const [threshold, setThreshold] = useState(50);

  return (
    <div className="App flex flex-col min-h-screen">
      <header className="flex items-center gap-3 px-4 py-2 border-b text-lg font-mono font-bold">
        <img className="w-6" src={icon} alt="icon" />
        <span>Thresholding</span>
      </header>
      <main className="xl:flex xl:gap-6 flex-1 px-4 py-4 md:w-8/12 md:mx-auto">
        <CanvasImage
          className="xl:flex-1"
          imageUrl={imageUrl}
          threshold={threshold}
        />
        <div className="xl:flex-1 self-center">
          <Control
            threshold={threshold}
            onImageChange={url => setImageUrl(url)}
            onThresholdChange={threshold => setThreshold(threshold)}
          />
          {isMobile() && (
            <div className="mt-8 text-xs text-gray-400 text-center space-y-2">
              {getLanguage() === 'zh-CN'
                ? '由于设备限制，移动端无法处理分辨率较高的图片'
                : 'Due to device limitations, mobile devices cannot handle higher resolution images'}
            </div>
          )}
        </div>
      </main>
      <footer className="py-3 text-center text-gray-200 lg:text-sm">
        <div className="italic text-gray-400">
          built by{' '}
          <a
            className="text-gray-700"
            href="https://github.com/banqinghe"
            target="_blank"
          >
            @banqinghe
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
