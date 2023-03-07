import React from 'react';
import Image from 'next/image';
import apirateslifeforme from '../../public/apirateslifeforme.png';
import dotsoncardstock from '../../public/dotsoncardstock.png';
import heart from '../../public/heart.png';
import seaturtle from '../../public/seaturtle.png';
import starrynightmixedmedia from '../../public/starrynightmixedmedia.png';
import undertherainbow from '../../public/undertherainbow.png';
import underwaterseascape from '../../public/underwaterseascape.png';

const artWork: any[] = [
  apirateslifeforme,
  dotsoncardstock,
  heart,
  seaturtle,
  starrynightmixedmedia,
  undertherainbow,
  underwaterseascape,
];

const Gallery = () => {
  return (
    <div className='flex flex-col'>
      <h1 className='text-3xl text-cyan-800'>Welcome to CH Gallery</h1>
      <p>
        This exhibit features a diverse array of works created with a variety of
        mediums, including crayon, marker, pencil, and even flower petals. The
        pieces on display showcase a range of subjects, from realistic
        depictions of everyday life to whimsical images of fantasy and
        imagination. Each piece in the collection is a testament to the
        creativity and skill of its artist.
      </p>
      <p>
        {' '}
        The crayon drawings evoke a sense of childhood nostalgia, with bright,
        bold colors and simple yet charming compositions. the collection also
        includes pieces created with unconventional materials, such as flower
        petals. These works incorporate natural elements in a way that is both
        beautiful and thought-provoking.
      </p>
      <p>
        {' '}
        Whether the images are based on real life or the imagination, each piece
        in this exhibit is a unique expression of the {"artist's"} vision. We
        invite you to take a closer look and discover the beauty and diversity
        of these wonderful works of art.
      </p>
      <div className='galDisp'>
        {artWork.map((img, index) => (
          <Image src={img} key={index} className='galImg' alt={"Mabel's art"} />
        ))}
      </div>
    </div>
  );
};

export default Gallery;
