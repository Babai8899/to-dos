import React from 'react'
import Transitions from '../../../components/Transitions'
import FullCalendar from '../../../components/FullCalendar';

function CreateEvent() {
  const pageVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  };
  return (
    <Transitions pageVariants={pageVariants}>
      <FullCalendar />
    </Transitions>
  )
}

export default CreateEvent
