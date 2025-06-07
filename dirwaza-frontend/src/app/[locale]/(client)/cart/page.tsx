import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import CartClient from '@/components/cart/CartClient';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Cart');
  
  return {
    title: t('title'),
    description: 'View and manage your shopping cart'
  };
}

export default function CartPage() {
  return (
    <div className="container-padding py-8">
      <CartClient />
    </div>
  );
}