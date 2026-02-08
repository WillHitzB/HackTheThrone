// import { useParams, useNavigate } from 'react-router-dom';
// import { Chapters } from '../data/chapters';
// import MissionPlayer from '../components/quiz/MissionPlayer';
// import { url } from '../data/constant';
// import { get } from 'react-hook-form';
// const Topicpage = () => {
//     const { chapterID, topicid } = useParams();
//     const navigate = useNavigate();



//     // Find the chapter first
//     const chapter = Chapters.find((c) => c.id === Number(chapterID));
    
//     // Then find the topic within that chapter
//     const topic = chapter?.content.find((t) => t.id === topicid);

//     if (!topic || !chapter) {
//         return (
//             <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>
//                 <h1>404 - Mission Not Found</h1>
//                 <button onClick={() => navigate('/')}>Return to Base</button>
//             </div>
//         );
//     }

//     return (
//         <div className="container" style={{ paddingTop: '40px' }}>
//             <MissionPlayer Topic={topic} />
//         </div>
//     );
// };

// export default Topicpage;