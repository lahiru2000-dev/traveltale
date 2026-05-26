import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NewPost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [countryName, setCountryName] = useState('');
    const [dateOfVisit, setDateOfVisit] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const values = {
            title,
            content,
            country_name: countryName,
            date_of_visit: dateOfVisit
        };

        try {
            const response = await axios.post(
                "http://localhost:8000/add-new-post", 
                values,
                { withCredentials: true }
            );
            
            if (response.data.status === "ok") {
                alert("Post created successfully!");
                navigate("/dashboard");
            } else {
                alert("Failed to create post");
                console.log(response.data);
            }
        } catch (error) {
            console.error("Error creating post:", error);
            alert("Error creating post. Please try again.");
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Create a New Blog Post</h1>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label htmlFor="title" style={styles.label}>Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={styles.input}
                        placeholder="Enter post title"
                        required
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="content" style={styles.label}>Content</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        style={styles.textarea}
                        placeholder="Write your post content here"
                        required
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="countryName" style={styles.label}>Country Name</label>
                    <input
                        type="text"
                        id="countryName"
                        value={countryName}
                        onChange={(e) => setCountryName(e.target.value)}
                        style={styles.input}
                        placeholder="Enter Country name"
                        required
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="dateOfVisit" style={styles.label}>Date of visit</label>
                    <input
                        type="date"
                        id="dateOfVisit"
                        value={dateOfVisit}
                        onChange={(e) => setDateOfVisit(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>

                <button type="submit" style={styles.button}>Create Post</button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    heading: {
        textAlign: 'center',
        marginBottom: '20px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    formGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        padding: '10px',
        fontSize: '16px',
        border: '1px solid #ccc',
        borderRadius: '4px',
    },
    textarea: {
        width: '100%',
        padding: '10px',
        fontSize: '16px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        minHeight: '150px',
    },
    button: {
        padding: '10px 15px',
        fontSize: '16px',
        color: '#fff',
        backgroundColor: '#007BFF',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default NewPost;