import {cookies} from 'next/headers';

export type User = {
  id: string;
  name?: string;
  email?: string;
  role: string;
  phone: string;
  image?: string;
};

export async function auth(): Promise<{ user?: User }> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;
  
  if (!token) return {};
  
  // In a real app, you would verify the token and fetch user data
  return {
    user: {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      phone: '+974 50 123 4567',
      image: '/icons/profile.svg'
    }
  };
}