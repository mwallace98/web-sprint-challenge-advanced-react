import AppFunctional from "./AppFunctional"
import {render,screen} from '@testing-library/react'
import React from "react"

// Write your tests here
// test('sanity', () => {
//   expect(true).toBe(false)
// })

test('renders without error', () => {
  render (<AppFunctional />)
})




