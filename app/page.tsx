import React from 'react';
import Header from './components/header';
import Card from './components/card';
import cardData from './data/cards.json';

async function fetchData() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
  return response.json();
}

export default async function HomePage() {
  const data = await fetchData();

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