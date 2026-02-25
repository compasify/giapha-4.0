'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

function isTauriEnv(): boolean {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

export function UpdateChecker() {
  const checkedRef = useRef(false);

  useEffect(() => {
    if (!isTauriEnv() || checkedRef.current) return;
    checkedRef.current = true;

    const checkForUpdate = async () => {
      try {
        const { check } = await import('@tauri-apps/plugin-updater');
        const { relaunch } = await import('@tauri-apps/plugin-process');

        const update = await check();
        if (!update) return;

        toast.info(`Phiên bản mới ${update.version}`, {
          description: update.body || 'Đã có bản cập nhật mới.',
          duration: Infinity,
          action: {
            label: 'Cập nhật ngay',
            onClick: () => installUpdate(update, relaunch),
          },
        });
      } catch (err) {
        console.warn('[updater] check failed:', err);
      }
    };

    const timeout = setTimeout(checkForUpdate, 3000);
    return () => clearTimeout(timeout);
  }, []);

  return null;
}

async function installUpdate(
  update: Awaited<NonNullable<ReturnType<typeof import('@tauri-apps/plugin-updater').check>>>,
  relaunch: typeof import('@tauri-apps/plugin-process').relaunch
) {
  const toastId = toast.loading('Đang tải cập nhật...', { duration: Infinity });

  try {
    let downloaded = 0;
    let total = 0;

    await update.downloadAndInstall((event) => {
      switch (event.event) {
        case 'Started':
          total = event.data.contentLength ?? 0;
          break;
        case 'Progress':
          downloaded += event.data.chunkLength;
          if (total > 0) {
            const pct = Math.round((downloaded / total) * 100);
            toast.loading(`Đang tải: ${pct}%`, { id: toastId, duration: Infinity });
          }
          break;
        case 'Finished':
          toast.success('Cập nhật hoàn tất! Đang khởi động lại...', {
            id: toastId,
            duration: 2000,
          });
          break;
      }
    });

    await relaunch();
  } catch (err) {
    toast.error('Cập nhật thất bại', {
      id: toastId,
      description: String(err),
      duration: 5000,
    });
  }
}
