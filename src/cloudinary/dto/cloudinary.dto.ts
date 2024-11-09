export interface TCloudinaryImageUpload {
    asset_id: string;
    public_id: string;
    version: number;
    version_id: string;
    signature: string;
    width: number;
    height: number;
    format: string;
    resource_type: string;
    created_at: string; // Use Date for actual date object
    tags: string[];
    pages: number;
    bytes: number;
    type: string;
    etag: string;
    placeholder: boolean;
    url: string;
    secure_url: string;
    folder: string;
    overwritten: boolean;
    original_filename: string;
    api_key: string; // Consider making this private for security reasons
  }