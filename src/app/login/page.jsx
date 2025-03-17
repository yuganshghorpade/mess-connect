'use client'
import { useState } from "react";
import { useRouter } from 'next/navigation';
import axios from "axios";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [accountType, setAccountType] = useState("user");
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        setErrorMessage("");

        try {
            const response = await axios.post(`/api/auth/login?acctype=${accountType}`, {
                email,
                password
            }, {
                withCredentials: true
            });

            if (response.data.success) {
                setTimeout(() => {
                    router.push(accountType === 'user' ? '/user' : '/owner');
                }, 1500);
            } else {
                setErrorMessage(response.data.message);
                setIsLoading(false);
            }
        } catch (error) {
            setErrorMessage("Login failed. Please check your details.");
            setIsLoading(false);
            console.log(error)
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-cover bg-center" 
            style={{ backgroundImage: "url('https://wallpaperaccess.com/full/767352.jpg')" }}>
            <div className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl max-w-md w-full">
                <h2 className="text-3xl font-bold text-center text-green-700 mb-6 uppercase">Login</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-medium">Account Type</label>
                        <select
                            value={accountType}
                            onChange={(e) => {
                                setEmail("");
                                setPassword("");
                                setAccountType(e.target.value);
                            }}
                            required
                            className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-green-500"
                        >
                            <option value="user">User</option>
                            <option value="mess">Mess</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition flex justify-center items-center">
                        {isLoading ? <Loader2 className="animate-spin" /> : "Login"}
                    </button>
                </form>

                {errorMessage && <div className="mt-4 p-3 text-center bg-red-500 text-white rounded-lg">{errorMessage}</div>}

                <Link href="/register" className="block text-center text-blue-600 mt-4 hover:underline">Create a new account</Link>
            </div>
        </div>
    );
}