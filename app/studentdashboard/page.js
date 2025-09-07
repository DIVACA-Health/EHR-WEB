import React, { Suspense } from 'react'
import Studentdashboard from '../comp/studentdashboard'

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Studentdashboard/>
    </Suspense>

  )
}

export default page