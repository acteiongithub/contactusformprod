import React, { useState } from 'react';
import axios from 'axios';
import logo from './ActeionLogo.png';
import './App.css';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        message: ''
    });

    const [contacts, setContacts] = useState([]);

    const [errors, setErrors] = useState({});
    const containsNumbers = (str) => /\d/.test(str);
    const specialCharPattern = /[!#$%^&*(),?":{}|<>]/;
    const publicDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'ymail.com', 'rocketmail.com'];

    const validate = () => {
        let errors = {};
        const emailDomain = formData.email.split('@')[1];
        if (!formData.firstname) {
            errors.firstname='Please enter First Name.';
        }
        else if (containsNumbers(formData.firstname)) {
            errors.firstname='The First Name contains numbers. Please enter a First Name without numbers.';
        }
        else if (!formData.lastname) {
            errors.lastname='Please enter Last Name.';
        }
        else if (containsNumbers(formData.lastname)) {
            errors.lastname='The Last Name contains numbers. Please enter a Last Name without numbers.';
        }
        else if (!formData.email) {
            errors.email='Please enter Email.';
        }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email='Please enter valid Email.';
        }
        else if (specialCharPattern.test(formData.email)) {
            errors.email='The Email contains special charectors. Please enter a Email without special charectors.';
        }
        else if (emailDomain && publicDomains.includes(emailDomain.toLowerCase())) {
            errors.email='Please enter work email.';
        }
        else if (formData.phone.trim() !== '' && !/^\d{10}$/.test(formData.phone)) {
            errors.phone='Please enter valid phone.';
        }
        else if (!formData.message) {
            errors.message='Please enter Message.';
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (validate()) {
            try {
                const res = await axios.post('http://localhost:5000/submit', formData);
                setFormData({
                    firstname: '',
                    lastname: '',
                    email: '',
                    phone: '',
                    message: '',
                });
                setErrors('');
                fetchContacts();
                alert(res.data);
            } catch (err) {
                if (err.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.error('Error response data:', err.response.data);
                    console.error('Error response status:', err.response.status);
                    console.error('Error response headers:', err.response.headers);
                } else if (err.request) {
                    // The request was made but no response was received
                    console.error('Error request data:', err.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.error('Error message:', err.message);
                }
                console.error('Error config:', err.config);
            }
        }
    };

    const fetchContacts = () => {
        axios.get('http://localhost:5000/contacts')
            .then(response => {
                setContacts(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the contacts!', error);
            });
    };

    return (
        <div className="form-container">
            <div className="form-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <h2 className="form-title">Contact Us Form</h2>
            </div><br/><br/>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="column">
                        <label htmlFor="firstname" className="form-label">First Name:</label>
                        <input type="text" id="firstname" name="firstname" value={formData.firstname} className="form-input" onChange={handleChange}/>
                        {errors.firstname && <p className='error-message'>{errors.firstname}</p>}
                    </div>
                    <div className="column columnright">
                        <label htmlFor="lastname" className="form-label">Last Name:</label>
                        <input type="text" id="lastname" name="lastname" value={formData.lastname} className="form-input" onChange={handleChange}/>
                        {errors.lastname && <p className='error-message'>{errors.lastname}</p>}
                    </div>
                </div>
                <div className="row">
                    <div className="column">
                        <label htmlFor="email" className="form-label">Email:</label>
                        <input type="text" autoComplete="off" id="email" name="email" value={formData.email} className="form-input" onChange={handleChange}/>
                        {errors.email && <p className='error-message'>{errors.email}</p>}
                    </div>
                    <div className="column columnright">
                        <label htmlFor="phone" className="form-label">Phone:</label>
                        <input type="text" autoComplete="off" id="phone" name="phone" value={formData.phone} className="form-input" onChange={handleChange}/>
                        {errors.phone && <p className='error-message'>{errors.phone}</p>}
                    </div>
                </div>
                <div>
                    <label htmlFor="message" className="form-label">Message:</label>
                    <textarea id="message" maxLength="1499" rows="6" className="form-input" type="text" name="message" value={formData.message} onChange={handleChange}/>
                    {errors.message && <p className='error-message'>{errors.message}</p>}
                </div>
                <div className="submit-button-containercenter">
                    <button type="submit" className="submit-button">Submit</button>
                </div>
            </form><br/><br/>
            <h1>Existing Customers</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Message</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(contacts) && contacts.map(item => (
                        <tr key={item.customerid}>
                            <td>{item.customerid}</td>
                            <td>{item.firstname}</td>
                            <td>{item.lastname}</td>
                            <td>{item.email}</td>
                            <td>{item.phone}</td>
                            <td>{item.message}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ContactForm;
