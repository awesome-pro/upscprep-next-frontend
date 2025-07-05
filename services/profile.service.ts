import api from '@/lib/axios';
import { User, UpdateUserDto } from '../types/user';

const BASE_URL = '/profile';

/**
 * Service for managing user profile
 */
const profileService = {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    return (await api.get(BASE_URL)).data;
  },

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateUserDto): Promise<User> {
    return (await api.patch(BASE_URL, data)).data;
  },
};

export default profileService;
