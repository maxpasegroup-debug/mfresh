import { useRef, useState } from 'react';
import Button from '../ui/Button.jsx';

export default function ImageUpload({
  multiple = false,
  maxFiles = 5,
  onFilesSelected,
  existingImages = [],
  onDeleteExisting,
}) {
  const inputRef = useRef(null);
  const [previews, setPreviews] = useState([]);

  const pickFiles = (event) => {
    const files = Array.from(event.target.files || [])
      .filter((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
      .filter((file) => file.size <= 5 * 1024 * 1024)
      .slice(0, maxFiles);

    setPreviews(files.map((file) => ({ file, url: URL.createObjectURL(file) })));
    onFilesSelected(files);
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple={multiple}
        onChange={pickFiles}
        className="hidden"
      />
      <Button variant="secondary" onClick={() => inputRef.current?.click()}>
        Choose image{multiple ? 's' : ''}
      </Button>
      <div className="grid grid-cols-4 gap-2">
        {existingImages.map((image) => (
          <div key={image.public_id || image.url} className="relative h-16 overflow-hidden rounded-2xl bg-brand-bg">
            <img src={image.url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onDeleteExisting?.(image.public_id)}
              className="absolute right-1 top-1 h-5 w-5 rounded-full bg-red-600 text-xs text-white"
            >
              x
            </button>
          </div>
        ))}
        {previews.map((preview) => (
          <div key={preview.url} className="h-16 overflow-hidden rounded-2xl bg-brand-bg">
            <img src={preview.url} alt={preview.file.name} className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
