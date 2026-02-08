import { url } from "../data/constant";

export function ShuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

type Position = { x: number; y: number }

interface PositionedNode {
  position: Position
}

export function positionOnVerticalSineWave<T extends PositionedNode>(
  nodes: T[],
  options?: {
    amplitude?: number
    verticalGap?: number
    startY?: number
    phaseOffset?: number
  }
): T[] {
  const {
    amplitude = 80,
    verticalGap = 130,
    startY = 50,
    phaseOffset = 0
  } = options || {}

  return nodes.map((node, index) => {
    const theta = index * Math.PI + Math.PI / 2 + phaseOffset
    const x = amplitude * Math.sin(theta)
    const y = startY + index * verticalGap

    return {
      ...node,
      position: { x, y }
    }
  })
}

export const getuserprog = async () => {
  console.log('getuserprog called')
  
  try {
    const token = localStorage.getItem('access_token')
    console.log('Token exists:', !!token)
    
    if (!token) {
      console.error('No access token found')
      return { highest_completed: 0 }
    }

    console.log('Fetching:', `${url}/questions/user/progress`)
    
    const response = await fetch(`${url}/questions/user/progress`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    console.log('Progress API status:', response.status)

    if (!response.ok) {
      console.error('API returned error:', response.status)
      
      try {
        const errorText = await response.text()
        console.error('Error response:', errorText)
      } catch (e) {
        console.error('Could not read error body')
      }
      
      return { highest_completed: 0 }
    }

    const prog = await response.json()
    console.log('Progress data received:', prog)
    
    return prog
  } catch (error) {
    console.error('Exception in getuserprog:', error)
    return { highest_completed: 0 }
  }
}

export const callquest = async (questno: number) => {
  console.log(`callquest(${questno}) called`)
  
  try {
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      console.error('No access token')
      return null
    }

    console.log('Fetching:', `${url}/questions/${questno}`)
    
    const response = await fetch(`${url}/questions/${questno}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    console.log(`Question ${questno} API status:`, response.status)

    if (!response.ok) {
      console.error(`Failed to fetch question ${questno}:`, response.status)
      return null
    }

    const quest = await response.json()
    console.log(`Question ${questno} data:`, quest)
    
    return quest
  } catch (err) {
    console.error(`Exception fetching question ${questno}:`, err)
    return null
  }
}

export const validateAnswer = async (questionNo: number, answer: string | null , isTheory: boolean = false) => {
  console.log('=== VALIDATE ANSWER START ===')
  console.log('Question:', questionNo)
  console.log('Answer:', answer)
  console.log('Is theory:', isTheory)
  
  try {
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      console.error('No access token')
      return null
    }

    const apiUrl = `${url}/questions/validate`
    
    const requestBody: any = {
      question_number: questionNo,
      answer: isTheory ? "" : (answer || "")
    }

    console.log('Sending to backend:', JSON.stringify(requestBody))
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody)
    })

    console.log('Backend response status:', response.status)

    if (!response.ok) {
      console.error('Backend returned error status:', response.status)
      
      try {
        const errorData = await response.json()
        console.error('Backend error data:', JSON.stringify(errorData, null, 2))
      } catch (e) {
        console.error('Could not parse error')
      }
      
      return null
    }

    const result = await response.json()
    console.log('=== BACKEND RESPONSE ===')
    console.log('Raw response:', JSON.stringify(result, null, 2))
    console.log('All keys in response:', Object.keys(result))
    console.log('Type of response:', typeof result)
    
    // Log each possible field
    console.log('Checking fields:')
    console.log('  result.correct:', result.correct, '(type:', typeof result.correct, ')')
    console.log('  result.is_correct:', result.is_correct, '(type:', typeof result.is_correct, ')')
    console.log('  result.isCorrect:', result.isCorrect, '(type:', typeof result.isCorrect, ')')
    console.log('  result.result:', result.result, '(type:', typeof result.result, ')')
    console.log('  result.status:', result.status, '(type:', typeof result.status, ')')
    console.log('  result.success:', result.success, '(type:', typeof result.success, ')')
    console.log('=== END BACKEND RESPONSE ===')
    
    return result
  } catch (err) {
    console.error('Exception in validateAnswer:', err)
    return null
  }
}