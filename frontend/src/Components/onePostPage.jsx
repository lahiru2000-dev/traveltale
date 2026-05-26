import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CommentSection from './CommentSection';

const OnePostPage = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        // Fetch current user
        axios.get('http://localhost:8000/dashboard', { withCredentials: true })
            .then(res => {
                if (res.data.status === 'success') {
                    setCurrentUser(res.data.user.id);
                }
            })
            .catch(err => console.error("Error fetching user:", err));

        // Fetch post data
        axios.get(`http://localhost:8000/get-post/${id}`, { withCredentials: true })
            .then(res => {
                if (res.data.status === 'success') {
                    setPost(res.data.post);
                } else {
                    setError('Post not found');
                }
            })
            .catch(err => {
                console.error("Error fetching post:", err);
                setError('Failed to load post');
            });

        // Fetch countries data
        axios.get("https://restcountries.com/v3.1/all?fields=name,capital,currencies,languages,flags")
            .then(res => setCountries(res.data))
            .catch(err => console.error("Error fetching countries:", err));
    }, [id]);

    const getCountryInfo = (countryName) => {
        return countries.find(country => 
            country.name.common.toLowerCase() === countryName.toLowerCase() ||
            country.name.official.toLowerCase() === countryName.toLowerCase()
        );
    };

    if (error) {
        return <div className="container my-5 text-danger">{error}</div>;
    }

    if (!post) {
        return <div className="container my-5">Loading post...</div>;
    }

    const countryInfo = getCountryInfo(post.country_name);

    return (
        <div className="container my-5">
            <article className="card shadow-sm mb-5">
                <div className="card-body">
                    <h1 className="card-title mb-4">{post.title}</h1>
                    
                    <div className="mb-4">
                        <p className="lead">{post.content}</p>
                    </div>

                    <div className="row g-4">
                        <div className="col-md-6">
                            <div className="border p-3 rounded">
                                <h5 className="mb-3">Travel Details</h5>
                                <p><strong>Country:</strong> {post.country_name}</p>
                                <p><strong>Date of Visit:</strong> {new Date(post.date_of_visit).toLocaleDateString()}</p>
                            </div>
                        </div>

                        {countryInfo && (
                            <div className="col-md-6">
                                <div className="border p-3 rounded">
                                    <h5 className="mb-3">Country Information</h5>
                                    <img 
                                        src={countryInfo.flags.png} 
                                        alt={`${post.country_name} Flag`} 
                                        className="img-thumbnail mb-3"
                                        style={{ width: '120px' }}
                                    />
                                    <p><strong>Capital:</strong> {countryInfo.capital?.[0] || 'N/A'}</p>
                                    <p>
                                        <strong>Currency:</strong> {
                                            countryInfo.currencies ? 
                                            Object.values(countryInfo.currencies)
                                                .map(c => `${c.name} (${c.symbol})`)
                                                .join(', ') : 'N/A'
                                        }
                                    </p>
                                    <p>
                                        <strong>Languages:</strong> {
                                            countryInfo.languages ?
                                            Object.values(countryInfo.languages).join(', ') : 'N/A'
                                        }
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </article>

            <section className="mt-5">
                <CommentSection postId={post.id} currentUser={currentUser} />
            </section>
        </div>
    );
};

export default OnePostPage;