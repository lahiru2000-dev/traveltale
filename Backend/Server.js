import express from 'express';
import mysql from 'mysql'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';



const salt=10;
const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(cookieParser());
dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


app.post('/register', (req, res) => {
    const sql = "INSERT INTO users (`username`, `email`, `password`) VALUES (?)";
    bcrypt.hash(req.body.password.toString(), salt, (err, hashedPassword) => {
        if (err) {
            console.log(err);
            return res.json({ status: "error", message: "Error hashing password" });
        }

        const values = [
            req.body.username,
            req.body.email,
            hashedPassword
        ];

        db.query(sql, [values], (err, data) => {
            if (err) {
                console.log(err);
                return res.json({ status: "error", message: "Database error" });
            }
            return res.json({ status: "ok", message: "User has been created successfully" });
        });
    });
});


app.post('/login', (req, res) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [req.body.email], (err, data) => {
        if (err) return res.status(500).json({ status: "error", error: "Database error" });
        
        if (data.length > 0) {
            bcrypt.compare(req.body.password.toString(), data[0].password, (err, isMatch) => {
                if (err) return res.status(500).json({ status: "error", error: "Server error" });
                
                if (isMatch) {
                    const token = jwt.sign({ id: data[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                    res.cookie('access_token', token, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'strict',
                        maxAge: 3600000 // 1 hour
                    });
                    return res.status(200).json({ 
                        status: "success", 
                        message: "Login successful", 
                        userId: data[0].id 
                    });
                } else {
                    return res.status(400).json({ 
                        status: "error", 
                        error: "Wrong password or username" 
                    });
                }
            });
        } else {
            return res.status(404).json({ 
                status: "error", 
                error: "User not found" 
            });
        }
    });
});

const verifyUser = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json({ status: "error", error: "Unauthorized" });
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ status: "error", error: "Forbidden" });
        req.user = user;
        next();
    });
}


app.get('/dashboard', verifyUser, (req, res) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.query(sql, [req.user.id], (err, data) => {
        if (err) return res.status(500).json({ status: "error", error: "Database error" });
        
        if (data.length > 0) {
            return res.status(200).json({ 
                status: "success", 
                user: data[0] 
            });
        } else {
            return res.status(404).json({ 
                status: "error", 
                error: "User not found" 
            });
        }
    });

})

app.get('/', verifyUser, (req, res) => {
    res.json({ 
        status: "success",
        message: "Authenticated",
        user: req.user 
    });
});

app.get('/logout', (req, res) => {
    res.clearCookie('access_token');
    return res.status(200).json({ status: "success", message: "Logged out successfully" });
})

//add post route
app.post('/add-new-post', verifyUser,  (req, res) => {
    const query = "INSERT INTO blog_posts (title, content, country_name, date_of_visit, user_id) VALUES (?)";

    const values = [
        req.body.title,
        req.body.content,
        req.body.country_name,
        req.body.date_of_visit,
        req.user.id
    ];

    db.query(query, [values], (err, data) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ 
                status: "error", 
                error: "Failed to create post" 
            });
        }
        return res.status(200).json({ 
            status: "ok", 
            message: "Post created successfully" 
        });
    });
});

//fetch blog posts from db
app.get('/get-posts', (req, res) => {
    const sql = 'SELECT * FROM blog_posts ORDER BY created_at DESC';
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ status: "error", error: "Database error" });
        
        if (data.length > 0) {
            return res.status(200).json({ 
                status: "success", 
                posts: data 
            });
        } else {
            return res.status(404).json({ 
                status: "error", 
                error: "No posts found" 
            });
        }
    });
});

//update post route
app.put('/update-post/:id', verifyUser, (req, res) => {
    const sql = 'UPDATE blog_posts SET title = ?, content = ?, country_name = ?, date_of_visit = ? WHERE id = ? AND user_id = ?';
    const values = [
        req.body.title,
        req.body.content,
        req.body.country_name,
        req.body.date_of_visit,
        req.params.id,
        req.user.id
    ];

    db.query(sql, values, (err, data) => {
        if (err) return res.status(500).json({ status: "error", error: "Database error" });
        
        if (data.affectedRows > 0) {
            return res.status(200).json({ 
                status: "success", 
                message: "Post updated successfully" 
            });
        } else {
            return res.status(404).json({ 
                status: "error", 
                error: "Post not found or you are not authorized to update this post" 
            });
        }
    });
});

//delete post route
app.delete('/delete-post/:id', verifyUser, (req, res) => {
    const sql = 'DELETE FROM blog_posts WHERE id = ? AND user_id = ?';
    const values = [req.params.id, req.user.id];

    db.query(sql, values, (err, data) => {
        if (err) return res.status(500).json({ status: "error", error: "Database error" });
        
        if (data.affectedRows > 0) {
            return res.status(200).json({ 
                status: "success", 
                message: "Post deleted successfully" 
            });
        } else {
            return res.status(404).json({ 
                status: "error", 
                error: "Post not found or you are not authorized to delete this post" 
            });
        }
    });
});

//one post route
app.get('/get-post/:id', (req, res) => {
    const sql = 'SELECT * FROM blog_posts WHERE id = ?';
    db.query(sql, [req.params.id], (err, data) => {
        if (err) return res.status(500).json({ status: "error", error: "Database error" });
        
        if (data.length > 0) {
            return res.status(200).json({ 
                status: "success", 
                post: data[0] 
            });
        } else {
            return res.status(404).json({ 
                status: "error", 
                error: "Post not found" 
            });
        }
    });
});

//add comment route
app.post('/add-comment/:postId', verifyUser, (req, res) => {
    const sql = "INSERT INTO comments (content, blog_post_id, user_id) VALUES (?)";
    const values = [
      req.body.content,
      req.params.postId,
      req.user.id
    ];
  
    db.query(sql, [values], (err, data) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ 
          status: "error", 
          error: "Failed to add comment" 
        });
      }
  
      return res.status(200).json({ 
        status: "success", 
        comment: {
          id: data.insertId,
          content: req.body.content,
          user_id: req.user.id,
          created_at: new Date(),
          user_name: req.user.name 
        }
      });
    });
  });

  //fetch comments 

  app.get('/get-comments/:postId', (req, res) => {
    const sql = `
        SELECT c.*, u.username as user_name 
        FROM comments c 
        JOIN users u ON c.user_id = u.id 
        WHERE c.blog_post_id = ? 
        ORDER BY c.created_at DESC
    `;
    db.query(sql, [req.params.postId], (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ 
                status: "error", 
                error: "Database error" 
            });
        }
        return res.json({ 
            status: "success", 
            comments: data 
        });
    });
});


app.listen(8000, () => {
    console.log("Server is running on port 8000")
});