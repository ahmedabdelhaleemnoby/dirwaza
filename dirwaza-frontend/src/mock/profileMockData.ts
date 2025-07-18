// Mock Profile Data similar to mockCalendarData pattern
export interface ProfileData {
  name: string;
  phone: string;
  image?: string;
  email?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const mockProfileData: ProfileData = {
  name: "User-111",
  phone: "+966 50 123 4567",
  image: "/icons/profile.svg",
  email: "",
  isActive: true,
  createdAt: "2025-07-03T08:03:55.381Z",
  updatedAt: "2025-07-18T00:03:33.133Z"
}; 