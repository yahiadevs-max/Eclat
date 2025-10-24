import React from 'react';

const teamMembers = [
  { name: 'Alice Martin', role: 'Fondatrice & CEO', image: 'https://picsum.photos/id/237/400/400' },
  { name: 'Bob Dupont', role: 'Directeur Artistique', image: 'https://picsum.photos/id/238/400/400' },
  { name: 'Claire Durand', role: 'Responsable Marketing', image: 'https://picsum.photos/id/239/400/400' },
];

const About: React.FC = () => {
  return (
    <div className="bg-secondary">
      {/* Hero Section */}
      <section className="relative bg-gray-800 text-white py-20 md:py-32">
        <img src="https://picsum.photos/1600/600?blur=2" alt="Atelier de mode" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">À Propos d'Éclat</h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">Plus qu'une marque, une célébration du style personnel et de l'élégance durable.</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-8 text-primary">Notre Mission</h2>
          <p className="text-lg text-gray-700 leading-relaxed text-center">
            Chez Éclat, nous croyons que la mode est une forme d'expression personnelle. Notre mission est de proposer des vêtements et accessoires de haute qualité, conçus avec passion et souci du détail, qui permettent à chacun de révéler son style unique. Nous nous engageons à utiliser des matériaux durables et à collaborer avec des artisans talentueux pour créer des pièces intemporelles que vous chérirez pendant des années.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">Notre Équipe</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {teamMembers.map((member) => (
              <div key={member.name} className="bg-white p-6 rounded-lg shadow-md text-center group">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-gray-200 group-hover:border-accent transition-colors duration-300"
                />
                <h3 className="text-xl font-semibold text-primary">{member.name}</h3>
                <p className="text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;