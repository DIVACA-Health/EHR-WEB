import React, { Suspense } from 'react'
import StudentDashboard from '../comp/nursedashboard'

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StudentDashboard />
    </Suspense>

  )
}

export default page