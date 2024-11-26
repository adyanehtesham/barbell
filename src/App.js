import React, {useRef, useState, useEffect, useMemo} from 'react'
import './App.css';
import { Canvas, useFrame } from '@react-three/fiber'
import WeightPlan from './WeightPlan';

let source = [5, 10, 10, 10, 25, 25, 45, 45];
let seq = [15, 25, 35, 55, 60];


function Weight(props) {
  const meshRef = useRef();
  useFrame((state, delta) => {
    meshRef.current.rotation.z = 4.7 
    meshRef.current.rotation.x = 90
  });
  return (
    <mesh
     position={props.position}
     ref={meshRef}>
      <cylinderGeometry args={props.size} />
      <meshStandardMaterial/>    
    </mesh>

  )
}

function Barbell(props) {
  const meshRef = useRef();
  useFrame((state, delta) => {
    meshRef.current.rotation.z = 4.7
    meshRef.current.rotation.x = 90
  });
  return (
    <mesh
     position={[0,0,0]}
     ref={meshRef}>
      <cylinderGeometry args={[0.1, 0.1, 10, 32]} />
      <meshStandardMaterial/>    
    </mesh>
  )
}

const getWeightGeometry = (weight) => {
    const weightGeometries = {
      '45' : [2, 2, 1, 32],
      '25' : [1, 1, 1, 32],
      '10' : [0.5, 0.5, 1, 32],
      '5' : [0.25, 0.25, 1, 32]
  }

  return weightGeometries[String(weight)] 
}

function App() {

  const [availableWeights, setAvailableWeights] = useState([5, 10, 10, 10, 25, 25, 45, 45])
  const [progression, setProgression] = useState([15, 25, 35, 55, 60])
  const [currentStep, setCurrentStep] = useState(0)

  const sets = useMemo(() => WeightPlan(availableWeights, progression), [availableWeights, progression])

  const arrangement = []

  for (let j = 0; j < sets[currentStep].length; j++) {
    arrangement.push(<Weight key={j} position={[-1.2 - sets[currentStep].length + j +1, 0, 0]} size={getWeightGeometry(sets[currentStep][j])}/>)
  }

  for (let j = sets[currentStep].length - 1; j >= 0; j--) {
    arrangement.push(<Weight key={j + sets[currentStep].length} position={[1.2 + sets[currentStep].length - j, 0, 0]} size={getWeightGeometry(sets[currentStep][j])}/>)
  }

  const setButtons = []

  for (let i = 0; i < sets.length; i++) {
    setButtons.push(<button onClick={() => setCurrentStep(i)}>Set {i + 1}</button>)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // console.log(e.target.availableWeights.value.split(',').map(num => (Number(num))))
    // console.log(e.target.progression.value.split(',').map(num => (Number(num))))
    setAvailableWeights(e.target.availableWeights.value.split(',').map(num => (Number(num))))
    setProgression(e.target.progression.value.split(',').map(num => (Number(num))))
    setCurrentStep(0)
  }

  return (
    <div id='canvas-container'>
      <Canvas >
      <Barbell />
      {arrangement.map(weight => weight)}
      <ambientLight intensity={0.3} />
      <directionalLight color='white' position={[0, 0, 5]} />
      </Canvas>
      {setButtons.map(button => button)}
      <form onSubmit={e => handleSubmit(e)}>
        <p>Available Weights:</p>
        <input type='text' name='availableWeights' defaultValue={availableWeights} />
        <p>Set Progression (each side):</p>
        <input type='text' name='progression' defaultValue={progression} />
        <br/>
        <button type="submit">Go</button>
      </form>
    </div>
  );
}

export default App;
