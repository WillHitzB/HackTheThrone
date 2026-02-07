import { Hexagon, Lock, Check, Star } from 'lucide-react'
import styles from './LevelNode.module.css'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import type { Topic } from '../../data/chapters'

interface LevelNodeProps {
  topic: Topic
  onClick: (topic: Topic) => void
  isDisabled?: boolean
  horizontalSpread?: number
}

const LevelNode = ({ topic, onClick, isDisabled = false, horizontalSpread = 1 }: LevelNodeProps) => {
  const { status, position, title } = topic
  const sideClass = position.x >= 0 ? styles.right : styles.left
  const isLocked = status === 'locked' || isDisabled

  const getStatusIcon = () => {
    switch (status) {
      case 'locked':
        return <Lock size={22} />
      case 'completed':
        return <Check size={30} strokeWidth={3} />
      case 'available':
        return <Star size={30} fill="var(--bg-dark)" />
      default:
        return null
    }
  }

  const handleClick = () => {
    if (!isLocked) onClick(topic)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !isLocked) {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <motion.div
      className={clsx(styles.nodeContainer, styles[status], sideClass)}
      style={{
        left: `calc(50% + ${position.x * horizontalSpread}%)`,
        top: `${position.y}px`
      }}
      initial={{ x: '-50%', opacity: 0 }}
      animate={{ x: '-50%', opacity: 1 }}
      whileHover={!isLocked ? { scale: 1.05 } : {}}
      whileTap={!isLocked ? { scale: 0.95 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      role="button"
      tabIndex={isLocked ? -1 : 0}
      aria-label={`${title} - ${status}`}
      aria-disabled={isLocked}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.iconWrapper}>
        <Hexagon size={80} className={styles.hexBg} strokeWidth={1.5} />
        <div className={styles.content}>
          {getStatusIcon()}
        </div>
      </div>

      <div className={styles.label}>
        {title}
      </div>
    </motion.div>
  )
}

export default LevelNode