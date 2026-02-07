import { div } from 'framer-motion/client'
import LevelNode from '../components/map/LevelNode'
import { Chapters } from '../data/chapters'
import { useNavigate, useParams } from 'react-router-dom'

const SVG_WIDTH = 100
const BOTTOM_PADDING = 120

const LessonPage = () => {
  const navigate = useNavigate()
  const { chapterID } = useParams()

  const chapter =Chapters.find(c => c.id === Number(chapterID))


  console.log('params : ',useParams())
  console.log('chapters : ',Chapters)
  console.log('ch ids : ',Chapters.map(c=>c.id))

  if (chapter) {
  const maxY = Math.max(...chapter.content.map(t => t.position.y))
  const SVG_HEIGHT = maxY + BOTTOM_PADDING

  const handleNodeClick = (topic: { id: string }) => {
    navigate(`/lesson/${chapter.id}/topic/${topic.id}`)
  }
      return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 120 }}>
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <h1 className="glow-text" style={{ fontSize: '3rem' }}>
          MISSION MAP
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Choose your next target...
        </p>
      </div>

      <div
        style={{
          position: 'relative',
          height: SVG_HEIGHT,
          maxWidth: 600,
          margin: '0 auto'
        }}
      >
        {/* PATH */}
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          preserveAspectRatio="xMidYMin meet"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            pointerEvents: 'none'
          }}
        >
          {chapter.content.map((topic, i) => {
            if (i === chapter.content.length - 1) return null
            const next = chapter.content[i + 1]

            return (
              <line
                key={`${topic.id}-${next.id}`}
                x1={50 + topic.position.x}
                y1={topic.position.y}
                x2={50 + next.position.x}
                y2={next.position.y}
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="2"
                strokeDasharray="6 6"
                strokeLinecap="round"
              />
            )
          })}
        </svg>

        {/* NODES */}
        {chapter.content.map(topic => (
          <LevelNode
            key={topic.id}
            topic={topic}
            onClick={() => handleNodeClick(topic)}
          />
        ))}
      </div>
    </div>
  )
  } else {
        return(<div>ERROR PAGE NOT FOUND !!!!</div>)
  }

}

export default LessonPage