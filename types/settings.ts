export interface SecuritySettingsDto {
    currentPassword?: string;
    newPassword?: string;
    enable2FA?: boolean;
  }
  
  export interface SecuritySettingsResponse {
    success: boolean;
    message: string;
  }
  