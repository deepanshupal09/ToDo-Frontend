"use client";

import { FormControl, FormHelperText, FormLabel } from "@mui/joy";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@mui/joy";
import { Email, Lock, Person } from "@mui/icons-material";
import { signup } from "@/app/actions/api";
import { setAuth } from "@/app/actions/cookie";
import Link from "next/link";

export default function Home() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [helperText, setHelperText] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const router = useRouter();
  async function handleSignUp() {
    if (password !== confirmPassword) {
      setError(true);
      setHelperText("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const response = await signup(email, password, name);
      if (response.token) {
        await setAuth(response.token);
        setLoading(false);
        router.push("/home");
      } else {
        setError(true);
        setLoading(false);
        setHelperText(response.message);
      }
    } catch (error) {
      setLoading(false);
      setError(true);
      setHelperText("Internal Server Error");
      console.log(error);
    }
  }

  return (
    <>
      <div className=" ">
        <div className="flex self-center justify-center min-h-[100vh]  items-center">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSignUp();
            }}
            className="flex flex-col bg-white  rounded-3xl shadow-xl border max-[450px]:backdrop-blur-0 max-[450px]:rounded-none shadow-slate-400 p-6 items-center max-md:space-y-7 md:space-y-10 justify-start h-fit pt-16 pb-10 px-10 max-[450px]:w-[100%] max-[450px]:h-[100vh] w-[470px]  "
          >
            {/* <Image height={130} className="-mb-4" src={logo} alt="logo" /> */}
            <div className="text-[32px] font-medium  ">Sign Up</div>
            <div className="space-y-3 w-full">
              <FormControl className="space-y-2 w-full " error={error}>
                <FormLabel>Name</FormLabel>
                <Input
                  required
                  startDecorator={<Person />}
                  onChange={(e) => {
                    setName(e.target.value);
                    setHelperText("");
                    setError(false);
                  }}
                  size="lg"
                  value={name}
                  error={error}
                  placeholder="Enter your Name"
                  fullWidth
                />
                <FormHelperText>{helperText}</FormHelperText>
              </FormControl>
              <FormControl className="space-y-2 w-full " error={error}>
                <FormLabel>Email Address</FormLabel>
                <Input
                  required
                  startDecorator={<Email />}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setHelperText("");
                    setError(false);
                  }}
                  size="lg"
                  value={email}
                  error={error}
                  placeholder="Enter Email Address"
                  fullWidth
                />
                <FormHelperText>{helperText}</FormHelperText>
              </FormControl>
              <FormControl className="space-y-2 w-full" error={error}>
                <FormLabel>Password</FormLabel>
                <Input
                  required
                  startDecorator={<Lock />}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setHelperText("");
                    setError(false);
                  }}
                  size="lg"
                  value={password}
                  error={error}
                  type="password"
                  placeholder="Enter Password"
                  fullWidth
                />
                <FormHelperText>{helperText}</FormHelperText>
              </FormControl>
              <FormControl className="space-y-2 w-full" error={error}>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  required
                  startDecorator={<Lock />}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setHelperText("");
                    setError(false);
                  }}
                  size="lg"
                  value={confirmPassword}
                  error={error}
                  type="password"
                  placeholder="Enter Password"
                  fullWidth
                />
                <FormHelperText>{helperText}</FormHelperText>
              </FormControl>
            </div>
            <Button type="submit" loading={loading} size="lg" fullWidth>
              Sign Up
            </Button>
            <div className="w-full ">
              <div
                className="w-full text-center text-slate-600"
              >
                Already have an account? <Link href={"/"} className=" font-medium">Sign In</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop> */}
    </>
  );
}
