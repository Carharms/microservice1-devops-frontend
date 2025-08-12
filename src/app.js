import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch products from API
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
        
        fetch(`${apiUrl}/api/products`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch products');
                }
                return res.json();
            })
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching products:', err);
                setError(err.message);
                setLoading(false);
                // Fallback to mock data for demo
                setProducts([
                    { id: 1, name: 'Sample Product 1', price: 29.99 },
                    { id: 2, name: 'Sample Product 2', price: 49.99 }
                ]);
            });
    }, []);

    const createOrder = (productId) => {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
        
        fetch(`${apiUrl}/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productId: productId,
                quantity: 1
            })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Failed to create order');
            }
            return res.json();
        })
        .then(data => {
            alert('Order created successfully!');
            setOrders([...orders, data]);
        })
        .catch(err => {
            console.error('Error creating order:', err);
            alert('Failed to create order. Please try again.');
        });
    };

    if (loading) {
        return <div className="loading">Loading products...</div>;
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>E-Commerce Store</h1>
            </header>
            <main>
                <h2>Products</h2>
                {error && <div className="error">Warning: {error}. Showing demo data.</div>}
                <div className="products-grid">
                    {products.map(product => (
                        <div key={product.id} className="product-card">
                            <h3>{product.name}</h3>
                            <p className="price">Price: ${product.price}</p>
                            <button 
                                className="buy-button"
                                onClick={() => createOrder(product.id)}
                            >
                                Buy Now
                            </button>
                        </div>
                    ))}
                </div>
                {orders.length > 0 && (
                    <div className="orders-section">
                        <h3>Recent Orders: {orders.length}</h3>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;