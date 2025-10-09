import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Lightbulb, Heart } from "lucide-react";

export default function AboutUs() {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To empower freshers with the tools, resources, and opportunities they need to launch successful careers in technology."
    },
    {
      icon: Lightbulb,
      title: "Our Vision",
      description: "To become the most trusted platform for freshers seeking their first breakthrough in the tech industry."
    },
    {
      icon: Users,
      title: "Our Community",
      description: "A thriving community of 100,000+ freshers, mentors, and companies working together for career success."
    },
    {
      icon: Heart,
      title: "Our Values",
      description: "We believe in transparency, accessibility, and creating equal opportunities for all aspiring tech professionals."
    }
  ];

  const team = [
    {
      name: "Priya Sharma",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
      bio: "Former recruiter passionate about helping freshers find their first tech role."
    },
    {
      name: "Rahul Verma",
      role: "Head of Technology",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      bio: "Software engineer with 10+ years experience building scalable platforms."
    },
    {
      name: "Anjali Patel",
      role: "Community Manager",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      bio: "Dedicated to building and nurturing our community of tech freshers."
    },
    {
      name: "Vikram Singh",
      role: "Head of Content",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
      bio: "Creating educational content that helps freshers upskill and succeed."
    }
  ];

  const stats = [
    { value: "100,000+", label: "Registered Users" },
    { value: "5,000+", label: "Jobs Posted" },
    { value: "500+", label: "Partner Companies" },
    { value: "95%", label: "Success Rate" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-accent text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About Talentd</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Bridging the gap between talented freshers and their dream tech careers
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Talentd was born from a simple observation: talented freshers were struggling to find their first opportunities in tech, 
            while companies were desperately seeking fresh talent. We set out to solve this problem by creating a platform that 
            connects freshers with opportunities, provides learning resources, and builds a supportive community.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">What We Stand For</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Team */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index}>
                <CardContent className="pt-6 text-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                  <p className="text-sm text-primary mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-muted py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Be part of a community that's reshaping how freshers enter the tech industry
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="/register"
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Get Started
            </a>
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 border border-input bg-background rounded-md hover:bg-accent transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
