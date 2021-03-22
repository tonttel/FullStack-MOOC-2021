import React, { useState } from 'react';

const Header = (props) => <h1>{props.text}</h1>

const Button = ({ handleAction, text }) => {
  return (
    <button onClick={handleAction}>
      {text}
    </button>
  )
}

const StatisticLine = (props) => {
  return (
    <> {props.text} {props.value} <br /> </> 
  )
}

const Statistics = (props) => {
  const totalFeedback = props.good + props.neutral + props.bad
  const average = (props.good - props.bad) / totalFeedback

  if (totalFeedback === 0) {
    return (
      <p>
        No feedback given
      </p>
    )
  }

  return (
    <p>
      <StatisticLine text='Good' value={props.good} />
      <StatisticLine text='Neutral' value={props.neutral} />
      <StatisticLine text='Bad' value={props.bad} />
      <StatisticLine text='Total feedback' value={totalFeedback} />
      <StatisticLine text='Average' value={average} />
    </p>
  )
}

function App() {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Header text='Give feedback' />
      <Button handleAction={() => setGood(good + 1)} text='good' />
      <Button handleAction={() => setNeutral(neutral + 1)} text='neutral' />
      <Button handleAction={() => setBad(bad + 1)} text='bad' />
      <Header text='Statistics' />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div >
  )
}

export default App;