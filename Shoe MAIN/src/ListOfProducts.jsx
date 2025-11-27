import React, { useState, useEffect } from 'react';
import { SampleData } from './sampleData.js';
import { useNavigate } from 'react-router-dom';

function ListOfProducts({ searchQuery }) {
    const navigateTo = useNavigate();
    const [sortOrder, setSortOrder] = useState('');
    const [filteredData, setFilteredData] = useState(SampleData);

    const handleClick = (product) => {
        navigateTo('/product-details', { state: product });
    };

    // Filter by search query
    useEffect(() => {
        if (searchQuery) {
            const results = SampleData.filter(product =>
                product.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredData(results);
        } else {
            setFilteredData(SampleData);
        }
    }, [searchQuery]);

    // Sort products by price
    const sortedData = [...filteredData].sort((a, b) => {
        if (sortOrder === 'lowToHigh') return a.price - b.price;
        if (sortOrder === 'highToLow') return b.price - a.price;
        return 0;
    });

    return (
        <div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 60px',
                flexWrap: 'wrap'
            }}>
                <h1 style={{
                    color: '#7a3f4b',
                    fontSize: '36px',
                    marginTop: '40px',
                    marginBottom: '20px'
                }}>
                    Our Products
                </h1>

                <div style={{ marginTop: '40px' }}>
                    <label htmlFor="sort">Sort by Price: </label>
                    <select
                        id="sort"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        aria-label="Sort products by price"
                    >
                        <option value="">-- Select --</option>
                        <option value="lowToHigh">Low to High</option>
                        <option value="highToLow">High to Low</option>
                    </select>
                </div>
            </div>

            <div className='container'>
                {sortedData.length > 0 ? (
                    sortedData.map((ele, index) => (
                        <div
                            className='card'
                            key={index}
                            onClick={() => handleClick(ele)}
                            role="button"
                            tabIndex={0}
                            onKeyPress={(e) => e.key === 'Enter' && handleClick(ele)}
                        >
                            <img src={ele.image} alt={ele.title} />
                            <p className="product-title">{ele.title}</p>
                            <p className="product-description">
                                {ele.description || "A delightful treat perfect for every occasion."}
                            </p>
                            <p className="product-price">₹{ele.price.toFixed(2)}</p>
                            <button className="card-button">➜</button>
                        </div>
                    ))
                ) : (
                    <p style={{ padding: '20px', textAlign: 'center' }}>No products found.</p>
                )}
            </div>
        </div>
    );
}

export default ListOfProducts;
