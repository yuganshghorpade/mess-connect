'use client'
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';


export default function Register() {
  const router = useRouter();
  // State for user registration
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [userMessage, setUserMessage] = useState('');

  // State for mess registration
  const [messName, setMessName] = useState('');
  const [messEmail, setMessEmail] = useState('');
  const [messPassword, setMessPassword] = useState('');
  const [messContactNo, setMessContactNo] = useState('');
  const [messAddress, setMessAddress] = useState('');
  const [isPureVegetarian, setIsPureVegetarian] = useState(false);
  const [messMessage, setMessMessage] = useState('');


  const submitUserDetails = async () => {
    if (!username || !email || !password || !contactNo) {
      setUserMessage("All fields are required.");
      return;
    }
  
    try {
      const response = await axios.post('/api/auth/register-user', {
        username,
        email,
        password,
        contactNo,
      });
  
      if (response.data.success) {
        setUserMessage('Registration successful! Please verify your account.');
        router.push("/login");
      } else {
        setUserMessage(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setUserMessage(error.response.data.message);
      } else {
        console.error('Error submitting user details:', error);
        setUserMessage('There was an error processing your request.');
      }
    }
  };
  

  // Function to handle mess registration
  const submitMessDetails = async () => {
    console.log(messName,messEmail,messPassword,messContactNo,messAddress);
    try {
      const response = await axios.post('/api/auth/register-mess', {
        name:messName,
        email:messEmail,
        password:messPassword,
        contactNo:messContactNo,
        address:messAddress,
        isPureVegetarian,
      });

      if (response.data.success) {
        setMessMessage('Mess registration successful!Redirecting to login page.');
        router.push('/login')
      } else {
        setMessMessage(response.data.message);
      }
    } catch (error) {
      console.error('Error submitting mess details:', error);
      setMessMessage('There was an error processing your request.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Register as User</TabsTrigger>
          <TabsTrigger value="register-mess">Register as Mess</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>User Registration</CardTitle>
              <CardDescription>
                Fill in your details to create an account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="contactNo">Contact Number</Label>
                <Input
                  id="contactNo"
                  value={contactNo}
                  onChange={(e) => setContactNo(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={submitUserDetails}>Register User</Button>
            </CardFooter>
            {userMessage && <p>{userMessage}</p>}
          </Card>
        </TabsContent>

        <TabsContent value="register-mess">
          <Card>
            <CardHeader>
              <CardTitle>Mess Registration</CardTitle>
              <CardDescription>Fill in your mess details to register.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="messName">Mess Name</Label>
                <Input
                  id="messName"
                  value={messName}
                  onChange={(e) => setMessName(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="messEmail">Email</Label>
                <Input
                  id="messEmail"
                  value={messEmail}
                  onChange={(e) => setMessEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="messPassword">Password</Label>
                <Input
                  id="messPassword"
                  type="password"
                  value={messPassword}
                  onChange={(e) => setMessPassword(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="messContactNo">Contact Number</Label>
                <Input
                  id="messContactNo"
                  value={messContactNo}
                  onChange={(e) => setMessContactNo(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="messAddress">Address</Label>
                <Input
                  id="messAddress"
                  value={messAddress}
                  onChange={(e) => setMessAddress(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2"> {/* Flexbox for alignment */}
                <input
                  type="checkbox"
                  id="isPureVegetarian"
                  checked={isPureVegetarian}
                  onChange={() => setIsPureVegetarian(!isPureVegetarian)}
                  className="h-4 w-4" // Adjusts the size of the checkbox
                />
                <Label htmlFor="isPureVegetarian" className="text-sm">Is Pure Vegetarian?</Label> {/* Smaller label size */}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={submitMessDetails}>Register Mess</Button>
            </CardFooter>
            {messMessage && <p>{messMessage}</p>}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
