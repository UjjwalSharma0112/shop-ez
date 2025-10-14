import { useEffect, useState } from 'react';
import { Plus, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { api } from '../api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();
  const { userType } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    if (userType !== 'user') {
      navigate('/login');
      return;
    }

    if (product.stock === 0) {
      alert('Product is out of stock');
      return;
    }

    addToCart({
      productId: product.id,
      quantity: 1,
      product,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">All Products</h1>
          <p className="text-gray-600">Discover amazing products at great prices</p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-24 h-24 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-xl">No products available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                  <ShoppingBag className="w-20 h-20 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">
                    {product.name}
                  </h3>

                  {product.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-blue-600">
                      ${product.price.toFixed(2)}
                    </span>
                    <span
                      className={`text-sm px-3 py-1 rounded-full ${
                        product.stock > 10
                          ? 'bg-green-100 text-green-700'
                          : product.stock > 0
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>

                  {product.vendor && (
                    <p className="text-xs text-gray-500 mb-4">
                      Sold by: <span className="font-medium">{product.vendor.name}</span>
                    </p>
                  )}

                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
