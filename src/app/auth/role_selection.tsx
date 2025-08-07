'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function RoleSelection() {
  const [name, setName] = useState('')
  const [role, setRole] = useState('student')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Optional: prevent access if already has profile
    const checkProfile = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession()

      const user = session?.user
      if (!user) return router.push('/')

      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile) {
        router.push(profile.role === 'faculty' ? '/faculty' : '/student')
      }
    }

    checkProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const {
      data: { session }
    } = await supabase.auth.getSession()

    const user = session?.user
    if (!user) return router.push('/')

    const { error } = await supabase.from('users').insert({
      id: user.id,
      name,
      role
    })

    if (error) {
      console.error('Insert error:', error)
      setLoading(false)
      return
    }

    // Redirect based on role
    router.push(role === 'faculty' ? '/faculty' : '/student')
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Setup Your Profile</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px' }}>
        <label>
          Name:
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>

        <label>
          Role:
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
          </select>
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}
