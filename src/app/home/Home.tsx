import React from 'react';
import { Header } from '../../components/Header';
import { Projects } from '../../components/Projects';
import { Quote } from '../../components/Quote';
import { Footer } from '../../components/Footer';

const Home = () => {
    return (
        <div className="min-h-screen px-6 pb-12 pt-[60px]  md:px-12 lg:px-24">
            <Header />
            <Projects />
            <Quote />
            <Footer />
        </div>
    );
};

export default Home;
