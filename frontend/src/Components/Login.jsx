import React from "react";
import { Link } from "react-router-dom";
import{useNavigate} from "react-router-dom";
import axios from "axios";
import { useState } from "react";

function Login() {
  const[values,setValues]=useState({
          email:"",
          password:""
      })
  
      const navigate = useNavigate();
      const handleFormSubmit = (event) => {
        event.preventDefault();
        axios.post("http://localhost:8000/login", values, {withCredentials:true})
        .then(res=>{
          console.log(res.data)
          if(res.data.status==="success"){
            window.location.href = "/dashboard";
          }else{
            alert(res.data.error)
          }
        })
        .catch(err=>console.log(err))
    
      }
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light p-4">
      <div className="card shadow-sm" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="card-body p-4">
          <h2 className="text-center mb-4">Login to Your Account</h2>

          <form onSubmit={handleFormSubmit}>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                onChange={(e)=>setValues({...values,email:e.target.value})}
                placeholder="Enter your email address"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                onChange={(e)=>setValues({...values,password:e.target.value})}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="d-grid mt-4">
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>
          </form>

          <div className="text-center mt-3">
            <small className="text-muted">
              Don't have an account?
              <a href="/register" className="ms-1 text-primary text-decoration-none">
                Register
              </a>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
