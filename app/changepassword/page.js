export const dynamic = "force-dynamic";

import React from 'react'
import { Suspense } from "react";
import Changepassword from '../comp/changepassword'

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
          <Changepassword/> 
    </Suspense>

  )
}

export default page