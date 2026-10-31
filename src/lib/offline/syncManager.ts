import { useState, useEffect } from 'react';
import { db } from '../db';
import { Attempt } from '../../types';

const OFFLINE_QUEUE_KEY = 'gatipath_offline_attempt_queue';

export interface QueuedAttempt extends Omit<Attempt, 'id' | 'createdAt'> {
  queuedAt: string;
}

export class OfflineSyncManager {
  private queue: QueuedAttempt[] = [];
  private listeners: Set<(isOnline: boolean, queueCount: number) => void> = new Set();
  private onlineStatus: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;

  constructor() {
    this.queue = this.loadQueue();
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline.bind(this));
      window.addEventListener('offline', this.handleOffline.bind(this));
    }
  }

  private loadQueue(): QueuedAttempt[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(OFFLINE_QUEUE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveQueue(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(this.queue));
    } catch (e) {
      console.warn('Could not persist offline queue:', e);
    }
  }

  public isOnline(): boolean {
    return this.onlineStatus;
  }

  public getQueuedCount(): number {
    return this.queue.length;
  }

  public enqueueAttempt(attempt: Omit<Attempt, 'id' | 'createdAt'>): void {
    const queued: QueuedAttempt = {
      ...attempt,
      queuedAt: new Date().toISOString()
    };
    this.queue.push(queued);
    this.saveQueue();
    this.notifyListeners();
  }

  private handleOnline(): void {
    this.onlineStatus = true;
    this.syncQueuedAttempts();
    this.notifyListeners();
  }

  private handleOffline(): void {
    this.onlineStatus = false;
    this.notifyListeners();
  }

  /**
   * Safely replays all queued attempts into local persistent store with idempotent keys.
   */
  public syncQueuedAttempts(): { syncedCount: number } {
    if (this.queue.length === 0) return { syncedCount: 0 };

    let count = 0;
    const itemsToProcess = [...this.queue];
    this.queue = [];
    this.saveQueue();

    for (const item of itemsToProcess) {
      try {
        db.recordAttempt(item);
        count++;
      } catch (err) {
        console.warn('Error syncing attempt, re-queueing:', err);
        this.queue.push(item);
      }
    }

    this.saveQueue();
    this.notifyListeners();
    return { syncedCount: count };
  }

  public subscribe(callback: (isOnline: boolean, queueCount: number) => void): () => void {
    this.listeners.add(callback);
    callback(this.onlineStatus, this.queue.length);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(): void {
    this.listeners.forEach(cb => cb(this.onlineStatus, this.queue.length));
  }
}

export const syncManager = new OfflineSyncManager();

/**
 * React hook to observe online/offline connectivity and pending synced attempts.
 */
export function useNetworkStatus(): {
  isOnline: boolean;
  queuedCount: number;
  syncNow: () => void;
} {
  const [status, setStatus] = useState<{ isOnline: boolean; queuedCount: number }>({
    isOnline: syncManager.isOnline(),
    queuedCount: syncManager.getQueuedCount()
  });

  useEffect(() => {
    return syncManager.subscribe((isOnline, queuedCount) => {
      setStatus({ isOnline, queuedCount });
    });
  }, []);

  return {
    isOnline: status.isOnline,
    queuedCount: status.queuedCount,
    syncNow: () => syncManager.syncQueuedAttempts()
  };
}
