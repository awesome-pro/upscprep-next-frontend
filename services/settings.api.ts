import { api } from '@/lib/axios';
import {
  SecuritySettingsDto,
  SecuritySettingsResponse
} from '@/types';

export const settingsApi = {
  updateSecuritySettings: async (data: SecuritySettingsDto) => {
    return api.patch<SecuritySettingsResponse>('/settings/security', data);
  }
};

export default settingsApi;
