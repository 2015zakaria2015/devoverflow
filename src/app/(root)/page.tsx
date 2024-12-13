import React from 'react'
import { auth } from '@/auth'
import { Button } from '@/src/components/ui/button';

const HomePage = async () => {
  const session = await auth() ;
  console.log(session);

  return (
    <>
    <h1></h1>


    <form>
      <Button>

      </Button>
    </form>
    
    </>
  )
}

export default HomePage