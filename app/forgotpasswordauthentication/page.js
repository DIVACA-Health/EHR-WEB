export const dynamic = "force-dynamic";

import React from 'react'
import { Suspense } from "react";
import Forgotpasswordauthentication from '../comp/forgotpasswordauthentication'

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Forgotpasswordauthentication/> 
    </Suspense>

  )
}

export default page