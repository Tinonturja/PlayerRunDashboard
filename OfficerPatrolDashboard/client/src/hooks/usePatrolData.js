import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchData, uploadFile } from '../lib/api';
import { useUIStore } from '../store/uiStore';

const DATA_KEY = ['patrol-data'];

export function usePatrolData() {
  return useQuery({
    queryKey: DATA_KEY,
    queryFn: fetchData,
    staleTime: 30_000,
  });
}

export function useUploadPatrol() {
  const qc = useQueryClient();
  const pushToast = useUIStore((s) => s.pushToast);

  return useMutation({
    mutationFn: uploadFile,
    onSuccess: (data) => {
      // Optimistically seed the data cache with the parsed response so the
      // dashboard updates *immediately*, before the next refetch.
      qc.setQueryData(DATA_KEY, {
        officers: data.officers,
        uploadedAt: data.uploadedAt,
        originalName: data.originalName,
        size: data.size,
      });
      qc.invalidateQueries({ queryKey: DATA_KEY });
      pushToast({
        kind: 'success',
        title: 'Upload successful',
        message: `${data.originalName || 'file'} parsed — ${data.officers?.length ?? 0} officers loaded`,
      });
    },
    onError: (err) => {
      pushToast({
        kind: 'error',
        title: 'Upload failed',
        message: err?.message || 'Unknown error',
      });
    },
  });
}
