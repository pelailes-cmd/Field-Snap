import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import { useAuth } from './AuthContext';

export interface FieldRecord {
  id: string;
  userId: string;
  imageData: string;
  timestamp: number;
  metadata: {
    projectName: string;
    location: string;
    trade: string;
    details: string;
    engineer: string;
    inspectedBy: string;
    remarks: string;
  };
}

export type TaskStatus = 'Pending' | 'On-going' | 'Completed' | 'Cancelled';

export interface ScheduleEvent {
  id: string;
  userId: string;
  subject: string;
  notes: string;
  details: string; // New field
  dateTime: string;
  status: TaskStatus; // Replaces isCompleted boolean
}

interface FieldSnapDB extends DBSchema {
  records: {
    key: string;
    value: FieldRecord;
    indexes: { 
      'by-date': number;
      'by-user': string;
    };
  };
  schedules: {
    key: string;
    value: ScheduleEvent;
    indexes: {
      'by-user': string;
      'by-date': string;
    };
  };
}

interface StorageContextType {
  saveRecord: (record: Omit<FieldRecord, 'userId'>) => Promise<void>;
  getRecords: () => Promise<FieldRecord[]>;
  deleteRecord: (id: string) => Promise<void>;
  saveSchedule: (event: Omit<ScheduleEvent, 'userId'>) => Promise<void>;
  getSchedules: () => Promise<ScheduleEvent[]>;
  deleteSchedule: (id: string) => Promise<void>;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export const StorageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [db, setDb] = useState<IDBPDatabase<FieldSnapDB> | null>(null);

  useEffect(() => {
    const initDB = async () => {
      try {
        const dbInstance = await openDB<FieldSnapDB>('field-snap-db', 5, { // Bump to 5 for status change
          upgrade(db, _oldVersion, _newVersion, transaction) {
            if (!db.objectStoreNames.contains('records')) {
              const store = db.createObjectStore('records', { keyPath: 'id' });
              store.createIndex('by-date', 'timestamp');
              store.createIndex('by-user', 'userId');
            }
            if (!db.objectStoreNames.contains('schedules')) {
              const store = db.createObjectStore('schedules', { keyPath: 'id' });
              store.createIndex('by-user', 'userId');
              store.createIndex('by-date', 'dateTime');
            }
          },
        });
        setDb(dbInstance);
      } catch (err) {
        console.error("IndexedDB Init Error:", err);
      }
    };
    initDB();
  }, []);

  const saveRecord = async (record: Omit<FieldRecord, 'userId'>) => {
    if (!db || !user) return;
    await db.put('records', { ...record, userId: user.id });
  };

  const getRecords = async () => {
    if (!db || !user) return [];
    const allRecords = await db.getAllFromIndex('records', 'by-user', user.id);
    return allRecords.sort((a, b) => b.timestamp - a.timestamp);
  };

  const deleteRecord = async (id: string) => {
    if (!db) return;
    await db.delete('records', id);
  };

  const saveSchedule = async (event: Omit<ScheduleEvent, 'userId'>) => {
    if (!db || !user) return;
    await db.put('schedules', { ...event, userId: user.id });
  };

  const getSchedules = async () => {
    if (!db || !user) return [];
    const all = await db.getAllFromIndex('schedules', 'by-user', user.id);
    return all.sort((a, b) => a.dateTime.localeCompare(b.dateTime));
  };

  const deleteSchedule = async (id: string) => {
    if (!db) return;
    await db.delete('schedules', id);
  };

  return (
    <StorageContext.Provider value={{ 
      saveRecord, getRecords, deleteRecord, 
      saveSchedule, getSchedules, deleteSchedule 
    }}>
      {children}
    </StorageContext.Provider>
  );
};

export const useStorage = () => {
  const context = useContext(StorageContext);
  if (!context) throw new Error('useStorage must be used within a StorageProvider');
  return context;
};
