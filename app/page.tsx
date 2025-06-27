'use client';
import { useAuthCheck } from "@/hooks/useAuthCheck";
import Loading from "./loading";

export default function Home() {
  // Call the auth check function at the beginning of your component
  const isChecking = useAuthCheck({ requireAuth: true }); // Default behavior: redirect if authenticated  
  // You can optionally show a minimal loading state while redirecting
  // While checking auth status
  if (isChecking) {
    return <Loading /> // Or null, or whatever loading state you prefer
  }

  return <></>
  // Rest of your component (though it won't render since we always redirect)
  // ...existing code...
}