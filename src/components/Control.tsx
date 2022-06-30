import Button from './Button';
import upload from '../assets/upload.svg';
import download from '../assets/download.svg';
import { webglStatus } from '../lib';
import { getImageUrl, downloadImage } from '../utils';

interface ControlProps {
  threshold: number;
  onImageChange: (url: string) => void;
  onThresholdChange: (threshold: number) => void;
}

export default function Control(props: ControlProps) {
  const { onImageChange, threshold, onThresholdChange } = props;

  const handleImportImage = async () => {
    const url = await getImageUrl();
    onImageChange(url);
  };

  const handleDownload = () => {
    if (!webglStatus.ctx) {
      alert('Failed to download image');
      return;
    }

    webglStatus.ctx.canvas.toBlob(blob => {
      if (!blob) {
        alert('Failed to get image data');
        return;
      }
      const url = URL.createObjectURL(blob);
      downloadImage(url);
      URL.revokeObjectURL(url);
    });
  };

  return (
    <>
      <div className="flex xl:flex-col xl:w-8/12 xl:mx-auto gap-5 mt-6">
        <Button
          className="flex-1 py-2 border-2 text-lg"
          iconUrl={upload}
          onClick={handleImportImage}
        >
          导入图片
        </Button>
        <Button
          className="flex-1 py-2 border-2 text-lg"
          iconUrl={download}
          onClick={handleDownload}
        >
          下载
        </Button>
      </div>
      <div className="flex justify-center mt-12 px-8">
        <input
          className="block w-full appearance-none bg-light-500 rounded-full"
          type="range"
          id="threshold"
          value={threshold}
          onChange={e => onThresholdChange(Number(e.target.value))}
          min={0}
          max={100}
        />
      </div>
    </>
  );
}
