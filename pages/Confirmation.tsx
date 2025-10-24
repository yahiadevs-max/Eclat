
import React from 'react';
import { Link } from 'react-router-dom';

const Confirmation: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <div className="bg-white p-12 rounded-lg shadow-xl max-w-2xl mx-auto">
        <svg className="w-16 h-16 mx-auto text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Merci pour votre commande !</h1>
        <p className="text-gray-600 mb-6">Votre commande a bien été enregistrée. Un email de confirmation vous a été envoyé.</p>
        <p className="text-sm text-gray-500 mb-8">Votre numéro de commande est : <span className="font-semibold text-gray-700">#123-456789</span></p>
        <Link to="/" className="bg-accent text-white font-bold py-3 px-8 rounded-md hover:bg-accent-hover transition-colors">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default Confirmation;