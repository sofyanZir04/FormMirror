'use server'

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: { full_name: string }) {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', expires: new Date(0), ...options })
        },
      },
    }
  )

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Unauthorized', success: false }
  }

  // THIS IS THE FIX → include email (and any other NOT NULL columns)
  
    const { error } = await supabase
        .from('profiles')  
        .update({ full_name: formData.full_name })
        .eq('id', user.id) 
  if (error) {
    console.error('Profile Update Error:', error)
    return { error: error.message, success: false }
  }

  revalidatePath('/settings')
  return { success: true, error: null }
}

// 'use server'

// import { createServerClient, type CookieOptions } from '@supabase/ssr'
// import { cookies } from 'next/headers'
// import { revalidatePath } from 'next/cache'

// export async function updateProfile(formData: { full_name: string }) {
//     console.log('Updating profile with data:', formData);
//   const cookieStore = await cookies()

//   // Initialize Supabase Server Client
//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         get(name: string) {
//           return cookieStore.get(name)?.value
//         },
//         set(name: string, value: string, options: CookieOptions) {
//           cookieStore.set({ name, value, ...options })
//         },
//         remove(name: string, options: CookieOptions) {
//           cookieStore.set({ name, value: '', ...options })
//         },
//       },
//     }
//   )
//   console.log('Supabase client initialized.')

//   // 1. Get current user safely on server
//   const { data: { user }, error: authError } = await supabase.auth.getUser()
//     console.log('Fetched user:', user, 'Auth error:', authError)

//   if (authError || !user) {
//     return { error: 'Unauthorized', success: false }
//   }

//   // 2. Perform the update directly on the database
//   const { error } = await supabase
//     .from('profiles')
//     .upsert({
//       id: user.id,
//       full_name: formData.full_name,
//       updated_at: new Date().toISOString(),
//     })

//   if (error) {
//     console.error('Profile Update Error:', error)
//     return { error: error.message, success: false }
//   }

//   // 3. Revalidate to update UI immediately
//   revalidatePath('/settings')
  
//   return { success: true, error: null }
// }