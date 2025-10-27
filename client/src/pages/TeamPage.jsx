import React from 'react';
import InfoPageLayout from './InfoPageLayout';
import { LinkedinIcon } from '../components/common/Icons';
// import local image (optional)
import RajneeshImg from '../assets/images/RajneeshIMG.jpg';

const fallbackImg = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

const teamMembers = [
  { 
    name: 'Rajneesh Verma', 
    role: 'Lead Developer', 
    img: RajneeshImg, // use local if exists
    linkedinUrl: 'https://www.linkedin.com/in/rajneeshvrma',
    bio: 'Actively involved in all aspects of the project, including frontend, backend, and overall supervision.'
  },
  { 
    name: 'Tanmay Upadhyay', 
    role: 'Lead Backend Developer', 
    img: 'https://avatars.githubusercontent.com/u/154683976?v=4',
    linkedinUrl: 'https://www.linkedin.com/in/rajesh-kumar-example',
    bio: 'Contributed to backend development and collaborated on integration tasks.'
  },
  { 
    name: 'Logesh', 
    role: 'Head of UI/UX Design', 
    img: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    linkedinUrl: 'https://www.linkedin.com/in/anjali-singh-example',
    bio: 'Assisted in designing and improving the website’s interface and user experience.'
  },
  { 
    name: 'Siddardha Karumuri', 
    role: 'Project Contributor', 
    img: 'https://media.licdn.com/dms/image/v2/D5635AQGKXrS4cW2haw/profile-framedphoto-shrink_100_100/B56Zf65B1BHUAs-/0/1752260943514?e=1762066800&v=beta&t=pTQl57mPBZGGq-GFC2w1kMZ0klCr-rRpeZjksEKAilc',
    linkedinUrl: 'https://www.linkedin.com/in/vikram-mehta-example',
    bio: 'Supported the project with design updates and development assistance where needed.'
  },
  { 
    name: 'Krish', 
    role: 'Team Member', 
    img: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    linkedinUrl: 'https://www.linkedin.com/in/sunita-rao-example',
    bio: 'Contributed as a team member throughout the project.'
  },
  { 
    name: 'Hemu', 
    role: 'Team Member', 
    img: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    linkedinUrl: 'https://www.linkedin.com/in/amit-desai-example',
    bio: 'Contributed as a team member throughout the project.'
  },
];

const TeamMemberCard = ({ name, role, img, linkedinUrl, bio }) => (
  <div className="bg-white/5 backdrop-blur-sm border border-glass rounded-xl text-center p-6 transform transition-transform duration-300 hover:-translate-y-2 flex flex-col items-center h-full">
    <img 
      src={img || fallbackImg} 
      alt={name} 
      onError={(e) => e.target.src = fallbackImg} 
      className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white/20" 
    />
    <h3 className="text-xl font-bold text-text-primary">{name}</h3>
    <p className="text-indigo-400">{role}</p>
    <p className="text-text-secondary text-sm my-4 flex-grow">{bio}</p>
    <a 
      href={linkedinUrl} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="mt-auto text-text-secondary hover:text-white transition-colors"
      aria-label={`LinkedIn profile of ${name}`}
    >
      <LinkedinIcon />
    </a>
  </div>
);

const TeamPage = () => (
  <InfoPageLayout title="Meet the Team">
    <p className="text-center mb-12">
        We are a passionate group of developers, designers, and storytellers dedicated to building the future of blogging.
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.map(member => <TeamMemberCard key={member.name} {...member} />)}
    </div>
  </InfoPageLayout>
);

export default TeamPage;
