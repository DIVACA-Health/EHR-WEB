export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Authentication from '../comp/authentication';

export default function AuthenticationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Authentication />
    </Suspense>
  );
}
