import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamification } from '../../context/GamificationContext';
import styles from './QuizView.module.css'; // Shared styles
import TheorySlide from './TheorySlide';
import QuizSlide from './QuizSlide';
import type { Topic } from '../../data/chapters';
import { Chapters } from '../../data/chapters';

interface MissionPlayerProps {
    Topic: Topic;
}

const MissionPlayer = ({ Topic }: MissionPlayerProps) => {
    const { chapterID} = useParams();
    const navigate = useNavigate();
    const { addXp, loseLife, lives } = useGamification() as any;
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);

    const slides = Topic.content;
    const currentSlide = slides[currentSlideIndex];

    const handleNext = () => {
        if (currentSlideIndex < slides.length - 1) {
            setCurrentSlideIndex(prev => prev + 1);
        } else {
            // Mission Final Completion
            setIsCompleted(true);

            // Mark chapter as completed and unlock next
            Topic.status = 'completed';
            const nextTopic = Chapters.find(c => c.content.find(t=>t.id=== Topic.id + 1) );
            console.log(nextTopic);
            if (nextTopic && nextTopic.status === 'locked') {
                nextTopic.status = 'available';
            }
        }
    };

    const handleCorrect = () => {
        // Option to play sound or show immediate feedback
    };

    const handleIncorrect = () => {
        loseLife();
    };

    const handleFinish = () => {
        addXp(100);
        navigate(`/lesson/${chapterID}`);
    };

    // Life-up / Game Over state
    if (lives === 0) {
        return (
            <div className={styles.quizContainer} style={{ textAlign: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <h1>SYSTEM FAILURE</h1>
                    <p>You ran out of lives. The node has locked you out.</p>
                    <button className={styles.checkBtn} onClick={() => navigate('/')}>
                        Return to Base
                    </button>
                </motion.div>
            </div>
        );
    }

    if (isCompleted) {
        return (
            <div className={styles.quizContainer} style={{ textAlign: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}
                >
                    <h1>MISSION ACCOMPLISHED</h1>
                    <p>XP REWARD: +100</p>
                    <button className={styles.checkBtn} onClick={handleFinish}>
                        Continue
                    </button>
                </motion.div>
            </div>
        );
    }

    if (!currentSlide) {
        return (
            <div className={styles.quizContainer}>
                <h1>Error: No content found in this mission.</h1>
                <button onClick={() => navigate('/')}>Go Back</button>
            </div>
        );
    }

    return (
        <div className={styles.missionWrapper}>
            {/* Progress Header */}
            <div className={styles.progress}>
                <div
                    className={styles.progressBar}
                    style={{ width: `${Math.max(((currentSlideIndex) / (slides.length - 1)) * 100, 1)}%` }}
                />
            </div>

            <AnimatePresence mode="wait">
                {currentSlide.type === 'theory' ? (
                    <TheorySlide
                        key={currentSlide.id}
                        slide={currentSlide}
                        onNext={handleNext}
                    />
                ) : (
                    <QuizSlide
                        key={currentSlide.id}
                        slide={currentSlide}
                        onCorrect={handleCorrect}
                        onIncorrect={handleIncorrect}
                        onNext={handleNext}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default MissionPlayer;
