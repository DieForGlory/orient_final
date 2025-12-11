import React, { useState, useRef, useCallback } from 'react';
import { XIcon, UploadCloudIcon, CheckCircleIcon, AlertCircleIcon, FileIcon } from 'lucide-react';
import { api } from '../../services/api';

interface BulkImageUploadModalProps {
  onClose: () => void;
  onComplete: () => void;
}

interface LogItem {
  filename: string;
  status: 'pending' | 'success' | 'error';
  message?: string;
}

export function BulkImageUploadModal({ onClose, onComplete }: BulkImageUploadModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [queue, setQueue] = useState<File[]>([]);
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const processQueue = async (files: File[]) => {
    setProcessing(true);
    const newLogs: LogItem[] = files.map(f => ({ filename: f.name, status: 'pending' }));
    setLogs(prev => [...prev, ...newLogs]); // Добавляем в лог
    setProgress({ current: 0, total: files.length });

    let successCount = 0;

    // Обрабатываем файлы по одному (последовательно, чтобы не положить сервер)
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        await api.uploadBulkImage(file);

        // Обновляем статус в логе
        setLogs(prev => prev.map(log =>
          log.filename === file.name ? { ...log, status: 'success' } : log
        ));
        successCount++;
      } catch (error: any) {
        setLogs(prev => prev.map(log =>
          log.filename === file.name ? { ...log, status: 'error', message: error.message } : log
        ));
      }

      setProgress(prev => ({ ...prev, current: i + 1 }));
    }

    setProcessing(false);
    if (successCount > 0) {
        // Можно обновить список товаров на фоне
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));
    setQueue(prev => [...prev, ...fileArray]);
    processQueue(fileArray);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const successLogs = logs.filter(l => l.status === 'success');
  const errorLogs = logs.filter(l => l.status === 'error');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-lg shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold uppercase tracking-wider">Массовая загрузка фото</h2>
            <p className="text-xs text-gray-500 mt-1">Формат имени: SKU-Номер.jpg (например RE-BT0006L00B-1.jpg)</p>
          </div>
          <button onClick={onClose} disabled={processing} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Dropzone */}
          {!processing && (
            <div
              className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => handleFiles(e.target.files)}
                accept="image/*"
              />
              <div className="flex flex-col items-center pointer-events-none">
                <UploadCloudIcon className={`w-12 h-12 mb-4 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
                <p className="text-lg font-medium text-gray-700">Перетащите файлы сюда</p>
                <p className="text-sm text-gray-400 mt-2">или нажмите для выбора (до 1000 шт)</p>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {processing && (
            <div className="space-y-2">
               <div className="flex justify-between text-sm font-medium">
                 <span>Загрузка...</span>
                 <span>{progress.current} / {progress.total}</span>
               </div>
               <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                 <div
                    className="bg-blue-600 h-full transition-all duration-300"
                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                 ></div>
               </div>
            </div>
          )}

          {/* Results Report */}
          {logs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Errors Column */}
              <div className="border border-red-100 rounded-lg overflow-hidden bg-red-50/50">
                <div className="p-3 bg-red-100/50 border-b border-red-100 font-bold text-red-700 text-sm flex justify-between">
                  <span>Ошибки</span>
                  <span className="bg-white px-2 rounded-full text-xs py-0.5">{errorLogs.length}</span>
                </div>
                <div className="max-h-60 overflow-y-auto p-3 space-y-2">
                  {errorLogs.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">Ошибок нет</p>
                  ) : (
                    errorLogs.map((log, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-red-600 bg-white p-2 rounded border border-red-100">
                        <AlertCircleIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold break-all">{log.filename}</p>
                          <p className="opacity-80">{log.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Success Column */}
              <div className="border border-green-100 rounded-lg overflow-hidden bg-green-50/50">
                <div className="p-3 bg-green-100/50 border-b border-green-100 font-bold text-green-700 text-sm flex justify-between">
                  <span>Успешно</span>
                  <span className="bg-white px-2 rounded-full text-xs py-0.5">{successLogs.length}</span>
                </div>
                <div className="max-h-60 overflow-y-auto p-3 space-y-2">
                   {successLogs.length === 0 && !processing ? (
                    <p className="text-xs text-gray-400 italic">Нет загруженных файлов</p>
                  ) : (
                    successLogs.map((log, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-green-700 bg-white p-2 rounded border border-green-100">
                        <CheckCircleIcon className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{log.filename}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={() => {
                onClose();
                if (successLogs.length > 0) onComplete();
            }}
            disabled={processing}
            className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50 font-medium uppercase text-sm tracking-wider"
          >
            {processing ? 'Подождите...' : 'Закрыть'}
          </button>
        </div>
      </div>
    </div>
  );
}