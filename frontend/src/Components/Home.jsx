import React, { useState, useEffect, use } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';



const Home = () => {
    const[latestPosts,setLatestPosts] = React.useState([]);
    const [countries, setCountries] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
       //fetch posts data
       axios.get('http://localhost:8000/get-posts', { withCredentials: true })
        .then (res => {
            if (res.data.status === 'success') {
                const latestPosts = res.data.posts.slice(0, 3); 
                setLatestPosts(latestPosts);
            } else {
                console.error("Error fetching posts:", res.data.error);
            }
        })
        .catch(err => {
            console.error("Error fetching posts:", err);
        });  

        axios.get("https://restcountries.com/v3.1/all?fields=name,capital,currencies,languages,flags")
        .then(res => setCountries(res.data))
        .catch(err => console.error("Error fetching countries:", err));

        
        
      }, []);
      const getCountryInfo = (countryName) => {
        return countries.find(country => 
          country.name.common.toLowerCase() === countryName.toLowerCase() ||
          country.name.official.toLowerCase() === countryName.toLowerCase()
        );
      };

      return (
        <div>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>Welcome to Travel Tales</h1>
            <p>Your next adventure begins here!</p>
          </div>
    
          
          {/* carousal Section */}
          <div
            id="carouselExampleIndicators"
            className="carousel slide"
            data-bs-ride="carousel"
            style={{ height: '700px', overflow: 'hidden' }}
            >
            <div className="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true"></button>
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"></button>
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"></button>
            </div>
            <div className="carousel-inner" style={{ height: '100%' }}>
                <div className="carousel-item active">
                <img
                    src="/images/carousal/natur_water_sea_travel_sky_beach_turquoise_summer_island_4k_hd.jpg"
                    className="d-block w-100"
                    alt="Slide 1"
                    style={{ height: '100%', objectFit: 'cover' }}
                />
                </div>
                <div className="carousel-item">
                <img
                    src="/images/carousal/australia_building_city_night_skyscraper_sydney_opera_house_4k_5k_hd_travel.jpg"
                    className="d-block w-100"
                    alt="Slide 2"
                    style={{ height: '100%', objectFit: 'cover' }}
                />
                </div>
                <div className="carousel-item">
                <img
                    src="/images/carousal/wallpaperflare.com_wallpaper.jpg"
                    className="d-block w-100"
                    alt="Slide 3"
                    style={{ height: '100%', objectFit: 'cover' }}
                />
                </div>
            </div>
            <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide="prev"
            >
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide="next"
            >
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
          </div>
          <br></br>

          
          {/* Latest Posts Section */}

          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            margin: '20px 0'
          }}>
            <hr style={{
              flexGrow: 1,
              border: 'none',
              borderTop: '1px solid grey',
              margin: 0
            }} />
            <span style={{
              padding: '0 10px',
              color: '#666',
              fontSize: '1.2em'
            }}>
              Latest posts
            </span>
            <hr style={{
              flexGrow: 1,
              border: 'none',
              borderTop: '1px solid grey',
              margin: 0
            }} />
          </div>
    
          <div className="container my-5">
            <div className="row">
              {latestPosts.map((post) => {
                const countryInfo = getCountryInfo(post.country_name);
                return (
                  <div className="col-md-4 mb-4" key={post.id}>
                    <div className="card shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title">{post.title}</h5>
                        <p className="card-text">{post.content}</p>
                        <p><strong>Country:</strong> {post.country_name}</p>
                        {countryInfo && (
                          <div className="country-info">
                            <img 
                              src={countryInfo.flags.png} 
                              alt={`${post.country_name} Flag`} 
                              className="mb-2"
                              style={{ width: '80px', border: '1px solid #ddd' }}
                            />
                            <p className="mb-1">
                              <strong>Capital:</strong> {countryInfo.capital?.[0] || 'N/A'}
                            </p>
                          </div>
                        )}
                        <p><strong>Date of Visit:</strong> {new Date(post.date_of_visit).toLocaleDateString()}</p>
                      </div>
                      <div className="card-footer bg-white">
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => navigate(`/posts/${post.id}`)} 
                        >
                          Read More
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    };
export default Home;