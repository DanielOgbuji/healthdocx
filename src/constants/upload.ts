export const UploadStatus = {
    Idle: "idle",
    Cropping: "cropping",
    Uploading: "uploading",
    Success: "success",
    Error: "error",
} as const;

export type UploadStatus = typeof UploadStatus[keyof typeof UploadStatus];

export const StorageKeys = {
    RecentRecords: "healthdocx_recent_records",
    InstitutionsPrefix: "institutions-",
    RecordId: "recordId",
} as const;

export type StorageKeys = typeof StorageKeys[keyof typeof StorageKeys];
