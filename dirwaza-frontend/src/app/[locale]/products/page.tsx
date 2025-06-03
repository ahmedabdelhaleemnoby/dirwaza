import { useTranslations } from 'next-intl';
// import ProductCard from '@/components/ui/ProductCard';

export default function ProductsPage() {
  const t = useTranslations('ProductPage');
  
  // Mock products data
  // const products = [
  //   { id: 1, name: "Product 1", price: 99.99, description: "Amazing product" },
  //   { id: 2, name: "Product 2", price: 149.99, description: "Premium product" },
  //   { id: 3, name: "Product 3", price: 199.99, description: "Luxury product" },
  // ];
  
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">{t('title')}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">{t('description')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))} */}
      </div>
    </div>
  );
}