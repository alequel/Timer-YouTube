import React, { useState, useEffect } from 'react';

interface SettingsProps {
  onStart: (duration: number, imageFile: File | 'greenscreen', theme: string) => void;
}

const DURATION_OPTIONS = [10, 15, 20, 25, 30, 45, 50, 60].sort((a, b) => a - b);
const THEME_OPTIONS = [
  { value: 'glass', label: 'Glass' },
  { value: 'glass2', label: 'Glass 2' },
  { value: 'office', label: 'Office' },
  { value: 'relax', label: 'Relax' },
];

const Settings: React.FC<SettingsProps> = ({ onStart }) => {
  const [duration, setDuration] = useState<number>(DURATION_OPTIONS[0]);
  const [theme, setTheme] = useState<string>(THEME_OPTIONS[0].value);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [useGreenScreen, setUseGreenScreen] = useState(false);

  useEffect(() => {
    return () => {
      if (mediaUrl) {
        URL.revokeObjectURL(mediaUrl);
      }
    };
  }, [mediaUrl]);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        setError('File is too large. Please select a file under 50MB.');
        return;
      }
      setMediaFile(file);
      if (mediaUrl) {
        URL.revokeObjectURL(mediaUrl);
      }
      setMediaUrl(URL.createObjectURL(file));
      setUseGreenScreen(false);
    }
  };

  const handleGreenScreenToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setUseGreenScreen(isChecked);
    if (isChecked) {
      setError('');
      setMediaFile(null);
      if (mediaUrl) {
        URL.revokeObjectURL(mediaUrl);
        setMediaUrl(null);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (useGreenScreen) {
      onStart(duration, 'greenscreen', theme);
    } else if (mediaFile) {
      onStart(duration, mediaFile, theme);
    } else {
      setError('Please select a background or use the green screen option.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-orange-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6 transform transition-all hover:shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-orange-800">
          Create Your Countdown
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-2 gap-6">
             <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
              <div className="relative">
                <select
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full appearance-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block p-3 pr-10"
                >
                  {DURATION_OPTIONS.map((d) => (
                    <option key={d} value={d}>
                      {d} minutes
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              <div className="relative">
                <select
                  id="theme"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full appearance-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block p-3 pr-10"
                >
                  {THEME_OPTIONS.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
          </div>
         
          <div className="relative flex items-start">
            <div className="flex h-6 items-center">
              <input
                id="greenscreen"
                name="greenscreen"
                type="checkbox"
                checked={useGreenScreen}
                onChange={handleGreenScreenToggle}
                className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
            </div>
            <div className="ml-3 text-sm leading-6">
              <label htmlFor="greenscreen" className="font-medium text-gray-900">
                Use Green Screen
              </label>
              <p className="text-gray-500">
                Use a solid green background for chroma keying.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Image or Video
            </label>
            <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md transition-colors ${useGreenScreen ? 'bg-green-500' : ''}`}>
              <div className="space-y-1 text-center">
                {useGreenScreen ? (
                   <div className="flex flex-col items-center text-white py-4 pointer-events-none">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                           <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z" />
                       </svg>
                       <p className="font-semibold mt-2">Green Screen Active</p>
                   </div>
                ) : mediaUrl && mediaFile ? (
                   mediaFile.type.startsWith('video/') ? (
                    <video src={mediaUrl} muted playsInline className="mx-auto h-24 w-auto rounded-md object-cover" />
                  ) : (
                    <img src={mediaUrl} alt="Background preview" className="mx-auto h-24 w-auto rounded-md object-cover" />
                  )
                ) : (
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                <div className="flex text-sm text-gray-600 justify-center">
                  <label htmlFor="file-upload" className={`relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500 ${useGreenScreen ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <span>{mediaFile && !useGreenScreen ? 'Change file' : 'Upload a file'}</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/png, image/jpeg, image/gif, video/mp4" onChange={handleMediaChange} disabled={useGreenScreen} />
                  </label>
                </div>
                <p className={`text-xs transition-colors ${useGreenScreen ? 'text-white/80' : 'text-gray-500'}`}>
                  PNG, JPG, GIF, MP4 up to 50MB
                </p>
              </div>
            </div>
          </div>
          
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <button
            type="submit"
            disabled={!mediaFile && !useGreenScreen}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Start Timer
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;