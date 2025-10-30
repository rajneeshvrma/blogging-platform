import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CompassIcon } from '../components/common/Icons';

const categories = [
    { name: "Tech", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1470&auto=format&fit=crop", description: "Explore the latest in technology, from software development to AI and hardware innovations." },
    { name: "Travel", image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1470&auto=format&fit=crop", description: "Discover breathtaking destinations, travel tips, and stories from globetrotters around the world." },
    { name: "Lifestyle", image: "https://cdn.pixabay.com/photo/2015/01/14/15/38/street-599202_640.jpg", description: "Find inspiration for a better life, covering wellness, productivity, and personal growth." },
    { name: "Finance", image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=1470&auto=format&fit=crop", description: "Your guide to personal finance, investing, budgeting, and understanding the economy." },
    { name: "Health", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1399&auto=format&fit=crop", description: "Stay informed on health, fitness, nutrition, and mental well-being for a balanced life." },
    { name: "Food", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1480&auto=format&fit=crop", description: "Delicious recipes, restaurant reviews, and culinary adventures for every food lover." },
];

const CategoryShowcase = ({ category, isReversed }) => {
    const navigate = useNavigate();
    const handleNavigation = () => navigate('/explore-blogs');

    return (
        <div className={`
            flex flex-col md:flex-row items-center justify-center gap-0 w-full
            ${isReversed ? 'md:flex-row-reverse' : ''}
        `}>
            <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center items-center md:items-start">
                <div className={`text-center ${isReversed ? 'md:text-right' : 'md:text-left'} max-w-md`}>
                    <h2 className="text-5xl md:text-6xl font-extrabold text-text-primary mb-4 tracking-tighter">
                        {category.name}
                    </h2>
                    <p className="text-lg text-text-secondary mb-8">
                        {category.description}
                    </p>
                    <button
                        onClick={handleNavigation}
                        className="
                            inline-flex items-center bg-indigo-500 text-white font-semibold 
                            py-3 px-8 rounded-full hover:bg-indigo-600 transition-all 
                            duration-300 transform hover:scale-105 shadow-lg hover:shadow-indigo-500/50
                        "
                    >
                        <CompassIcon className="w-5 h-5 mr-2" />
                        Explore {category.name}
                    </button>
                </div>
            </div>

            <div className="relative w-full md:w-1/2 h-80 md:h-[500px]">
                <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                />
                <div className={`
                    absolute inset-0 w-full md:w-1/2
                    ${isReversed ? 'right-0 bg-gradient-to-l' : 'left-0 bg-gradient-to-r'} 
                    from-background to-transparent
                `}></div>
            </div>
        </div>
    );
};

const CategoriesPage = () => {
    const categoryBgUrl = "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d";
    return (
        <div className="relative isolate">
            <div
                className="fixed w-full inset-0 -z-10 bg-cover bg-fixed bg-center opacity-15"
                style={{ backgroundImage: `url(${categoryBgUrl})` }}
                aria-hidden="true"
            />
            <div className="relative z-0">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
                    <div className="text-center mb-20">
                        <h1 className="text-5xl md:text-7xl font-extrabold text-text-primary mb-4 tracking-tight">
                            Dive Into Our World
                        </h1>
                        <p className="text-lg text-text-secondary max-w-3xl mx-auto">
                            Each category is a unique universe of stories and ideas. Find what fascinates you and start your journey of discovery.
                        </p>
                    </div>
                    <div className="flex flex-col gap-16 md:gap-24">
                        {categories.map((cat, index) => (
                            <CategoryShowcase
                                key={cat.name}
                                category={cat}
                                isReversed={index % 2 !== 0}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoriesPage;