
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MoveRight, Edit3, Zap, Mic, Moon, Sun, Users, Bookmark, Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AnimatedTransition from '@/components/AnimatedTransition';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description, index }) => (
  <AnimatedTransition 
    type="slideUp" 
    delay={0.1 * index}
    className="glass-card p-6 flex flex-col items-start"
  >
    <div className="p-2 bg-primary/10 rounded-lg mb-4">
      {icon}
    </div>
    <h3 className="font-medium text-lg mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </AnimatedTransition>
);

const Index = () => {
  const { currentUser } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4 relative">
        <div className="max-w-5xl mx-auto text-center">
          <AnimatedTransition type="fadeIn">
            <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full inline-block mb-4">
              Introducing Mola7dat
            </span>
          </AnimatedTransition>
          
          <AnimatedTransition type="slideUp" delay={0.1}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Note-taking reimagined
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">.</span>
            </h1>
          </AnimatedTransition>
          
          <AnimatedTransition type="slideUp" delay={0.2}>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Experience a seamless and intelligent note-taking platform designed with simplicity and power in mind. Organize thoughts, collaborate in real-time, and elevate your productivity.
            </p>
          </AnimatedTransition>
          
          <AnimatedTransition type="slideUp" delay={0.3}>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="rounded-full px-6">
                <Link to={currentUser ? "/dashboard" : "/signup"}>
                  {currentUser ? "Go to Dashboard" : "Get Started"} 
                  <MoveRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-6">
                <Link to="/features">
                  Learn more
                </Link>
              </Button>
            </div>
          </AnimatedTransition>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-1/2 left-10 w-12 h-12 rounded-full bg-primary/10 blur-2xl" />
        <div className="absolute top-1/3 right-10 w-24 h-24 rounded-full bg-blue-500/10 blur-3xl" />
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimatedTransition type="fadeIn">
            <div className="text-center mb-16">
              <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full inline-block mb-4">
                Features
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A comprehensive platform with all the tools you need to capture, organize and share your ideas.
              </p>
            </div>
          </AnimatedTransition>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Feature 
              icon={<Edit3 className="h-5 w-5 text-primary" />}
              title="Rich Text Editing"
              description="Create beautifully formatted notes with our intuitive rich text editor."
              index={0}
            />
            <Feature 
              icon={<Zap className="h-5 w-5 text-primary" />}
              title="AI-Powered Summaries"
              description="Generate concise summaries of your lengthy notes with just one click."
              index={1}
            />
            <Feature 
              icon={<Bookmark className="h-5 w-5 text-primary" />}
              title="Tagging & Organization"
              description="Categorize and find your notes quickly with a powerful tagging system."
              index={2}
            />
            <Feature 
              icon={<Mic className="h-5 w-5 text-primary" />}
              title="Voice-to-Text"
              description="Capture your thoughts hands-free with accurate speech-to-text conversion."
              index={3}
            />
            <Feature 
              icon={<Moon className="h-5 w-5 text-primary" />}
              title="Dark Mode"
              description="Easy on the eyes with a beautiful dark mode that adapts to your preferences."
              index={4}
            />
            <Feature 
              icon={<Users className="h-5 w-5 text-primary" />}
              title="Real-Time Collaboration"
              description="Work with others seamlessly on shared notes with instant updates."
              index={5}
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-secondary/50">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedTransition type="fadeIn">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform how you take notes?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of users who have already discovered the power of Mola7dat.
            </p>
            <Button asChild size="lg" className="rounded-full px-8">
              <Link to={currentUser ? "/dashboard" : "/signup"}>
                {currentUser ? "Go to Dashboard" : "Get Started for Free"}
              </Link>
            </Button>
          </AnimatedTransition>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-10 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-xl font-bold text-primary">Mola7dat</span>
            </div>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Mola7dat. All rights reserved. By Khatir Redha
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
