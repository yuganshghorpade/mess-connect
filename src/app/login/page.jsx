'use client'
import { useState } from "react";
import { useRouter } from 'next/navigation';  
import axios from "axios";
import Link from "next/link";
import { Loader, Loader2 } from "lucide-react";

export default function Login() {

    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [accountType, setAccountType] = useState("user");  
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const router = useRouter();  

    const handleSubmit = async (e) => {
        setIsLoading(true)
        e.preventDefault();
        setErrorMessage("");  
        setSuccessMessage(""); 
        try {
            const response = await axios.post(`/api/auth/login?acctype=${accountType}`, { 
                email,
                password
            },{
                withCredentials: true
            });

            if (response.data.success) {
                setSuccessMessage("Login successful! Redirecting...");
                setTimeout(() => {
                    if (accountType === 'user') {
                        router.push('/user');  
                    } else if (accountType === 'mess') {
                        router.push('/owner'); 
                    }
                }, 1500);  // Optional: Delay redirection to show success message
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            setErrorMessage(`Login failed. Please check your details. Error: ${error}`);
        }finally{
            setIsLoading(false)
        }
    };

    return (
        <div style={styles.loginContainer}>
            <div style={styles.loginBox}>
                <h2 style={styles.heading}>Login </h2>
                <form onSubmit={handleSubmit}>
                    <div style={styles.formGroup}>
                    <div style={styles.formGroup}>
                        <label>Account Type</label>
                        <select
                            value={accountType}
                            onChange={(e) => {
                                setEmail("")
                                setPassword("")
                                setAccountType(e.target.value)
                            }}
                            required
                            style={styles.input}
                        >
                            <option value="user">User</option>
                            <option value="mess">Mess</option>
                        </select>
                    </div>
                        <label>Email</label>
                        <input 
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label>Password</label>
                        <input 
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                    
                    {isLoading ? (<>
                    <Loader2 className="animate-spin" />
                        <button type="submit" disabled style={styles.btnLogin}>Please Wait</button>
                        </>
                    ) : (
                        <button type="submit" style={styles.btnLogin}>Login</button>
                    )}
                </form>
                {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
                {successMessage && <div style={styles.successMessage}>{successMessage}</div>}

               <Link href={'/register'}> <div className="flex justify-center mt-4 text-blue-600">Create new Account</div></Link>
            </div>
        </div>
    );
}

const styles = {
    loginContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundImage: 'url("/bg.jpg")', 
        backgroundSize: 'cover',  
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#f0f4f7',
        backdropFilter: 'blur(6px)',  
    },
    loginBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.85)',  
        padding: '50px',
        borderRadius: '15px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)', 
        width: '100%',
        maxWidth: '450px',
        animation: 'fadeIn 1s ease-in-out',  
    },
    heading: {
        textAlign: 'center',
        fontSize: '28px',
        fontWeight: '700',
        marginBottom: '40px',
        color: '#2c3e50',
        fontFamily: 'Poppins, sans-serif',  
        letterSpacing: '1px',
        textTransform: 'uppercase',
    },
    formGroup: {
        marginBottom: '25px',
    },
    input: {
        width: '100%',
        padding: '15px',
        fontSize: '16px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxSizing: 'border-box',
        outline: 'none',
        transition: 'all 0.3s',
        fontFamily: 'Poppins, sans-serif',
        backgroundColor: '#f9f9f9',
        boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.05)',
    },
    btnLogin: {
        width: '100%',
        padding: '15px',
        fontSize: '18px',
        backgroundColor: '#03C03C',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.3s, transform 0.2s',
        fontFamily: 'Poppins, sans-serif',
        boxShadow: '0 5px 10px rgba(52, 152, 219, 0.2)',
    },
    errorMessage: {
        marginTop: '20px',
        padding: '12px',
        textAlign: 'center',
        backgroundColor: '#ff6b6b',
        color: '#fff',
        borderRadius: '8px',
        fontFamily: 'Poppins, sans-serif',
    },
    successMessage: {
        marginTop: '20px',
        padding: '12px',
        textAlign: 'center',
        backgroundColor: '#2ecc71',
        color: '#fff',
        borderRadius: '8px',
        fontFamily: 'Poppins, sans-serif',
    }
};
