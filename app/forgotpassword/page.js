export const dynamic = "force-dynamic";

import React from 'react'
import { Suspense } from "react";
import Forgotpassword from '../comp/forgotpassword'

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
            <Forgotpassword/>
    </Suspense>

  )
}

export default page