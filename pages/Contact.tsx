import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="bg-white p-12 rounded-lg shadow-xl max-w-2xl mx-auto">
          <svg className="w-16 h-16 mx-auto text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Merci !</h1>
          <p className="text-gray-600 mb-6">Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.</p>
          <Link to="/" className="bg-accent text-white font-bold py-3 px-8 rounded-md hover:bg-accent-hover transition-colors">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-lg shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary">Contactez-nous</h1>
            <p className="text-gray-600 mt-2">Une question ? Une suggestion ? N'hésitez pas à nous écrire.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom complet</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-accent focus:border-accent bg-white text-primary"
                placeholder="Votre nom"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse e-mail</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-accent focus:border-accent bg-white text-primary"
                placeholder="vous@example.com"
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Sujet</label>
              <input
                type="text"
                name="subject"
                id="subject"
                value={formData.subject}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-accent focus:border-accent bg-white text-primary"
                placeholder="Sujet de votre message"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                name="message"
                id="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-accent focus:border-accent bg-white text-primary"
                placeholder="Écrivez votre message ici..."
              ></textarea>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="w-full md:w-auto inline-flex justify-center py-3 px-12 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors"
              >
                Envoyer le message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;