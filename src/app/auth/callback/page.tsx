// app/auth/callback/page.tsx

'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const user = session.user;
  
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
  
        if (profile) {
          // Route based on role
          if (profile.role === 'faculty') {
            router.push('/faculty');
          } else {
            router.push('/student');
          }
        } else {
          // New user — no profile yet
          router.push('/role_selection'); // A page to ask name and role
        }
      }
    });
  }, []);
  

  return <p>Logging you in...</p>;
}
