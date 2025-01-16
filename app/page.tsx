import React from 'react';
import Header from './components/header';
import Card from './components/card';
import cardData from './data/cards.json';

export default async function HomePage() {
  return (
    <>
      <Header />
      <div className="main__container">
        {cardData.map((card) => (
          <Card
            key={card.id}
            title={card.title}
            description={card.description}
            link={card.link}
            linkname={card.linkname}
            image={card.image}
          />
        ))}
      </div>
    </>
  );
}