import { Chapters, getRandomFact } from '../data/chapters';
import { useNavigate } from 'react-router-dom';
import { useGamification } from '../context/GamificationContext';
import styles from './home.module.css';
import { Terminal } from 'lucide-react';
import { useState, useEffect } from 'react';

const Home = () => {
    const [Number, setNumber] = useState(0);
    const [dailyFact, setDailyFact] = useState<string>('');
    const navigate = useNavigate();
    const { xp, lives } = useGamification();

    useEffect(() => {
        const fact = getRandomFact();
        setDailyFact(fact);
    }, []);

    const handlesectionClick = (chapter: { id: any; }) => {
        navigate(`/lesson/${chapter.id}`);
        setNumber(chapter.id);
    };

    const handlepracticebtn = () => {
        navigate(`/practice`);
    };

    const getLevel = () => {
        return Math.floor(xp / 100) + 1;
    };

    const calculateRank = () => {
        if (xp >= 1000) return 1;
        else if (xp >= 500) return 10;
        else if (xp >= 200) return 50;
        else if (xp >= 100) return 100;
        else return 999;
    };

    return (
        <div className={styles.container}>
            <div className={styles.sectionswrapper}>
                {Chapters.map((sections) => (
                    <div
                        key={sections.id}
                        onClick={() => handlesectionClick(sections)}
                        className={styles.card}>
                        <h2 className={styles.title}>{sections.title}</h2>
                        <div className={styles.description}>{sections.description}</div>
                    </div>
                ))}
            </div>

            <div className={styles.rightPanel}>
                <div className={styles.fact}>
                    <h1>Fact of the day!</h1>
                    <span>
                        {dailyFact}
                    </span>
                    <span className={styles.factbottom}>
                        we will be having a fact each day!!
                    </span>
                </div>

                <div className={styles.practice}>
                    <h1>Wanna increase your XP in a fastest way?</h1>
                    <div>Try the practice section !!!!</div>
                    <button onClick={handlepracticebtn}>
                        <Terminal size={24} />
                        Practice
                    </button>
                </div>

                <div className={styles.info}>
                    <h1>Your info</h1>
                    <span>Lives remaining: <strong>{lives}</strong></span>
                    <span>Your XP: <strong>{xp}</strong></span>
                    <span>Leaderboard rank: <strong>{calculateRank()}</strong></span>
                </div>
            </div>
        </div>
    );
};

export default Home;