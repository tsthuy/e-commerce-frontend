import { memo, useMemo } from 'react';

import { Loader2 } from 'lucide-react';

interface FileProgress {
  fileName: string;
  percent: number;
}

type ProgressDisplayMode = 'multiple' | 'single';

interface UploadProgressProps {
  isUploading: boolean;

  progress: { [fileName: string]: number };

  mode?: ProgressDisplayMode;

  className?: string;
}

export const UploadProgress = memo(({ isUploading, progress, mode = 'single', className = '' }: UploadProgressProps) => {
  const progressEntries = useMemo(() => {
    return Object.entries(progress).map(
      ([fileName, percent]): FileProgress => ({
        fileName,
        percent
      })
    );
  }, [progress]);

  const averageProgress = useMemo(() => {
    if (progressEntries.length === 0) return 0;
    return progressEntries.reduce((sum, entry) => sum + entry.percent, 0) / progressEntries.length;
  }, [progressEntries]);

  if (!isUploading || progressEntries.length === 0) {
    return null;
  }

  return (
    <div className={`mt-3 space-y-2 ${className}`}>
      {mode === 'single' ? (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>
                Uploading {progressEntries.length} {progressEntries.length === 1 ? 'file' : 'files'}
              </span>
            </div>
            <span>{Math.round(averageProgress)}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-gray-200">
            <div className="h-1.5 rounded-full bg-blue-600 transition-all duration-300" style={{ width: `${averageProgress}%` }} />
          </div>
        </div>
      ) : (
        progressEntries.map(({ fileName, percent }) => (
          <div key={fileName} className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span className="max-w-[200px] truncate">{fileName}</span>
              <span>{percent}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-gray-200">
              <div className="h-1.5 rounded-full bg-blue-600 transition-all duration-300" style={{ width: `${percent}%` }} />
            </div>
          </div>
        ))
      )}
    </div>
  );
});

UploadProgress.displayName = 'UploadProgress';
