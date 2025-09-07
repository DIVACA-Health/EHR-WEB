import React from 'react'
import Doctors from '../comp/doctorsdashboard'
import { Suspense } from 'react'

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Doctors/>
    </Suspense>

  )
}

export default page